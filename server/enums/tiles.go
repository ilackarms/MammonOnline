package enums

type Tile int

type tiles struct {
	INVALID_VALUE Tile
	FOREST_WALL   Tile
	FOREST_FLOOR  Tile
	FOREST_PIT    Tile
}

func (t Tile) Walkable() bool {
	switch t {
	case TILES.FOREST_FLOOR:
		return true
	default:
		return false
	}
}

var TILES = tiles{
	INVALID_VALUE: 0,
	FOREST_WALL:   1,
	FOREST_FLOOR:  2,
	FOREST_PIT:    3,
}
