package gameclient

import (
	"encoding/json"
	"fmt"
	"github.com/gopherjs/gopherjs/js"
	"github.com/ilackarms/MammonOnline/client/src/go/render"
	"github.com/ilackarms/MammonOnline/server/game"
	"github.com/thoratou/go-phaser/generated/phaser"
)

type MammonClient struct {
	PhaserGame *phaser.Game
	World      *game.World
	PlayerUID  string
}

func New(phaserGame *js.Object, worldData *js.Object, playerUID string) *js.Object {
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

func (mammon *MammonClient) Preload() {
	fmt.Print("preloaded")
}

func (mammon *MammonClient) Create() {
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
	rz := render.NewRenderZone(mammon.PhaserGame, player.ZoneName, true)
	rz.Draw(0, 0, true)
	zone := mammon.World.Zones[player.ZoneName]
	for x := range zone.Tiles {
		for y := range zone.Tiles[x] {
			tile := zone.Tiles[x][y]
			for _, obj := range tile.Objects {
				objRenderer := render.NewObjectRenderer(mammon.PhaserGame, obj)
				objRenderer.Draw(x, y)
			}
		}
	}
	fmt.Print("created")
}

func (mammon *MammonClient) Update(deltaObj *js.Object) {
	//delta := deltaObj.Float()
	//fmt.Print-f("updated: %+v %v\n", deltaObj, delta)
}
