package game

import (
	"github.com/ilackarms/MammonOnline/server/enums"
)

type Object struct {
	UID      string       `json:"uid"`
	Type     enums.Object `json:"type"`
	Position Position     `json:"position"`
	ZoneName string       `json:"zone_name"`
}

func (obj *Object) GetUID() string {
	return obj.UID
}

func (obj *Object) GetType() enums.Object {
	return obj.Type
}

func (obj *Object) GetPosition() Position {
	return obj.Position
}

func (obj *Object) GetZoneName() string {
	return obj.ZoneName
}

type IObject interface {
	GetUID() string
	GetType() enums.Object
	GetPosition() Position
	GetZoneName() string
}
