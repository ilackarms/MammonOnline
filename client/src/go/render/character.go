package render

import (
	"fmt"
	"github.com/ilackarms/MammonOnline/client/src/go/render/utils"
	"github.com/ilackarms/MammonOnline/server/enums"
	"github.com/ilackarms/MammonOnline/server/game"
	"github.com/thoratou/go-phaser/generated/phaser"
	"log"
	"regexp"
)

type characterRenderer struct {
	game          *phaser.Game
	character     *game.Character
	sprites       map[string]map[string]*phaser.Sprite //[armor][weapon]
	currentSprite *phaser.Sprite
	group         *phaser.Group
}

var loopAction = map[string]bool{
	"idle":       true,
	"walk":       true,
	"die":        false,
	"attack":     true,
	"cast_spell": true,
	"get_hit":    false,
}

func newCharacterRenderer(game *phaser.Game, character *game.Character) *characterRenderer {
	var (
		armors     = []string{"heavy", "light", "medium"}
		weapons    = []string{"axe", "mace", "staff", "sword", "weaponless"}
		actions    = []string{"idle", "walk", "die", "attack", "cast_spell", "get_hit"}
		directions = []string{"s", "sw", "w", "nw", "n", "ne", "e", "se"}
		className  string
	)

	sprites := make(map[string]map[string]*phaser.Sprite)
	group := game.Add().Group()

	switch character.Class {
	case enums.CLASSES.ROGUE:
		className = "rogue"
		weapons = append(weapons, "bow")
	case enums.CLASSES.WARRIOR:
		className = "warrior"
		weapons = append(weapons, "shield")
		weapons = append(weapons, "mace_shield")
		weapons = append(weapons, "sword_shield")
	case enums.CLASSES.SORCERER:
		className = "sorcerer"
	}
	for _, armor := range armors {
		if sprites[armor] == nil {
			sprites[armor] = make(map[string]*phaser.Sprite)
		}
		for _, weapon := range weapons {
			atlasName := className + "_" + armor + "_" + weapon
			frames := game.Cache().GetFrameData(atlasName).GetFrames()
			sprite := game.Add().Sprite3O(0, 0, atlasName)
			sprite.SetVisibleA(false)
			for _, action := range actions {
				for _, direction := range directions {
					animationName := animationName(action, direction)
					animations := findAnimations(frames, animationName)
					animationsParam := make([]interface{}, len(animations))
					for i := range animations {
						animationsParam[i] = animations[i]
					}
					sprite.Animations().Add1O(animationName, animationsParam)
					sprite.Anchor().Set1O(0, 0.5)
					group.Add(&phaser.DisplayObject{sprite.Object})
					game.Physics().Arcade().Enable1O(sprite, DebugMode)
				}
			}
			sprites[armor][weapon] = sprite
			fmt.Printf("added sprite %s: (%v,%v), w:+%v,y:+%v\n", atlasName, sprite.X(), sprite.Y(), sprite.Width(), sprite.Height())
		}
	}
	return &characterRenderer{
		game:      game,
		character: character,
		sprites:   sprites,
		group:     group,
	}
}

func (cr *characterRenderer) Draw(x, y int) {
	if !cr.character.LoggedIn {
		return
	}
	cr.UpdateAnimation(20)
	screenX, screenY := utils.ToScreenCoordinates(x, y, Tilewidth, Tileheight)
	cr.SetPosition(screenX+OffsetX, screenY)
}

func (cr *characterRenderer) SetPosition(screenX, screenY int) {
	cr.group.SetXA(screenX)
	cr.group.SetYA(screenY)
	log.Printf("set positoin to %v,%v", screenX, screenY)
}

func (cr *characterRenderer) UpdateAnimation(frameRate int) {
	if cr.currentSprite != nil {
		cr.currentSprite.SetVisibleA(false)
	}
	weapon := cr.character.Weapon
	armor := cr.character.Armor
	sprite := cr.sprites[armor][weapon]
	action := cr.character.Action.String()
	direction := cr.character.Direction.String()
	animationName := animationName(action, direction)
	sprite.Play2O(animationName, frameRate, loopAction[action])
	sprite.SetVisibleA(true)
	cr.currentSprite = sprite
}

func (cr *characterRenderer) Sprites() []*phaser.Sprite {
	var sprites []*phaser.Sprite
	for _, m := range cr.sprites {
		for _, sprite := range m {
			sprites = append(sprites, sprite)
		}
	}
	return sprites
}

func (cr *characterRenderer) Group() *phaser.Group {
	return cr.group
}

func animationName(action, direction string) string {
	return action + "." + direction
}

func findAnimations(frames []*phaser.Frame, animationPrefix string) []string {
	var animationNames []string
	re := regexp.MustCompile(animationPrefix + ".[0-9]+")
	for _, frame := range frames {
		if re.MatchString(frame.Name()) {
			animationNames = append(animationNames, frame.Name())
		}
	}
	return animationNames
}
