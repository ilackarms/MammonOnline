package stateful

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

type State struct {
	*PersistentState
	*EphemeralState
}
