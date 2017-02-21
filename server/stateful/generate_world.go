package stateful

import (
	"github.com/emc-advanced-dev/pkg/errors"
	"github.com/ilackarms/MammonOnline/server/game"
	"path/filepath"
)

func assetDir(parts ...string) string {
	return filepath.Join("..", "client", "assets", filepath.Join(parts...))
}

func GenerateWorld() (*game.World, error) {
	worldZone, err := game.ZoneFromTilemap("world", assetDir("maps", "world", "world.json"))
	if err != nil {
		return nil, errors.New("creating world zone", err)
	}
	world := game.NewWorld()
	world.AddZone(worldZone)
	return world, nil
}
