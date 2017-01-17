package state

import "github.com/googollee/go-socket.io"

type Session struct {
	So socketio.Socket
	Account
}
