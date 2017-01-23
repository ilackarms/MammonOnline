package handlers

import (
	log "github.com/Sirupsen/logrus"
	"github.com/googollee/go-socket.io"
	"github.com/ilackarms/MammonOnline/server/enums"
	"github.com/ilackarms/MammonOnline/server/handlers/utils"
	"github.com/ilackarms/MammonOnline/server/stateful"
)

func disconnectionHandler(state *stateful.State, so socketio.Socket) utils.HandleFunc {
	return func(msg string) (interface{}, error, enums.ErrorCode) {
		log.Info("client " + so.Id() + " disconnected")
		sess, err := state.GetSessionForSocket(so.Id())
		if err != nil {
			log.Warn("it appears "+so.Id()+" was not logged in. nothing to do.", err)
		} else {
			if err := state.TerminateSession(so.Id()); err != nil {
				log.Errorf("error terminating session for "+sess.Username, err)
			} else {
				log.Info("session terminated for user "+sess.Username, err)
			}
		}
		return nil, nil, enums.ERROR_CODES.NIL
	}
}
