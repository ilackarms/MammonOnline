package handlers

import (
	log "github.com/Sirupsen/logrus"
	"github.com/googollee/go-socket.io"
	"github.com/ilackarms/MammonOnline/server/api"
	"github.com/ilackarms/MammonOnline/server/enums"
	"github.com/ilackarms/MammonOnline/server/handlers/utils"
	"github.com/ilackarms/MammonOnline/server/stateful"
)

func moveRequestHandler(state *stateful.State, so socketio.Socket) utils.HandleFunc {
	return func(msg string) (interface{}, error, enums.ErrorCode) {
		var req api.MoveRequest
		if err := utils.ParseRequest(msg, &req); err != nil {
			return nil, err, enums.ERROR_CODES.INVALID_REQUEST
		}
		session, err := state.GetSessionForSocket(so.Id())
		if err != nil {
			return nil, err, enums.ERROR_CODES.INTERNAL_ERROR
		}
		log.Info("character %v moved to %v", session.Character, req.Destination)
		return nil, nil, enums.ERROR_CODES.NIL
	}
}
