package enums

type Tile int

type tiles struct {
	FOREST_WALL  Tile
	FOREST_FLOOR Tile
	FOREST_PIT   Tile
}

var TILES = tiles{
	FOREST_WALL:  0,
	FOREST_FLOOR: 1,
	FOREST_PIT:   2,
}
