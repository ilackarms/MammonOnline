package api

import (
	"github.com/ilackarms/MammonOnline/server/enums"
	"github.com/ilackarms/MammonOnline/server/game"
)

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
		Strength     uint `json:"str"`
		Dexterity    uint `json:"dex"`
		Intelligence uint `json:"int"`
	} `json:"attributes"`
	Skills        map[enums.Skill]uint `json:"skills"`
	SelectedClass enums.Class          `json:"selectedClass"`
	Slot          int                  `json:"slot"`
	PortraitKey   string               `json:"portraitKey"`
	Name          string               `json:"characterName"`
}

type PlayCharacterRequest struct {
	Slot int `json:"slot"`
}

type DeleteCharacterRequest struct {
	Slot int `json:"slot"`
}

type StartGameResponse struct {
	PlayerUID string      `json:"player_uid"`
	World     *game.World `json:"world"`
}

type MoveRequest struct {
	Destination game.Position `json:"destination"`
}

type MoveResponse struct {
	Destination game.Position `json:"destination"`
}
