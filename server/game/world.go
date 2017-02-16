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

//type tileMessage struct {
//	Type    enums.Tile                `json:"type"`
//	Objects map[string]*objectMessage `json:"objects"`
//}
//
//type zoneMessage struct {
//	Name  string           `json:"name"`
//	Tiles [][]*tileMessage `json:"tiles"`
//}
//
//type objectMessage struct {
//	Type enums.Object    `json:"type"`
//	Raw  json.RawMessage `json:"raw"`
//}
//
//type WorldMessage struct {
//	Objects      map[string]*objectMessage `json:"objects"`
//	ZoneMessages map[string]*zoneMessage   `json:"zones"`
//}
//
//func (wm *WorldMessage) Deserialize() (*World, error) {
//	objects := make(map[string]IObject)
//	for uid, objMessage := range wm.Objects {
//		switch objMessage.Type {
//		case enums.OBJECTS.PLAYER:
//			var player Character
//			if err := json.Unmarshal(objMessage.Raw, &player); err != nil {
//				return nil, errors.New("failed to unmarshal player from "+string(objMessage.Raw), err)
//			}
//			objects[uid] = &player
//		default:
//			return nil, errors.New("unknown object type "+objMessage.Type.String(), nil)
//		}
//	}
//	//for name, zone := r
//	return &World{
//		Objects: objects,
//		Zones:   wm.Zones,
//	}, nil
//}
//
////serialization
//func (world World) MarshalJSON() ([]byte, error) {
//	objects := make(map[string]*objectMessage)
//	zones := make(map[string]*zoneMessage)
//	for uid, obj := range world.Objects {
//		raw, err := json.Marshal(obj)
//		if err != nil {
//			return nil, errors.New("failed to marshal obj "+obj.GetUID(), err)
//		}
//		objects[uid] = &objectMessage{
//			Type: obj.GetType(),
//			Raw:  raw,
//		}
//	}
//	for name, zone := range world.Zones {
//
//	}
//	return json.Marshal(&WorldMessage{
//		Objects: objects,
//		Zones:   world.Zones,
//	})
//}
//
//func (world World) UnmarshalJSON(data []byte) error {
//	var wm WorldMessage
//	if err := json.Unmarshal(data, &wm); err != nil {
//		return errors.New("failed to unmarshal world message from "+string(data), err)
//	}
//	w, err := wm.Deserialize()
//	if err != nil {
//		return errors.New("deserializing objects from world message", err)
//	}
//	world.Objects = w.Objects
//	world.Zones = w.Zones
//	return nil
//}
