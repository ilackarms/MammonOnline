package api

import "github.com/ilackarms/MammonOnline/server/game"

type GameUpdate struct {
	Move *Move `json:"move"`
}

type Move struct {
	MobileID    string        `json:"mobile_id"`
	Destination game.Position `json:"destination"`
	Speed       uint          `json:"speed"`
}
