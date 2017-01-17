package api

import "github.com/ilackarms/MammonOnline/server/enums"

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Result         enums.Result `json:"result"`
	Error          string       `json:"error"`
	CharacterNames []string     `json:"character_names"`
}
