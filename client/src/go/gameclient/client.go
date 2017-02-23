package gameclient

import (
	"encoding/json"
	"github.com/gopherjs/gopherjs/js"
	"github.com/ilackarms/MammonOnline/client/src/go/gameclient/render"
	"github.com/ilackarms/MammonOnline/client/src/go/gameclient/socket"
	"github.com/ilackarms/MammonOnline/client/src/go/gameclient/update"
	"github.com/ilackarms/MammonOnline/server/game"
	"github.com/thoratou/go-phaser/generated/phaser"
	"log"
)

//NEXT STEP IS REFACTORING THE CODE A BIT :dDDDDDD
//THEN SOME SOCKET HANDLERS (user inputs, server messages)
type client struct {
	PhaserGame    *phaser.Game
	Socket        *socket.Socket
	World         *game.World
	PlayerUID     string
	Config        *Config
	UpdateManager *update.Manager
}

var (
	debugMode = false
)

func New(phaserGameObj *js.Object, worldData string, so *js.Object, playerUID string) *js.Object {
	render.DebugMode = debugMode
	var world game.World
	//fmt.Println(worldData.String())
	if err := json.Unmarshal([]byte(worldData), &world); err != nil {
		panic("failed to deserialize world: " + err.Error())
	}
	phaserGame := &phaser.Game{phaserGameObj}
	cfg, err := GetFromCache(phaserGame)
	if err != nil {
		panic("failed to reach cfg from cache: " + err.Error())
	}
	return js.MakeWrapper(&client{
		PhaserGame:    phaserGame,
		Socket:        &socket.Socket{so},
		World:         &world,
		PlayerUID:     playerUID,
		Config:        cfg,
		UpdateManager: update.NewManager(),
	})
}

func (c *client) Preload() {
	log.Print("preloaded")
}

func (c *client) Create() {
	render.DrawWorld(c.PhaserGame, c.World, c.UpdateManager, c.PlayerUID)
	log.Print("created")
}

func (c *client) Update(deltaObj *js.Object) {
	for _, fn := range c.UpdateManager.GetUpdateFuncs() {
		fn(deltaObj)
	}
}

func (c *client) Render() {
	for _, fn := range c.UpdateManager.GetRenderFuncs() {
		fn()
	}
}
