package handlers

import (
	"github.com/googollee/go-socket.io"
	"github.com/ilackarms/MammonOnline/server/enums"
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
		//Login Handler
		{
			enums.SERVER_EVENTS.LOGIN_REQUEST,
			enums.CLIENT_EVENTS.LOGIN_RESPONSE,
			loginHandler(state, so),
		},
		//Disconnection / Logout Handler
		{
			enums.SERVER_EVENTS.DISCONNECTION,
			enums.CLIENT_EVENTS.NO_REPLY,
			disconnectionHandler(state, so),
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
