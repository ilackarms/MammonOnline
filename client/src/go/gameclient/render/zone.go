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
	layers          []*renderLayer
	tilesets        []tiled.Tileset
	lowerTileImages []*phaser.BitmapData
	upperTileImages []*phaser.BitmapData
	lowerGroup      *phaser.Group
	upperGroup      *phaser.Group
	debugMode       bool
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
		LoadingScreen.SetProgress(float64(i) / float64(maxGid))
		lowerTileImages[i] = createTileImage(game, tileset, image, i, true, DebugMode)
		upperTileImages[i] = createTileImage(game, tileset, image, i, false, DebugMode)
	}

	lowerGroup := game.Add().Group()
	upperGroup := game.Add().Group()
	BackgroundGroup.Add(&phaser.DisplayObject{lowerGroup.Object})
	BackgroundGroup.Add(&phaser.DisplayObject{upperGroup.Object})
	BackgroundGroup.BringToTop(upperGroup)

	return &RenderZone{
		name:            name,
		game:            game,
		layers:          layers,
		tilesets:        tilesets,
		lowerTileImages: lowerTileImages,
		upperTileImages: upperTileImages,
		lowerGroup:      lowerGroup,
		upperGroup:      upperGroup,
		debugMode:       DebugMode,
		tilewidth:       tilemap.Tilewidth,
		tileheight:      tilemap.Tileheight,
	}
}

func (zone *RenderZone) Draw(offsetX, offsetY int, lower bool) {
	for _, layer := range zone.layers {
		if !layer.visible && !zone.debugMode {
			continue
		}
		for x := range layer.tiles {
			for y := range layer.tiles[x] {
				//-1 again here
				gid := layer.tiles[x][y].gid - 1
				if gid < 0 {
					continue
				}
				width, height := zone.tilewidth, zone.tileheight
				screenX, screenY := ToScreenCoordinates(x, y)
				var baseImage *phaser.BitmapData
				if lower {
					baseImage = zone.lowerTileImages[gid]
				} else {
					baseImage = zone.upperTileImages[gid]
					//base image was clipped entirely
					if baseImage == nil {
						continue
					}
				}
				tileset := findTileset(zone.tilesets, gid)
				shiftX := baseImage.Width() - width
				shiftY := baseImage.Height() - height
				finalImage := baseImage
				if zone.debugMode {
					finalImage = zone.game.Make().BitmapData2O(baseImage.Width(), baseImage.Height())
					finalImage.Copy1O(baseImage)
					finalImage.Context().Font = "15px Georgia"
					finalImage.Context().FillStyle = "white"
					finalImage.Context().FillText(fmt.Sprintf("%v,%v", x, y), width/2, height*1/3+shiftY, -1)
				}
				//fmt.Printf("tile %v,%v: %v\n", x, y, tileset.Name)
				gameTile := zone.game.Add().Image3O(screenX+offsetX-shiftX+tileset.Tileoffset.X, screenY+offsetY-shiftY+tileset.Tileoffset.Y, finalImage)
				if lower {
					zone.lowerGroup.Add(&phaser.DisplayObject{gameTile.Object})
				} else {
					zone.upperGroup.Add(&phaser.DisplayObject{gameTile.Object})
				}
				LoadingScreen.SetProgress(float64(x+y*len(layer.tiles)) / float64(len(layer.tiles)*len(layer.tiles[x])))
			}
		}
	}
}

func (rz *RenderZone) GetTileDimensions() (int, int) {
	return rz.tilewidth, rz.tileheight
}

func createTileImage(game *phaser.Game, tileset tiled.Tileset, image *phaser.Image, gid int, lower, debugMode bool) *phaser.BitmapData {
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
	bmd.Context().DrawImage(image.Object, x0, y0, width, height, 0, 0, width, height)
	if !lower {
		bmd.Context().ClosePath()
		//sometimes we clipped out the whole image
		//in this case, return nil
		if !isVisible(bmd, width, height) {
			return nil
		}
	}
	if debugMode {
		bmd.Context().StrokeStyle = "#FF0000"
		bmd.Context().BeginPath()
		bmd.Context().MoveTo(0, height-32)
		bmd.Context().MoveTo(64, height-64)
		bmd.Context().MoveTo(128, height-32)
		bmd.Context().MoveTo(64, height)
		bmd.Context().MoveTo(0, height-32)
		bmd.Context().Stroke()
		bmd.Context().ClosePath()
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
