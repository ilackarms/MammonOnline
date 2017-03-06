package render

import (
	"encoding/json"
	"fmt"
	"github.com/gopherjs/gopherjs/js"
	"github.com/ilackarms/MammonOnline/server/game/tiled"
	"github.com/thoratou/go-phaser/generated/phaser"
)

type tile struct {
	gid int
}

type renderLayer struct {
	tiles   [][]*tile
	visible bool
}

type RenderZone struct {
	name            string
	game            *phaser.Game
	lowerGroup      *phaser.Group
	upperGroup      *phaser.Group
	lowerLayerImage *phaser.BitmapData
	upperLayerImage *phaser.BitmapData
	tilewidth       int
	tileheight      int
}

func NewRenderZone(game *phaser.Game, name string) *RenderZone {
	tilemapObj := game.Cache().GetJSON(name)
	tilemapJSON := js.Global.Get("JSON").Call("stringify", tilemapObj).String()
	var tilemap tiled.Tilemap
	if err := json.Unmarshal([]byte(tilemapJSON), &tilemap); err != nil {
		panic("failed to unmarshal tilemap from " + tilemapJSON)
	}
	layers := make([]*renderLayer, len(tilemap.Layers))
	var maxGid int
	for l, layer := range tilemap.Layers {
		layers[l] = &renderLayer{
			tiles:   make([][]*tile, layer.Width),
			visible: layer.Visible,
		}
		for x := 0; x < layer.Width; x++ {
			layers[l].tiles[x] = make([]*tile, layer.Height)
			for y := 0; y < layer.Height; y++ {
				gid := layer.Data[x+y*layer.Width]
				layers[l].tiles[x][y] = &tile{
					gid: gid,
				}
				if gid > maxGid {
					maxGid = gid
				}
			}
		}
	}
	tilesets := tilemap.Tilesets
	images := make(map[string]*phaser.Image)
	for _, tileset := range tilesets {
		images[tileset.Name] = game.Cache().GetImage1O(tileset.Name)
	}

	lowerTileImages := make([]*phaser.BitmapData, maxGid)
	upperTileImages := make([]*phaser.BitmapData, maxGid)
	//extract subimage for each tile gid
	for i := 0; i < maxGid; i++ {
		tileset := findTileset(tilesets, i)
		image, ok := images[tileset.Name]
		if !ok {
			panic("getting the iamge for " + tileset.Name)
		}
		lowerTileImages[i] = createTileImage(game, tileset, image, i, true)
		js.Global.Get("console").Call("log", "lowerimage", " pixel ", lowerTileImages[i].GetPixel(lowerTileImages[i].Width()/2, lowerTileImages[i].Height()-32), lowerTileImages[i].Width(), lowerTileImages[i].Height())
		upperTileImages[i] = createTileImage(game, tileset, image, i, false)
	}

	lowerGroup := game.Add().Group()
	upperGroup := game.Add().Group()
	BackgroundGroup.Add(&phaser.DisplayObject{lowerGroup.Object})
	BackgroundGroup.Add(&phaser.DisplayObject{upperGroup.Object})
	BackgroundGroup.BringToTop(upperGroup)

	tilewidth, tileheight := tilemap.Tilewidth, tilemap.Tileheight
	lowerLayerImage := game.Make().BitmapData3O(tilemap.Width*tilewidth, tilemap.Height*tileheight, "lower_layer_image_"+name)
	upperLayerImage := game.Make().BitmapData3O(tilemap.Width*tilewidth, tilemap.Height*tileheight, "upper_layer_image_"+name)
	for _, layer := range layers {
		if !layer.visible && !DebugMode {
			continue
		}
		for x := range layer.tiles {
			for y := range layer.tiles[x] {
				//-1 again here
				gid := layer.tiles[x][y].gid - 1
				if gid < 0 {
					continue
				}
				screenX, screenY := ToScreenCoordinates(x, y)
				lowerImage := lowerTileImages[gid]
				tileset := findTileset(tilesets, gid)
				//shiftX := lowerImage.Width() - tilewidth
				//shiftY := lowerImage.Height() - tileheight
				rect := phaser.NewRectangle(0, 0, lowerImage.Width(), lowerImage.Height())
				//lowerLayerImage.CopyRect(lowerImage, rect, screenX-shiftX+tileset.Tileoffset.X, screenY-shiftY+tileset.Tileoffset.Y)
				lowerLayerImage.CopyRect(lowerImage, rect, 0, 0)

				upperImage := upperTileImages[gid]
				//only if base image was not clipped entirely
				if upperImage != nil {
					shiftX := upperImage.Width() - tilewidth
					shiftY := upperImage.Height() - tileheight
					rect := phaser.NewRectangle(0, 0, upperImage.Width(), upperImage.Height())
					upperLayerImage.CopyRect(upperImage, rect, screenX-shiftX+tileset.Tileoffset.X, screenY-shiftY+tileset.Tileoffset.Y)
				}
			}
		}
	}

	js.Global.Get("console").Call("log", lowerLayerImage)
	for i := 0; i < lowerLayerImage.Pixels().Get("length").Int(); i++ {
		px := lowerLayerImage.Pixels().Index(i)
		if a := px.Int(); a > 0 {
			js.Global.Get("console").Call("log", "pixel ", i, " is ", a)
		}
	}
	js.Global.Get("console").Call("log", lowerLayerImage.Pixels())

	//remove unneeded bitmap data
	for _, img := range lowerTileImages {
		if img != nil {
			game.Delete(img.Key())
		}
	}
	for _, img := range upperTileImages {
		if img != nil {
			game.Delete(img.Key())
		}
	}

	return &RenderZone{
		name:            name,
		game:            game,
		lowerGroup:      lowerGroup,
		upperGroup:      upperGroup,
		lowerLayerImage: lowerLayerImage,
		upperLayerImage: upperLayerImage,
		tilewidth:       tilemap.Tilewidth,
		tileheight:      tilemap.Tileheight,
	}
}

