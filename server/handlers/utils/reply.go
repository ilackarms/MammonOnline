package utils

import (
	"encoding/json"
	"fmt"
	"github.com/Sirupsen/logrus"
	"github.com/emc-advanced-dev/pkg/errors"
	"github.com/googollee/go-socket.io"
	"github.com/ilackarms/MammonOnline/server/api"
	"github.com/ilackarms/MammonOnline/server/enums"
)

func Reply(so socketio.Socket, event enums.ClientEvent, response interface{}) error {
	data, err := json.Marshal(response)
	if err != nil {
		return errors.New("error marshalling "+fmt.Sprintf("%v", response)+" to json", err)
	}
	if event == enums.CLIENT_EVENTS.NO_REPLY {
		return nil
	}
	if err := so.Emit(event.String(), string(data)); err != nil {
		return errors.New("emitting data "+string(data)+" on event "+event.String(), err)
	}
	logrus.Debugf("responded with %s to endpoint %s", data, event)
	return nil
}

func ReplyWithError(so socketio.Socket, event enums.ClientEvent, code enums.ErrorCode, err error) error {
	response := api.ErrorResponse{
		Code: code,
		Msg:  err.Error(),
	}
	return Reply(so, event, response)
}
