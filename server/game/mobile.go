package game

import "github.com/ilackarms/MammonOnline/server/enums"

type Mobile struct {
	*Object
	Action    enums.Action    `json:"action"`
	Direction enums.Direction `json:"direction"`
}
