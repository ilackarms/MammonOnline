package render

import "github.com/thoratou/go-phaser/generated/phaser"

type LoadingText struct {
	game      *phaser.Game
	barFG     *phaser.Sprite
	group     *phaser.Group
	fullWidth int
}

func DrawLoadingText(game *phaser.Game) *LoadingText {
	centerX := game.Camera().Width() / 2
	centerY := game.Camera().Height() / 2
	group := game.Add().Group()
	bg := game.Add().Graphics2O(0, 0)
	bg.BeginFill(0x000000)
	bg.DrawRect(0, 0, game.Camera().Width(), game.Camera().Height())
	bg.EndFill()
	text := game.Add().BitmapText2O(centerX-100, centerY-120, "basic", "Loading...", 64)
	barBG := game.Add().Sprite3O(centerX-192, centerY+40, "load_progress_bar_dark")
	barFG := game.Add().Sprite3O(centerX-192, centerY+40, "load_progress_bar")
	barBG.Anchor().SetTo1O(0, 0.5)
	barFG.Anchor().SetTo1O(0, 0.5)

	group.Add(&phaser.DisplayObject{bg.Object})
	group.Add(&phaser.DisplayObject{text.Object})
	group.Add(&phaser.DisplayObject{barBG.Object})
	group.Add(&phaser.DisplayObject{barFG.Object})
	group.SetVisibleA(false)

	return &LoadingText{
		game:      game,
		group:     group,
		barFG:     barFG,
		fullWidth: barFG.Width(),
	}
}

func (lt *LoadingText) Show() {
	lt.game.World().BringToTop(lt.group)
	lt.group.SetVisibleA(true)
}

func (lt *LoadingText) Hide() {
	lt.group.SetVisibleA(false)
}

func (lt *LoadingText) SetProgress(percent float64) {
	lt.barFG.SetWidthA(int(percent * float64(lt.fullWidth)))
}
