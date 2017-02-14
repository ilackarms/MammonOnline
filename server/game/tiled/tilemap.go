package tiled

import (
	"encoding/json"
	"github.com/emc-advanced-dev/pkg/errors"
)

type layer struct {
	Data    []int  `json:"data"`
	Height  int    `json:"height"`
	Name    string `json:"name"`
	Opacity int    `json:"opacity"`
	Type    string `json:"type"`
	Visible bool   `json:"visible"`
	Width   int    `json:"width"`
	X       int    `json:"x"`
	Y       int    `json:"y"`
}

type Tileset struct {
	Columns        int    `json:"columns"`
	Firstgid       int    `json:"firstgid"`
	Image          string `json:"image"`
	Collisions     []int  `json:"collisions"`
	Imageheight    int    `json:"imageheight"`
	Imagewidth     int    `json:"imagewidth"`
	Margin         int    `json:"margin"`
	Name           string `json:"name"`
	Spacing        int    `json:"spacing"`
	Tilecount      int    `json:"tilecount"`
	Tileheight     int    `json:"tileheight"`
	Tileproperties map[string]struct {
		Type int `json:"type"`
	} `json:"tileproperties"`
	Tilewidth int `json:"tilewidth"`
}

type Tilemap struct {
	Height       int       `json:"height"`
	Layers       []layer   `json:"layers"`
	Nextobjectid int       `json:"nextobjectid"`
	Orientation  string    `json:"orientation"`
	Renderorder  string    `json:"renderorder"`
	Tileheight   int       `json:"tileheight"`
	Tilesets     []Tileset `json:"tilesets"`
	Tilewidth    int       `json:"tilewidth"`
	Version      int       `json:"version"`
	Width        int       `json:"width"`
}

func (tm *Tilemap) GetTilesetForGID(gid int) Tileset {
	var ts Tileset
	for _, tileset := range tm.Tilesets {
		if gid < tileset.Firstgid-1 {
			break
		}
		ts = tileset
	}
	return ts
}

func ParseTilemap(data []byte) (*Tilemap, error) {
	var tilemap Tilemap
	if err := json.Unmarshal(data, &tilemap); err != nil {
		return nil, errors.New("failed to parse tilemap from "+string(data), err)
	}
	return &tilemap, nil
}
