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
}

func New(phaserGame *js.Object, worldData *js.Object) *js.Object {
	var world game.World
	if err := json.Unmarshal([]byte(worldData.String()), &world); err != nil {
		panic("failed to unmarshal world" + err.Error())
	}
	return js.MakeWrapper(&MammonClient{
		PhaserGame: &phaser.Game{phaserGame},
		World:      &world,
	})
}

func (mammon *MammonClient) Preload() {
	fmt.Print("preloaded")
}

func (mammon *MammonClient) Create() {
	rz := render.NewRenderZone(mammon.PhaserGame, "world", true)
	rz.Draw(0, 0, true)
	fmt.Print("created")
}

func (mammon *MammonClient) Update(deltaObj *js.Object) {
	//delta := deltaObj.Float()
	//fmt.Print-f("updated: %+v %v\n", deltaObj, delta)
}
