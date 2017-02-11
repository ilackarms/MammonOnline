package game

import "github.com/ilackarms/MammonOnline/server/enums"

type Position struct {
	X uint `json:"x"`
	Y uint `json:"y"`
}

type Attributes struct {
	Strength     uint `json:"str"`
	Dexterity    uint `json:"dex"`
	Intelligence uint `json:"int"`
}

type Character struct {
	*Object
	Attributes Attributes           `json:"attributes"`
	Skills     map[enums.Skill]uint `json:"skills"`
	Class      enums.Class          `json:"class"`
	Portrait   string               `json:"portrait"`
	Name       string               `json:"name"`
	LoggedIn   bool                 `json:"logged_in"`
}
