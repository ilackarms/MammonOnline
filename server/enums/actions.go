package enums

type Action int

type actions struct {
	IDLE Action
	WALK Action
}

var ACTIONS = actions{
	IDLE: 0,
	WALK: 1,
}
