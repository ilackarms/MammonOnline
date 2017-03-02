package render

import (
	"fmt"
	"github.com/ilackarms/MammonOnline/client/src/go/gameclient/update"
	"github.com/thoratou/go-phaser/generated/phaser"
	"log"
)

func DrawDebugGrid(game *phaser.Game, width, length int) {
	points := []int{
		0, 32,
		64, 0,
		128, 32,
		64, 64,
		0, 32,
	}
	bmd := game.Make().BitmapData2O(Tilewidth, Tileheight)
	for i := 0; i < len(points)-3; i++ {
		x0, y0 := points[i], points[i+1]
		x1, y1 := points[i+2], points[i+3]
		bmd.Line2O(x0, y0, x1, y1, "#FF0000", 1)
	}

	for x := 0; x <= width; x++ {
		for y := 0; y <= length; y++ {
			screenX, screenY := ToScreenCoordinates(x, y)
			debugTile := game.Make().BitmapData2O(Tilewidth, Tileheight)
			debugTile.Copy3O(bmd, 0, 0)
			debugTile.Text(fmt.Sprintf("%v,%v", x, y), Tilewidth/2, Tileheight/2)
			debugTile.Text("*", 0, 0)
			img := game.Add().Image3O(screenX+OffsetX, screenY, debugTile)
			group := game.Add().Group()
			group.Add(&phaser.DisplayObject{img.Object})
			BackgroundGroup.Add(&phaser.DisplayObject{group.Object})
		}
	}
}

func DebugMouseCoordinates(game *phaser.Game, updateManager *update.Manager) {
	text := game.Add().BitmapText2O(100, 100, "basic", "placeholder", 16)
	group := game.Add().Group()
	group.Add(&phaser.DisplayObject{text.Object})
	ForegroundGroup.Add(&phaser.DisplayObject{group.Object})
	updateManager.AddUpdateFunc("mouse_debug", func() {
		screenX, screenY := game.Input().X(), game.Input().Y()
		x, y := ToGameCoordinates(screenX+int(game.Camera().Position().X()),
			screenY+int(game.Camera().Position().Y()))
		log.Printf("%v,%v from (%v, %v)", x, y, screenX, screenY)
		text.SetText(fmt.Sprintf(".(%v,%v)", x, y))
		text.Set("x", screenX)
		text.Set("y", screenY)
	}, false)
}
