package stateful

import (
	"github.com/emc-advanced-dev/pkg/errors"
	"github.com/googollee/go-socket.io"
	"github.com/ilackarms/MammonOnline/server/game"
	"sync"
)

type Account struct {
	Username   string            `json:"username"`
	Password   string            `json:"password"`
	Characters []*game.Character `json:"characters"`
}

func (account *Account) AddCharacter(slot int, character *game.Character) {
	account.Characters[slot] = character
}

func (account *Account) DeleteCharacter(slot int) {
	account.Characters[slot] = nil
}

type PersistentState struct {
	Accounts []*Account  `json:"accounts"`
	World    *game.World `json:"world"`
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
		if account.Username == username && account.Password == password {
			return account, true
		}
	}
	return nil, false
}

func (s *PersistentState) CreateAccount(username, password string) *Account {
	account := &Account{
		Username: username,
		Password: password,
		Characters: []*game.Character{
			nil,
			nil,
			nil,
		},
	}
	s.Accounts = append(s.Accounts, account)
	return account
}

func (s *PersistentState) GetCharacters(username string) []*game.Character {
	for _, account := range s.Accounts {
		if account.Username == username {
			return account.Characters
		}
	}
	return nil
}

type EphemeralState struct {
	Sessions map[string]*Session
	lock     sync.RWMutex
}

func (s *EphemeralState) SessionExists(username string) bool {
	s.lock.RLock()
	defer s.lock.RUnlock()
	for _, session := range s.Sessions {
		if session.Account.Username == username {
			return true
		}
	}
	return false
}

func (s *EphemeralState) GetSessionForUser(username string) (*Session, error) {
	s.lock.RLock()
	defer s.lock.RUnlock()
	for _, session := range s.Sessions {
		if session.Account.Username == username {
			return session, nil
		}
	}
	return nil, errors.New("session not found for user "+username, nil)
}

func (s *EphemeralState) GetSessionForSocket(socketID string) (*Session, error) {
	s.lock.RLock()
	defer s.lock.RUnlock()
	session, ok := s.Sessions[socketID]
	if ok {
		return session, nil
	}
	return nil, errors.New("session not found for socket "+socketID, nil)
}

func (s *EphemeralState) InitiateSession(so socketio.Socket, account *Account) {
	s.lock.Lock()
	defer s.lock.Unlock()
	s.Sessions[so.Id()] = &Session{
		Socket:  so,
		Account: account,
	}
}

func (s *EphemeralState) TerminateSession(socketID string) error {
	s.lock.Lock()
	defer s.lock.Unlock()
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
