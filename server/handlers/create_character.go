package handlers

import (
	log "github.com/Sirupsen/logrus"
	"github.com/emc-advanced-dev/pkg/errors"
	"github.com/googollee/go-socket.io"
	"github.com/ilackarms/MammonOnline/server/api"
	"github.com/ilackarms/MammonOnline/server/enums"
	"github.com/ilackarms/MammonOnline/server/game"
	"github.com/ilackarms/MammonOnline/server/handlers/utils"
	"github.com/ilackarms/MammonOnline/server/stateful"
	"github.com/pborman/uuid"
)

func createCharacterHandler(state *stateful.State, so socketio.Socket) utils.HandleFunc {
	return func(msg string) (interface{}, error, enums.ErrorCode) {
		var req api.CreateCharacterRequest
		if err := utils.ParseRequest(msg, &req); err != nil {
			return nil, err, enums.ERROR_CODES.INVALID_REQUEST
		}
		if err := validateCreateCharacterRequest(req); err != nil {
			return nil, err, enums.ERROR_CODES.INVALID_REQUEST
		}
		session, err := state.GetSessionForSocket(so.Id())
		if err != nil {
			return nil, err, enums.ERROR_CODES.INTERNAL_ERROR
		}

		character := &game.Character{
			Mobile: &game.Mobile{
				Object: &game.Object{
					UID:      uuid.New(),
					Type:     enums.OBJECTS.PLAYER,
					Position: game.Position{X: 10, Y: 10},
					ZoneName: state.World.Zones["world"].Name,
				},
				Action: enums.ACTIONS.IDLE,
			},
			Attributes: game.Attributes{
				Strength:     req.Attributes.Strength,
				Dexterity:    req.Attributes.Dexterity,
				Intelligence: req.Attributes.Intelligence,
			},
			Skills:   req.Skills,
			Class:    req.SelectedClass,
			Portrait: req.PortraitKey,
			Name:     req.Name,
			LoggedIn: true,
		}
		session.Account.AddCharacter(req.Slot, character)
		session.Character = session.Account.Characters[req.Slot]
		if err := state.World.AddObject(character); err != nil {
			return nil, errors.New("adding character to world", err), enums.ERROR_CODES.INTERNAL_ERROR
		}
		log.Info("created new character: ", character)
		return &api.StartGameResponse{
			PlayerUID: character.UID,
			World:     state.World,
		}, nil, enums.ERROR_CODES.NIL
	}
}

func validateCreateCharacterRequest(req api.CreateCharacterRequest) error {
	log.Infof("validating new character: %+v", req)
	if req.Attributes.Strength+req.Attributes.Dexterity+req.Attributes.Intelligence != 105 {
		return errors.New("attributes should sum to 105", nil)
	}
	if len(req.Name) < 5 || len(req.Name) > 21 {
		return errors.New("name should be between 5 and 20 characters long", nil)
	}
	if len(req.Skills) != 3 {
		return errors.New("must choose exactly 3 starting skills", nil)
	}
	var skillTotal uint
	for _, val := range req.Skills {
		skillTotal += val
	}
	if skillTotal != 100 {
		return errors.New("starting skills must sum to 100", nil)
	}

	for skill, val := range req.Skills {
		if val < 0 {
			return errors.New("player cannot start with < 0 in a skill", nil)
		}
		if val > 50 {
			return errors.New("player cannot start with > 50 in a skill", nil)
		}
		classSkills, ok := enums.CLASS_SKILLS[req.SelectedClass]
		if !ok {
			return errors.New("invalid class: "+string(req.SelectedClass), nil)
		}
		validSkill := false
		for _, classSkill := range classSkills {
			if skill == classSkill {
				validSkill = true
				break
			}
		}
		if !validSkill {
			return errors.New(string(skill)+" is not a valid class skill for "+string(req.SelectedClass), nil)
		}
	}
	if req.Slot < 0 || req.Slot > 2 {
		return errors.New("invalid slot for character", nil)
	}
	return nil
}
