package utils

import (
	log "github.com/Sirupsen/logrus"
	"github.com/googollee/go-socket.io"
	"github.com/ilackarms/MammonOnline/server/enums"
)

type HandleFunc func(msg string) (result interface{}, err error, code enums.ErrorCode)

func AddHandler(so socketio.Socket,
	serverEevent enums.ServerEvent,
	clientEvent enums.ClientEvent,
	handler HandleFunc) {
	if err := so.On(serverEevent.String(), func(msg string) {
		log.Debug("received request: ", msg, " from client", so.Id())
		result, err, code := handler(msg)
		if err != nil {
			log.Error("error handling "+serverEevent.String()+" from"+so.Id()+": ", err)
			ReplyWithError(
				so,
				clientEvent,
				code,
				err,
			)
		}
		Reply(so, clientEvent, result)
	}); err != nil {
		log.Fatalf("INVALID HANDLER: %+v", handler)
	}
}
