package render

import "github.com/thoratou/go-phaser/generated/phaser"

type LoadingText struct {
	game  *phaser.Game
	group *phaser.Group
}

func DrawLoadingText(game *phaser.Game) *LoadingText {
	centerX := game.Camera().Width() / 2
	centerY := game.Camera().Height() / 2
	group := game.Add().Group()
	bg := game.Add().Graphics2O(0, 0)
	bg.BeginFill(0x000000)
	bg.DrawRect(0, 0, game.Camera().Width(), game.Camera().Height())
	bg.EndFill()
	text := game.Add().BitmapText2O(centerX-100, centerY-64, "basic", "Loading...", 64)

	group.Add(&phaser.DisplayObject{bg.Object})
	group.Add(&phaser.DisplayObject{text.Object})
	group.SetVisibleA(false)

	return &LoadingText{
		game:  game,
		group: group,
	}
}

func (lt *LoadingText) Show() {
	lt.game.World().BringToTop(lt.group)
	lt.group.SetVisibleA(true)
}

func (lt *LoadingText) Hide() {
	lt.group.SetVisibleA(false)
}
