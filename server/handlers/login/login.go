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

func loginHandler(state *stateful.State, sessionID string) utils.HandleFunc {
	return func(msg string) (*api.LoginResponse, error, enums.ErrorCode) {
		var loginRequest api.LoginRequest
		if err := utils.ParseRequest(msg, &loginRequest); err != nil {
			return nil, err, enums.ERROR_CODES.INVALID_REQUEST
		}
		if state.AccountExists(loginRequest.Username) {
			if state.VerifyAccount(loginRequest.Username, loginRequest.Password) {
				log.Infof("account %v logged in", loginRequest.Username)
				characters := state.GetCharacters(loginRequest.Username)
				names := make([]string, len(characters))
				for i := range characters {
					names[i] = characters[i].Name
				}
				return &api.LoginResponse{
					SessionToken:   sessionID,
					CharacterNames: names,
				}, nil, enums.ERROR_CODES.NIL
			}
			return nil, errors.New("invalid password", nil), enums.ERROR_CODES.INVALID_LOGIN
		}
		state.CreateAccount(loginRequest.Username, loginRequest.Password)
		log.Infof("account %v created", loginRequest.Username)
		return &api.LoginResponse{
			SessionToken:   sessionID,
			CharacterNames: []string{},
		}, nil, enums.ERROR_CODES.NIL
	}
}

// register handlers for this socket
func RegisterHandlers(state *stateful.State, so socketio.Socket) {
	utils.AddHandler(
		so,
		enums.SERVER_EVENTS.LOGIN_REQUEST,
		enums.CLIENT_EVENTS.LOGIN_RESPONSE,
		loginHandler(state, so.Id()),
	)
}
