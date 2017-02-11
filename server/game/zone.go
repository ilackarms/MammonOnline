package game

import (
	"encoding/json"
	"fmt"
	"github.com/emc-advanced-dev/pkg/errors"
	"github.com/ilackarms/MammonOnline/server/enums"
	"github.com/ilackarms/MammonOnline/server/game/utils"
)

type Tile struct {
	Type enums.Tile `json:"type"`
	//references to objects by id, for lookup purposes
	Objects []IObject `json:"objects"`
}

type Zone struct {
	Name   string       `json:"name"`
	Region enums.Region `json:"region"`
	Tiles  [][]*Tile    `json:"tiles"`
}

//utility function to initialize
//server side representation of maps (Zones)
//reads the map tiles in from the
//layer named 'template' (required)
//creates an empty map (only tile types intialized)
func ZoneFromTilemap(region enums.Region, tilemapData []byte, rulesData mapRules) (*Zone, error) {
	tilemap, err := utils.ParseTilemap(tilemapData)
	if err != nil {
		return nil, errors.New("parsing tilemap", err)
	}
	rules, err := parseMapRules(rulesData)
	if err != nil {
		return nil, errors.New("parsing map rules", err)
	}
	for _, layer := range tilemap.Layers {
		if layer.Name == "template" {
			zone := &Zone{
				Region: region,
				Tiles:  make([][]*Tile, layer.Width),
			}
			for x := range zone.Tiles {
				zone.Tiles[x] = make([]*Tile, layer.Height)
				for y := range zone.Tiles[x] {
					i := x + y*layer.Width
					tileID := layer.Data[i]
					tileType, ok := rules.TileTypes[tileID]
					if !ok {
						return nil, errors.New("invalid set of rules for tilemap; given "+fmt.Sprintf("+%v", rules)+" with no rule for "+tileID, nil)
					}
					zone.Tiles[x][y] = &Tile{
						Type: tileType,
					}
					//TODO: add in objects from optional object layer
					//layer named object_template; use object_rules or something
				}
			}
			return zone
		}
	}
	return nil, errors.New("no layer laned 'template' in tilemap: "+fmt.Sprintf("%+v", tilemap), nil)
}

func (m *Zone) Size() (int, int) {
	return len(m.Tiles), len(m.Tiles[0])
}

type mapRules struct {
	TileTypes map[int]enums.Tile `json:"tile_types"`
}

func parseMapRules(data []byte) (*mapRules, error) {
	var rules mapRules
	if err := json.Unmarshal(data, &rules); err != nil {
		return nil, errors.New("unable to unmarshal "+string(data)+" to map rules", err)
	}
	return &rules, nil
}
