package game

import "github.com/emc-advanced-dev/pkg/errors"

type World struct {
	Objects map[string]IObject `json:"objects"`
	Zones   map[string]*Zone   `json:"zones"`
}

func NewWorld() *World {
	return &World{
		Objects: make(map[string]IObject),
		Zones:   make(map[string]*Zone),
	}
}

func (world *World) AddObject(zoneName string, obj IObject) error {
	position := obj.GetPosition()
	zone, ok := world.Zones[zoneName]
	if !ok {
		return errors.New("zone "+zoneName+" does not exist!", nil)
	}
	// add object to tile
	zone.Tiles[position.X][position.Y].Objects = append(zone.Tiles[position.X][position.Y].Objects, obj)
	// add object to world object inventory
	world.Objects[obj.GetUID()] = obj
	return nil
}
