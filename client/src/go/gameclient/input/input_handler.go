package input

import (
	"fmt"
	"github.com/ilackarms/MammonOnline/client/src/go/gameclient/render"
	"github.com/ilackarms/MammonOnline/client/src/go/gameclient/socket"
	"github.com/ilackarms/MammonOnline/client/src/go/gameclient/update"
	"github.com/ilackarms/MammonOnline/server/enums"
	"github.com/thoratou/go-phaser/generated/phaser"
	"log"
)

func SetHandlers(updateManager *update.Manager, so *socket.Socket, game *phaser.Game) {
	updateManager.AddUpdateFunc("mouse_handler", func() {
		if game.Input().ActivePointer().IsDown() {
			log.Printf("mouse: %d, %d", game.Input().X(), game.Input().Y())
			x, y := render.ToGameCoordinates(game.Input().X()+int(game.Camera().Position().X()),
				game.Input().Y()+int(game.Camera().Position().Y()))
			log.Printf("coords: %d, %d", x, y)
			so.Emit(enums.SERVER_EVENTS.MOVEMENT_REQUEST.String(), fmt.Sprintf("{x: %v, y: %v}", game.Input().X(), game.Input().Y()))
		}
	}, false)
}
