package enums

type Action int

func (a Action) String() string {
	switch a {
	case ACTIONS.GET_HIT:
		return "get_hit"
	case ACTIONS.ATTACK:
		return "attack"
	case ACTIONS.CAST_SPELL:
		return "cast_spell"
	case ACTIONS.DIE:
		return "die"
	case ACTIONS.IDLE:
		return "idle"
	case ACTIONS.WALK:
		return "walk"
	}
	return "invalid"
}

type actions struct {
	IDLE       Action
	WALK       Action
	ATTACK     Action
	DIE        Action
	CAST_SPELL Action
	GET_HIT    Action
}

var ACTIONS = actions{
	IDLE:       0,
	WALK:       1,
	ATTACK:     2,
	DIE:        3,
	CAST_SPELL: 4,
	GET_HIT:    5,
}
