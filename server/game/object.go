package game

import "github.com/ilackarms/MammonOnline/server/enums"

type Object struct {
	UID      string       `json:"uid"`
	Type     enums.Object `json:"type"`
	Position Position     `json:"position"`
}

func (obj *Object) GetUID() string {
	return obj.UID
}

func (obj *Object) GetType() string {
	return obj.UID
}

func (obj *Object) GetPosition() Position {
	return obj.Position
}

type IObject interface {
	GetUID() string
	GetType() string
	GetPosition() Position
}
