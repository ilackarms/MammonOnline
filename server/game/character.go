package game

import (
	"encoding/gob"
	"github.com/ilackarms/MammonOnline/server/enums"
)

type Attributes struct {
	Strength     uint `json:"str"`
	Dexterity    uint `json:"dex"`
	Intelligence uint `json:"int"`
}

type Character struct {
	*Mobile
	Attributes Attributes           `json:"attributes"`
	Skills     map[enums.Skill]uint `json:"skills"`
	Class      enums.Class          `json:"class"`
	Armor      string               `json:"armor"`
	Weapon     string               `json:"weapon"`
	Portrait   string               `json:"portrait"`
	Name       string               `json:"name"`
	LoggedIn   bool                 `json:"logged_in"`
}

func init() {
	gob.Register(&Character{})
}
