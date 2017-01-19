package login

import (
	log "github.com/Sirupsen/logrus"
	"github.com/emc-advanced-dev/pkg/errors"
	"github.com/googollee/go-socket.io"
	"github.com/ilackarms/MammonOnline/server/api"
	"github.com/ilackarms/MammonOnline/server/enums"
	"github.com/ilackarms/MammonOnline/server/handlers/utils"
	"github.com/ilackarms/MammonOnline/server/stateful"
)

func Handler(state *stateful.State, so socketio.Socket) utils.HandleFunc {
	return func(msg string) (interface{}, error, enums.ErrorCode) {
		var loginRequest api.LoginRequest
		if err := utils.ParseRequest(msg, &loginRequest); err != nil {
			return nil, err, enums.ERROR_CODES.INVALID_REQUEST
		}
		if state.AccountExists(loginRequest.Username) {
			if state.VerifyAccount(loginRequest.Username, loginRequest.Password) {
				if state.SessionExists(loginRequest.Username) {
					log.Warnf("account %v already logged in, request rejected", loginRequest.Username)
					return nil, errors.New("user already logged in", nil), enums.ERROR_CODES.INVALID_LOGIN
				}
				state.InitiateSession(so, loginRequest.Username)
				log.Infof("account %v logged in; socket id: %v", loginRequest.Username, so.Id())
				characters := state.GetCharacters(loginRequest.Username)
				names := make([]string, len(characters))
				for i := range characters {
					names[i] = characters[i].Name
				}
				return &api.LoginResponse{
					SessionToken:   so.Id(),
					CharacterNames: names,
				}, nil, enums.ERROR_CODES.NIL
			}
			return nil, errors.New("invalid password", nil), enums.ERROR_CODES.INVALID_LOGIN
		}
		state.CreateAccount(loginRequest.Username, loginRequest.Password)
		log.Infof("account %v created", loginRequest.Username)
		return &api.LoginResponse{
			SessionToken:   so.Id(),
			CharacterNames: []string{},
		}, nil, enums.ERROR_CODES.NIL
	}
}
