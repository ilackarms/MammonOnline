package handlers

import (
	"github.com/googollee/go-socket.io"
	"github.com/ilackarms/MammonOnline/server/enums"
	"github.com/ilackarms/MammonOnline/server/handlers/login"
	"github.com/ilackarms/MammonOnline/server/handlers/utils"
	"github.com/ilackarms/MammonOnline/server/stateful"
)

// register handlers for this socket
func RegisterHandlers(state *stateful.State, so socketio.Socket) {
	utils.AddHandler(
		so,
		enums.SERVER_EVENTS.LOGIN_REQUEST,
		enums.CLIENT_EVENTS.LOGIN_RESPONSE,
		login.LoginHandler(state, so.Id()),
	)
}
