package input

import (
	"github.com/ilackarms/MammonOnline/client/src/go/gameclient/render"
	"github.com/ilackarms/MammonOnline/client/src/go/gameclient/socket"
	"github.com/ilackarms/MammonOnline/client/src/go/gameclient/update"
	"github.com/ilackarms/MammonOnline/server/api"
	"github.com/ilackarms/MammonOnline/server/enums"
	"github.com/ilackarms/MammonOnline/server/game"
	"github.com/thoratou/go-phaser/generated/phaser"
)

func SetHandlers(updateManager *update.Manager, so *socket.Socket, phaserGame *phaser.Game) {
	updateManager.AddUpdateFunc("mouse_handler", func() {
		if phaserGame.Input().ActivePointer().IsDown() {
			x, y := render.ToGameCoordinates(phaserGame.Input().X()+int(phaserGame.Camera().Position().X()),
				phaserGame.Input().Y()+int(phaserGame.Camera().Position().Y()))
			so.Emit(enums.SERVER_EVENTS.MOVEMENT_REQUEST, api.MoveRequest{
				Destination: game.Position{
					X: uint(x),
					Y: uint(y),
				},
			})
		}
	}, false)
}
