package game

import (
	"bytes"
	"encoding/gob"
	"encoding/json"
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

func (world *World) AddZone(zone *Zone) {
	world.zoneLock.Lock()
	world.Zones[zone.Name] = zone
	world.zoneLock.Unlock()
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

type worldMessage struct {
	WorldGob []byte `json:"world_gob"`
}

func (world *World) MarshalJSON() ([]byte, error) {
	buf := &bytes.Buffer{}
	enc := gob.NewEncoder(buf)
	if err := enc.Encode(world); err != nil {
		return nil, errors.New("encoding world as gob", err)
	}
	return json.Marshal(worldMessage{
		WorldGob: buf.Bytes(),
	})
}

func (world *World) UnmarshalJSON(data []byte) error {
	var wm worldMessage
	if err := json.Unmarshal(data, &wm); err != nil {
		return errors.New("decoding world message from json", err)
	}
	buf := bytes.NewBuffer(wm.WorldGob)
	dec := gob.NewDecoder(buf)
	if err := dec.Decode(&world); err != nil {
		return errors.New("decoding world from gob", err)
	}
	return nil
}
