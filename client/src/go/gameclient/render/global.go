package render

import "github.com/thoratou/go-phaser/generated/phaser"

var (
	Tilewidth     = 128
	Tileheight    = 64
	OffsetX       int
	DebugMode     bool
	LoadingScreen *LoadingText

	ForegroundGroup *phaser.Group
	SpriteGroup     *phaser.Group
	BackgroundGroup *phaser.Group
	GlobalGroup     *phaser.Group
)
