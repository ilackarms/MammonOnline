package state

type Character struct {
	Name  string `json:"name"`
	Class string `json:"class"`
}

type Account struct {
	Username   string      `json:"username"`
	Password   string      `json:"password"`
	Characters []Character `json:"characters"`
}

type PersistentState struct {
	Accounts []Account `json:"accounts"`
}

type EphemeralState struct {
	Sessions []Session
}
