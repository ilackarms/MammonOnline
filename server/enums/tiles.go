package enums

type Tile int

type tiles struct {
	INVALID_VALUE Tile
	FOREST_WALL   Tile
	FOREST_FLOOR  Tile
	FOREST_PIT    Tile
}

var TILES = tiles{
	INVALID_VALUE: 0,
	FOREST_WALL:   1,
	FOREST_FLOOR:  2,
	FOREST_PIT:    3,
}
