package enums

type Direction int

func (a Direction) String() string {
	switch a {
	case DIRECTIONS.S:
		return "s"
	case DIRECTIONS.SW:
		return "sw"
	case DIRECTIONS.W:
		return "w"
	case DIRECTIONS.NW:
		return "nw"
	case DIRECTIONS.N:
		return "n"
	case DIRECTIONS.NE:
		return "ne"
	case DIRECTIONS.E:
		return "e"
	case DIRECTIONS.SE:
		return "se"
	}
	return "invalid"
}

type directions struct {
	S  Direction
	SW Direction
	W  Direction
	NW Direction
	N  Direction
	NE Direction
	E  Direction
	SE Direction
}

var DIRECTIONS = directions{
	S:  0,
	SW: 1,
	W:  2,
	NW: 3,
	N:  4,
	NE: 5,
	E:  6,
	SE: 7,
}
