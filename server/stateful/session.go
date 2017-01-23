package stateful

import (
	"fmt"
	"github.com/googollee/go-socket.io"
	"github.com/ilackarms/MammonOnline/server/game"
)

type Session struct {
	Socket    socketio.Socket
	Account   *Account
	Character *game.Character
}

func (sess *Session) String() string {
	if sess == nil {
		return "<nil session>"
	}
	return fmt.Sprintf("socket: %+v, username: %s", sess.Socket, sess.Account.Username)
}
