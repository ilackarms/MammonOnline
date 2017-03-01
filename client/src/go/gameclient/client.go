package gameclient

import (
	"encoding/json"
	"github.com/gopherjs/gopherjs/js"
	"github.com/ilackarms/MammonOnline/client/src/go/gameclient/input"
	"github.com/ilackarms/MammonOnline/client/src/go/gameclient/render"
	"github.com/ilackarms/MammonOnline/client/src/go/gameclient/socket"
	"github.com/ilackarms/MammonOnline/client/src/go/gameclient/update"
	"github.com/ilackarms/MammonOnline/server/game"
	"github.com/thoratou/go-phaser/generated/phaser"
	"log"
)

type client struct {
	PhaserGame    *phaser.Game
	Socket        *socket.Socket
	World         *game.World
	PlayerUID     string
	Config        *Config
	UpdateManager *update.Manager
}

func New(phaserGameObj *js.Object, worldData string, so *js.Object, playerUID string) *js.Object {
	var world game.World
	//fmt.Println(worldData.String())
	if err := json.Unmarshal([]byte(worldData), &world); err != nil {
		panic("failed to deserialize world: " + err.Error())
	}
	phaserGame := &phaser.Game{phaserGameObj}
	cfg, err := GetFromCache(phaserGame)
	if err != nil {
		panic("failed to read cfg from cache: " + err.Error())
	}
	render.DebugMode = cfg.DebugMode
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
	render.LoadingScreen = render.DrawLoadingText(c.PhaserGame)
	render.LoadingScreen.Show()
	render.LoadingScreen.SetProgress(0)
	log.Print("preloaded")
}

func (c *client) Create() {
	render.DrawWorld(c.PhaserGame, c.World, c.UpdateManager, c.PlayerUID)
	input.SetHandlers(c.UpdateManager, c.Socket, c.PhaserGame)
	render.LoadingScreen.Hide()
	log.Print("created")
}

func (c *client) Update() {
	c.UpdateManager.ProcessUpdates()
}

func (c *client) Render() {
	c.UpdateManager.ProcessRenders()
}
