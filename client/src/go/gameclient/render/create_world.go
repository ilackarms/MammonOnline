package render

import (
	"fmt"
	"github.com/ilackarms/MammonOnline/client/src/go/gameclient/update"
	"github.com/ilackarms/MammonOnline/server/game"
	"github.com/thoratou/go-phaser/generated/phaser"
	"log"
	"math"
)

func DrawWorld(phaserGame *phaser.Game, world *game.World, updateManager *update.Manager, playerUID string) {
	GlobalGroup = phaserGame.Add().Group()
	ForegroundGroup = phaserGame.Add().Group()
	SpriteGroup = phaserGame.Add().Group()
	BackgroundGroup = phaserGame.Add().Group()

	GlobalGroup.Add(&phaser.DisplayObject{ForegroundGroup.Object})
	GlobalGroup.Add(&phaser.DisplayObject{SpriteGroup.Object})
	GlobalGroup.Add(&phaser.DisplayObject{BackgroundGroup.Object})

	GlobalGroup.BringToTop(BackgroundGroup)
	GlobalGroup.BringToTop(SpriteGroup)
	GlobalGroup.BringToTop(ForegroundGroup)

	phaserGame.Physics().StartSystem(phaserGame.Physics().ARCADE())
	//log.Printf("physics: %+v", phaser.PHYSICS.P2JS)
	var player *game.Character
	for _, obj := range world.Objects {
		if obj.GetUID() == playerUID {
			var ok bool
			player, ok = obj.(*game.Character)
			if !ok {
				panic(fmt.Sprintf("obj with player uuid %+v is not of type Character", obj))
			}
			break
		}
	}
	if player == nil {
		panic(fmt.Sprintf("player with uuid "+playerUID+" not found in %+v", world.Objects))
	}

	zone := world.Zones[player.ZoneName]
	mapW, mapH := zone.Size()
	rz := NewRenderZone(phaserGame, player.ZoneName)
	Tilewidth, Tileheight = rz.GetTileDimensions()
	worldX, worldY, offsetX := calculateWorldBounds(
		float64(mapW),
		float64(mapH),
		float64(Tilewidth),
		float64(Tileheight),
	)
	OffsetX = offsetX
	phaserGame.World().SetBounds(0, 0, worldX, worldY)
	//DrawDebugGrid(phaserGame, mapW, mapH)
	rz.Draw(true)
	for x := range zone.Tiles {
		for y := range zone.Tiles[x] {
			tile := zone.Tiles[x][y]
			for _, obj := range tile.Objects {
				objRenderer := NewObjectRenderer(phaserGame, obj, updateManager)
				objRenderer.Draw(x, y)
				if obj.GetUID() == playerUID {
					//log.Printf("following %v\n", obj.GetUID())
					phaserGame.Camera().Follow(objRenderer.Group())
				}
				log.Printf("drawing %s at %v,%v", obj.GetType().String(), x, y)
			}
		}
	}
	//DrawTiles(phaserGame)
	DebugMouseCoordinates(phaserGame, updateManager)
}

//mapW/H are the tile dimensions of the map
//tileW/H are the pixel dimensions of a tile
//return values are x, screen width of isometric map
//y, screen height of isometric map
//offsetX, screen offset to draw 0,0 of map at
func calculateWorldBounds(mapW, mapH, tileW, tileH float64) (int, int, int) {
	m := math.Sqrt(math.Pow(tileW/2, 2) + math.Pow(tileH/2, 2))
	theta := math.Atan(mapH / mapW)
	w := m * mapW
	h := m * mapH
	x := (w + h) * math.Cos(theta)
	y := (w + h) * math.Sin(theta)
	offsetX := h * math.Cos(theta)
	return int(x), int(y), int(offsetX)
}
