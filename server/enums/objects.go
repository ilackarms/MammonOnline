package enums

type Object int

func (o Object) String() string {
	switch o {
	case OBJECTS.PLAYER:
		return "Player"
	default:
		return "invalid"
	}
}

type objects struct {
	PLAYER Object
}

var OBJECTS = objects{
	PLAYER: 1,
}