func (zone *RenderZone) Draw(lower bool) {
	if lower {
		lowerLayer := zone.game.Add().Image3O(0, 0, zone.lowerLayerImage)
		zone.lowerGroup.Add(&phaser.DisplayObject{lowerLayer.Object})
	} else {
		upperLayer := zone.game.Add().Image3O(0, 0, zone.upperLayerImage)
		zone.upperGroup.Add(&phaser.DisplayObject{upperLayer.Object})
	}
}

func (rz *RenderZone) GetTileDimensions() (int, int) {
	return rz.tilewidth, rz.tileheight
}

func createTileImage(game *phaser.Game, tileset tiled.Tileset, image *phaser.Image, gid int, lower bool) *phaser.BitmapData {
	width, height := tileset.Tilewidth, tileset.Tileheight
	//local index into this tileset
	//-1 because tiled is weird
	localIdx := gid - (tileset.Firstgid - 1)
	var x0, y0 int
	x0 = (localIdx % tileset.Columns) * (width + tileset.Spacing)
	y0 = (localIdx / tileset.Columns) * (height + tileset.Spacing)
	bmd := game.Make().BitmapData2O(width, height)
	if !lower {
		bmd.Context().BeginPath()
		bmd.Context().MoveTo(0, 0)
		bmd.Context().LineTo(0, height-1/2*tileset.Tileheight-4)
		bmd.Context().LineTo(tileset.Tilewidth/2, height-tileset.Tileheight-8)
		bmd.Context().LineTo(tileset.Tilewidth, height-1/2*tileset.Tileheight-4)
		bmd.Context().LineTo(tileset.Tilewidth, 0)
		bmd.Context().LineTo(0, 0)
		bmd.Context().Clip()
	}
	//fmt.Printf("drawing gid: %v (%v) %v [%v, %v] w:%v y:%v \n", gid, tileset.Firstgid, image.Name(), x0, y0, width, height)
	bmd.Draw4O(image.Object, x0, y0, width, height)
	if !lower {
		bmd.Context().ClosePath()
		//sometimes we clipped out the whole image
		//in this case, return nil
		if !isVisible(bmd, width, height) {
			return nil
		}
	}
	return bmd
}

func findTileset(tilesets []tiled.Tileset, gid int) tiled.Tileset {
	var selected tiled.Tileset
	var found bool
	for _, tileset := range tilesets {
		//fmt.Printf("inspecting tileset %s with firstgid %v, for gid %v", ts.Name, ts.Firstgid, gid)
		//-1 on the gid
		if gid < tileset.Firstgid-1 {
			break
		}
		found = true
		selected = tileset
	}
	if !found {
		panic("no tileset found for gid " + fmt.Sprintf("%v", gid))
	}
	//fmt.Printf("\nselected firstgid %v for %v\n", selected.Firstgid, gid)
	return selected
}

func isVisible(bmd *phaser.BitmapData, width, height int) bool {
	imgData := bmd.Context().Call("getImageData", 0, 0, width, height).Get("data")
	for i := 3; i < imgData.Get("length").Int(); i += 4 {
		if imgData.Index(i).Int() != 0 {
			return true
		}
	}
	return false
}
