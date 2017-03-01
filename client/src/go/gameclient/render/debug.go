package render

import (
	"fmt"
	"github.com/gopherjs/gopherjs/js"
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
			game.Add().Image3O(screenX+OffsetX, screenY, debugTile)
		}
	}
}

func DebugMouseCoordinates(game *phaser.Game, updateManager *update.Manager) {
	style := js.Global.Get("JSON").Call("parse",
		`{ "font": "65px Arial", "fill": "#ff0044", "align": "center" }`)
	text := game.Add().Text4O(100, 100, "placeholder", style)
	group := game.Add().Group()
	group.Add(&phaser.DisplayObject{text.Object})
	ForegroundGroup.Add(&phaser.DisplayObject{group.Object})
	updateManager.AddUpdateFunc("mouse_debug", func() {
		screenX, screenY := game.Input().X(), game.Input().Y()
		x, y := ToGameCoordinates(screenX+int(game.Camera().Position().X()),
			screenY+int(game.Camera().Position().Y()))
		log.Printf("%v,%v from (%v, %v)", x, y, screenX, screenY)
		text.SetText1O(fmt.Sprintf(".(%v,%v)", x, y))
		text.Set("x", screenX)
		text.Set("y", screenY)
	}, false)
}
