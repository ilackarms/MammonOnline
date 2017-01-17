package login

import "github.com/googollee/go-socket.io"

func AddHandlers(so socketio.Socket) {
	so.On("loginRequest", func(msg string) {

	})
}
