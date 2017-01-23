package stateful

import (
	"github.com/emc-advanced-dev/pkg/errors"
	"github.com/googollee/go-socket.io"
)

type Character struct {
	Name  string `json:"name"`
	Class string `json:"class"`
}

type Account struct {
	Username   string       `json:"username"`
	Password   string       `json:"password"`
	Characters []*Character `json:"characters"`
}

type PersistentState struct {
	Accounts []*Account `json:"accounts"`
}

func (s *PersistentState) AccountExists(username string) bool {
	for _, account := range s.Accounts {
		if account.Username == username {
			return true
		}
	}
	return false
}

func (s *PersistentState) VerifyAccount(username, password string) bool {
	for _, account := range s.Accounts {
		if account.Username == username {
			return account.Password == password
		}
	}
	return false
}

func (s *PersistentState) CreateAccount(username, password string) {
	s.Accounts = append(s.Accounts, &Account{
		Username: username,
		Password: password,
	})
}

func (s *PersistentState) GetCharacters(username string) []*Character {
	for _, account := range s.Accounts {
		if account.Username == username {
			return account.Characters
		}
	}
	return nil
}

type EphemeralState struct {
	Sessions []*Session
}

func (s *EphemeralState) SessionExists(username string) bool {
	for _, session := range s.Sessions {
		if session.Username == username {
			return true
		}
	}
	return false
}

func (s *EphemeralState) GetSessionForUser(username string) (*Session, error) {
	for _, session := range s.Sessions {
		if session.Username == username {
			return session, nil
		}
	}
	return nil, errors.New("session not found for user "+username, nil)
}

func (s *EphemeralState) GetSessionForSocket(socketID string) (*Session, error) {
	for _, session := range s.Sessions {
		if session.Socket.Id() == socketID {
			return session, nil
		}
	}
	return nil, errors.New("session not found for socket "+socketID, nil)
}

func (s *EphemeralState) InitiateSession(so socketio.Socket, username string) {
	s.Sessions = append(s.Sessions, &Session{
		Socket:   so,
		Username: username,
	})
}

func (s *EphemeralState) TerminateSession(socketID string) error {
	for i, session := range s.Sessions {
		if session.Socket.Id() == socketID {
			s.Sessions = append(s.Sessions[:i], s.Sessions[i+1:]...)
			return nil
		}
	}
	return errors.New("session for "+socketID+" not found", nil)
}

type State struct {
	*PersistentState
	*EphemeralState
}
