package game

import "github.com/ilackarms/MammonOnline/server/enums"

type Position struct {
	X int `json:"x"`
	Y int `json:"y"`
}

type Attributes struct {
	Strength     int `json:"str"`
	Dexterity    int `json:"dex"`
	Intelligence int `json:"int"`
}

type Character struct {
	Object
	Attributes Attributes          `json:"attributes"`
	Skills     map[enums.Skill]int `json:"skills"`
	Class      enums.Class         `json:"class"`
	Portrait   string              `json:"portrait"`
	Name       string              `json:"name"`
	Position   Position            `json:"position"`
	Region     enums.Region        `json:"region"`
}
