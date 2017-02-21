package gameclient

import (
	"encoding/json"
	"fmt"
	"github.com/gopherjs/gopherjs/js"
	"github.com/ilackarms/MammonOnline/client/src/go/render"
	"github.com/ilackarms/MammonOnline/server/game"
	"github.com/thoratou/go-phaser/generated/phaser"
	"log"
	"math"
)

type MammonClient struct {
	PhaserGame *phaser.Game
	World      *game.World
	PlayerUID  string
}

var (
	debugSprites []*phaser.Sprite
	debugMode    = true
)

func New(phaserGame *js.Object, worldData *js.Object, playerUID string) *js.Object {
	render.DebugMode = debugMode
	var world game.World
	fmt.Println(worldData.String())
	if err := json.Unmarshal([]byte(worldData.String()), &world); err != nil {
		panic("failed to deserialize world: " + err.Error())
	}
	return js.MakeWrapper(&MammonClient{
		PhaserGame: &phaser.Game{phaserGame},
		World:      &world,
		PlayerUID:  playerUID,
	})
}

func (mammon *MammonClient) GetGame() *phaser.Game {
	return mammon.PhaserGame
}

func (mammon *MammonClient) GetWorld() *game.World {
	return mammon.World
}

func (mammon *MammonClient) GetSprites() []*phaser.Sprite {
	return debugSprites
}

func (mammon *MammonClient) GetPlayerUID() string {
	return mammon.PlayerUID
}

func (mammon *MammonClient) Preload() {
	fmt.Print("preloaded")
}

func (mammon *MammonClient) Create() {
	mammon.PhaserGame.Physics().StartSystem(mammon.PhaserGame.Physics().ARCADE())
	log.Printf("physics: %+v", phaser.PHYSICS.P2JS)
	var player *game.Character
	for _, obj := range mammon.World.Objects {
		if obj.GetUID() == mammon.PlayerUID {
			var ok bool
			player, ok = obj.(*game.Character)
			if !ok {
				panic(fmt.Sprintf("obj with player uuid %+v is not of type Character", obj))
			}
			break
		}
	}
	if player == nil {
		panic(fmt.Sprintf("player with uuid "+mammon.PlayerUID+" not found in %+v", mammon.World.Objects))
	}

	zone := mammon.World.Zones[player.ZoneName]
	mapW, mapH := zone.Size()
	rz := render.NewRenderZone(mammon.PhaserGame, player.ZoneName)
	render.Tilewidth, render.Tileheight = rz.GetTileDimensions()
	worldX, worldY, offsetX := calculateWorldBounds(
		float64(mapW),
		float64(mapH),
		float64(render.Tilewidth),
		float64(render.Tileheight),
	)
	render.OffsetX = offsetX
	mammon.PhaserGame.World().SetBounds(0, 0, worldX, worldY)
	rz.Draw(offsetX, 0, true)
	for x := range zone.Tiles {
		for y := range zone.Tiles[x] {
			tile := zone.Tiles[x][y]
			for _, obj := range tile.Objects {
				objRenderer := render.NewObjectRenderer(mammon.PhaserGame, obj)
				objRenderer.Draw(x, y)
				if obj.GetUID() == mammon.PlayerUID {
					log.Printf("following %v\n", obj.GetUID())
					mammon.PhaserGame.Camera().Follow(objRenderer.Group())
				}

				sprites := objRenderer.Sprites()
				if debugMode {
					for _, sprite := range sprites {
						debugSprites = append(debugSprites, sprite)
					}
				}

				log.Printf("drawing object at %v,%v", x, y)
			}
		}
	}
	fmt.Print("created")
}

func (mammon *MammonClient) Update(deltaObj *js.Object) {}

func (mammon *MammonClient) Render() {
	if debugMode {
		for _, sprite := range debugSprites {
			if sprite.Visible() {
				mammon.PhaserGame.Debug().BodyInfo(sprite, 32, 32)
				mammon.PhaserGame.Debug().Body(sprite)
			}
		}
	}
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
