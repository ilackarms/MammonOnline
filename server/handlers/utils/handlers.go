package utils

import (
	log "github.com/Sirupsen/logrus"
	"github.com/googollee/go-socket.io"
	"github.com/ilackarms/MammonOnline/server/enums"
)

type HandleFunc func(msg string) (result interface{}, err error, code enums.ErrorCode)

func AddHandler(so socketio.Socket,
	request enums.ServerEvent,
	response enums.ClientEvent,
	handler HandleFunc) {
	so.On(request, func(msg string) {
		log.Debug("received request: ", msg, " from client", so.Id())
		result, err, code := handler(msg)
		if err != nil {
			log.Error("error handling "+request+" from"+so.Id()+": ", err)
			ReplyWithError(
				so,
				response,
				code,
				err,
			)
		}
		Reply(so, response, result)
	})
}
