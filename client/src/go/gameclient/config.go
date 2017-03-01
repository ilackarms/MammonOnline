package gameclient

import (
	"encoding/json"
	"github.com/emc-advanced-dev/pkg/errors"
	"github.com/gopherjs/gopherjs/js"
	"github.com/thoratou/go-phaser/generated/phaser"
)

type Config struct {
	DebugMode bool `json:"debug_mode"`
}

func GetFromCache(game *phaser.Game) (*Config, error) {
	cfgObj := game.Cache().GetJSON("config")
	cfgJSON := js.Global.Get("JSON").Call("stringify", cfgObj).String()
	var config Config
	if err := json.Unmarshal([]byte(cfgJSON), &config); err != nil {
		return nil, errors.New("unmarshalling cfg json "+cfgJSON, err)
	}
	return &config, nil
}
