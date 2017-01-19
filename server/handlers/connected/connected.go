package connected

import (
	log "github.com/Sirupsen/logrus"
	"github.com/googollee/go-socket.io"
	"github.com/ilackarms/MammonOnline/server/api"
	"github.com/ilackarms/MammonOnline/server/enums"
	"github.com/ilackarms/MammonOnline/server/handlers/utils"
)

func Handler(so socketio.Socket) utils.HandleFunc {
	return func(msg string) (interface{}, error, enums.ErrorCode) {
		log.Info("connection initiated with client " + so.Id())
		return api.ConnectionAcknowledgment{}, nil, enums.ERROR_CODES.NIL
	}
}
