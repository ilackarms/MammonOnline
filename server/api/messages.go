package api

import "github.com/ilackarms/MammonOnline/server/enums"

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginResponse struct {
	SessionToken   string   `json:"session_token"`
	CharacterNames []string `json:"character_names"`
}

type ErrorResponse struct {
	Msg  string          `json:"msg"`
	Code enums.ErrorCode `json:"code"`
}
