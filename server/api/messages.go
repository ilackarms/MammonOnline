package api

import "github.com/ilackarms/MammonOnline/server/enums"

type ConnectionAcknowledgment struct{}

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

type CreateCharacterRequest struct {
	Attributes struct {
		Strength     int `json:"str"`
		Dexterity    int `json:"dex"`
		Intelligence int `json:"int"`
	} `json:"attributes"`
	Skills        map[enums.Skill]int `json:"skills"`
	SelectedClass enums.Class         `json:"selectedClass"`
	Slot          int                 `json:"slot"`
	PortraitKey   string              `json:"portraitKey"`
	Name          string              `json:"characterName"`
}

type StartGameResponse struct {
	CharacterSlot int `json:"character_slot"`
}
