package handlers

import (
	log "github.com/Sirupsen/logrus"
	"github.com/emc-advanced-dev/pkg/errors"
	"github.com/googollee/go-socket.io"
	"github.com/ilackarms/MammonOnline/server/api"
	"github.com/ilackarms/MammonOnline/server/enums"
	"github.com/ilackarms/MammonOnline/server/handlers/utils"
	"github.com/ilackarms/MammonOnline/server/stateful"
)

func deleteCharacterHandler(state *stateful.State, so socketio.Socket) utils.HandleFunc {
	return func(msg string) (interface{}, error, enums.ErrorCode) {
		var req api.DeleteCharacterRequest
		if err := utils.ParseRequest(msg, &req); err != nil {
			return nil, err, enums.ERROR_CODES.INVALID_REQUEST
		}
		session, err := state.GetSessionForSocket(so.Id())
		if err != nil {
			return nil, err, enums.ERROR_CODES.INTERNAL_ERROR
		}
		if req.Slot < 0 || req.Slot > 2 {
			return nil, errors.New("invalid slot #", nil), enums.ERROR_CODES.INVALID_REQUEST
		}
		character := session.Account.Characters[req.Slot]
		if character == nil {
			return nil, errors.New("character at slot is nil?", nil), enums.ERROR_CODES.INTERNAL_ERROR
		}
		session.Account.DeleteCharacter(req.Slot)
		state.World.DeleteObject(character.GetUID())
		log.Infof("deleted character %v in slot %v", character, req.Slot)
		return nil, nil, enums.ERROR_CODES.NIL
	}
}
