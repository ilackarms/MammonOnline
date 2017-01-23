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

func (s *PersistentState) GetAccount(username, password string) (*Account, bool) {
	for _, account := range s.Accounts {
		if account.Username == username {
			return account, true
		}
	}
	return nil, false
}

func (s *PersistentState) CreateAccount(username, password string) *Account {
	account := &Account{
		Username: username,
		Password: password,
	}
	s.Accounts = append(s.Accounts, account)
	return account
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
	Sessions map[string]*Session
}

func (s *EphemeralState) SessionExists(username string) bool {
	for _, session := range s.Sessions {
		if session.Account.Username == username {
			return true
		}
	}
	return false
}

func (s *EphemeralState) GetSessionForUser(username string) (*Session, error) {
	for _, session := range s.Sessions {
		if session.Account.Username == username {
			return session, nil
		}
	}
	return nil, errors.New("session not found for user "+username, nil)
}

func (s *EphemeralState) GetSessionForSocket(socketID string) (*Session, error) {
	session, ok := s.Sessions[socketID]
	if ok {
		return session, nil
	}
	return nil, errors.New("session not found for socket "+socketID, nil)
}

func (s *EphemeralState) InitiateSession(so socketio.Socket, account *Account) {
	s.Sessions[so.Id()] = &Session{
		Socket:  so,
		Account: account,
	}
}

func (s *EphemeralState) TerminateSession(socketID string) error {
	_, ok := s.Sessions[socketID]
	if ok {
		delete(s.Sessions, socketID)
		return nil
	}
	return errors.New("session for "+socketID+" not found", nil)
}

type State struct {
	*PersistentState
	*EphemeralState
}
