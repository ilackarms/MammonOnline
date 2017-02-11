package game

import (
	"github.com/emc-advanced-dev/pkg/errors"
	"sync"
)

type World struct {
	objLock  sync.RWMutex
	zoneLock sync.RWMutex
	Objects  map[string]IObject `json:"objects"`
	Zones    map[string]*Zone   `json:"zones"`
}

func NewWorld() *World {
	return &World{
		Objects: make(map[string]IObject),
		Zones:   make(map[string]*Zone),
	}
}

func (world *World) AddObject(obj IObject) error {
	uid := obj.GetUID()
	position := obj.GetPosition()
	zoneName := obj.GetZoneName()
	world.zoneLock.RLock()
	zone, ok := world.Zones[zoneName]
	if !ok {
		return errors.New("invalid zone "+zoneName, nil)
	}
	world.zoneLock.RUnlock()
	// add object to tile in zone
	zone.Tiles[position.X][position.Y].AddObject(obj)
	// add object to world object inventory
	world.objLock.Lock()
	world.Objects[uid] = obj
	world.objLock.Unlock()
	return nil
}

func (world *World) GetObject(uid string) (IObject, error) {
	world.objLock.RLock()
	obj, ok := world.Objects[uid]
	world.objLock.RUnlock()
	if !ok {
		return nil, errors.New("object "+uid+" not found", nil)
	}
	return obj, nil
}

func (world *World) DeleteObject(uid string) error {
	world.objLock.RLock()
	obj, ok := world.Objects[uid]
	world.objLock.RUnlock()
	if !ok {
		return errors.New("object "+uid+" not found", nil)
	}
	world.objLock.Lock()
	delete(world.Objects, uid)
	world.objLock.Unlock()
	position := obj.GetPosition()
	zoneName := obj.GetZoneName()
	world.zoneLock.RLock()
	zone, ok := world.Zones[zoneName]
	if !ok {
		return errors.New("invalid zone "+zoneName, nil)
	}
	world.zoneLock.RUnlock()
	zone.Tiles[position.X][position.Y].DeleteObject(uid)
	return nil
}
