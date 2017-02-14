package game

import (
	"fmt"
	log "github.com/Sirupsen/logrus"
	"github.com/emc-advanced-dev/pkg/errors"
	"github.com/ilackarms/MammonOnline/server/enums"
	"github.com/ilackarms/MammonOnline/server/game/tiled"
	"io/ioutil"
	"sync"
)

type Tile struct {
	Type enums.Tile `json:"type"`
	//references to objects by id, for lookup purposes
	Objects map[string]IObject `json:"objects"`
	objLock sync.RWMutex
}

func (tile *Tile) AddObject(obj IObject) {
	tile.objLock.Lock()
	tile.Objects[obj.GetUID()] = obj
	tile.objLock.Unlock()
}

func (tile *Tile) DeleteObject(uid string) {
	tile.objLock.Lock()
	delete(tile.Objects, uid)
	tile.objLock.Unlock()
}

type Zone struct {
	Name  string    `json:"name"`
	Tiles [][]*Tile `json:"tiles"`
}

//utility function to initialize
//server side representation of maps (Zones)
//reads the map tiles in from the
//layer named 'template' (required)
//creates an empty map (only tile types intialized)
func ZoneFromTilemap(name, tilemapPath string) (*Zone, error) {
	data, err := ioutil.ReadFile(tilemapPath)
	if err != nil {
		return nil, errors.New("failed to read "+tilemapPath, err)
	}
	tilemap, err := tiled.ParseTilemap(data)
	if err != nil {
		return nil, errors.New("parsing tilemap", err)
	}
	for _, layer := range tilemap.Layers {
		if layer.Name == "template" {
			log.Debugf("processing layer %+v", layer)
			zone := &Zone{
				Name:  name,
				Tiles: make([][]*Tile, layer.Width),
			}
			for x := range zone.Tiles {
				zone.Tiles[x] = make([]*Tile, layer.Height)
				for y := range zone.Tiles[x] {
					i := x + y*layer.Width
					tileGID := layer.Data[i] - 1 //for some reason tiled likes to +1 on this
					tileset := tilemap.GetTilesetForGID(tileGID)
					tilesetIndex := tileGID - (tileset.Firstgid - 1)
					property, ok := tileset.Tileproperties[fmt.Sprintf("%d", tilesetIndex)]
					if !ok {
						return nil, errors.New(fmt.Sprintf("tile %v in tileset %+v doesn't have any properties", tilesetIndex, tileset), nil)
					}
					tileType := enums.Tile(property.Type)
					if tileType == enums.TILES.INVALID_VALUE {
						return nil, errors.New(fmt.Sprintf("tile %v in tileset %+v doesn't its type set to a valid value", tilesetIndex, tileset), nil)
					}
					//NOTE: it's up to the caller to verify
					//that the tile type is the correct value
					zone.Tiles[x][y] = &Tile{
						Type:    enums.Tile(property.Type),
						Objects: make(map[string]IObject),
					}
					//TODO: add in objects from optional object layer
					//layer named object_template; use object_rules or something
				}
			}
			return zone, nil
		}
	}
	return nil, errors.New("no layer laned 'template' in tilemap: "+fmt.Sprintf("%+v", tilemap), nil)
}

func (m *Zone) Size() (int, int) {
	return len(m.Tiles), len(m.Tiles[0])
}
