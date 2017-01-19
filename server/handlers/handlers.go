package handlers

import (
	"github.com/googollee/go-socket.io"
	"github.com/ilackarms/MammonOnline/server/enums"
	"github.com/ilackarms/MammonOnline/server/handlers/connected"
	"github.com/ilackarms/MammonOnline/server/handlers/login"
	"github.com/ilackarms/MammonOnline/server/handlers/utils"
	"github.com/ilackarms/MammonOnline/server/stateful"
)

type handlerRoute struct {
	enums.ServerEvent
	enums.ClientEvent
	utils.HandleFunc
}

// register handlers for this socket
func RegisterHandlers(state *stateful.State, so socketio.Socket) {
	routes := []handlerRoute{
		//Initial Connection Handler
		{
			enums.SERVER_EVENTS.CONNECTION,
			enums.CLIENT_EVENTS.CONNECTION_ACK,
			connected.Handler(so),
		},
		//Login Handler
		{
			enums.SERVER_EVENTS.LOGIN_REQUEST,
			enums.CLIENT_EVENTS.LOGIN_RESPONSE,
			login.Handler(state, so),
		},
	}

	for _, route := range routes {
		utils.AddHandler(
			so,
			route.ServerEvent,
			route.ClientEvent,
			route.HandleFunc,
		)
	}
}
