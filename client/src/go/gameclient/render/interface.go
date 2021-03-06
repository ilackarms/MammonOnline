package render

import (
	"github.com/ilackarms/MammonOnline/client/src/go/gameclient/update"
	"github.com/ilackarms/MammonOnline/server/enums"
	"github.com/ilackarms/MammonOnline/server/game"
	"github.com/thoratou/go-phaser/generated/phaser"
)

type ObjectRenderer interface {
	Draw(screenX, screenY int)
	UpdateAnimation(frameRate int)
	SetPosition(x, y int)
	Group() *phaser.Group
}

func NewObjectRenderer(phaserGame *phaser.Game, obj game.IObject, updateManager *update.Manager) ObjectRenderer {
	t := obj.GetType()
	switch t {
	case enums.OBJECTS.PLAYER:
		character, ok := obj.(*game.Character)
		if !ok {
			panic("object with type Character does not cast to character")
		}
		return newCharacterRenderer(phaserGame, character, updateManager)
	default:
		panic("unknown object type " + t.String())
	}
}
