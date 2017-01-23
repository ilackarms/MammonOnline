package stateful

import (
	"fmt"
	"github.com/googollee/go-socket.io"
)

type Session struct {
	Socket   socketio.Socket
	Username string
}

func (sess *Session) String() string {
	if sess == nil {
		return "<nil session>"
	}
	return fmt.Sprintf("socket: %+v, username: %s", sess.Socket, sess.Username)
}
