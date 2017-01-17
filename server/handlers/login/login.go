package login

import (
	"github.com/googollee/go-socket.io"
	"github.com/ilackarms/MammonOnline/server/api"
	"github.com/ilackarms/MammonOnline/server/enums"
	"github.com/ilackarms/MammonOnline/server/handlers/utils"
)

func AddHandlers(so socketio.Socket) {
	so.On(enums.SERVER_EVENTS.LOGIN_REQUEST, func(msg string) {
		var loginRequest api.LoginRequest
		if err := utils.ParseRequest(msg, &loginRequest); err != nil {
			utils.ReplyWithError(so, enums.CLIENT_EVENTS.LOGIN_RESPONSE, enums.ERROR_CODES.INVALID_REQUEST, err)
			return
		}
	})
}
