package socket

import (
	"encoding/json"
	"fmt"
	"github.com/gopherjs/gopherjs/js"
	"github.com/ilackarms/MammonOnline/server/enums"
)

type Socket struct {
	*js.Object
}

func (s *Socket) On(event string, f func(data string)) {
	s.Object.Call("on", event, f)
}

func (s *Socket) Emit(event enums.ServerEvent, dataObj interface{}) {
	data, err := json.Marshal(dataObj)
	if err != nil {
		panic("err marshalling " + fmt.Sprintf("%+v", dataObj) + ": " + err.Error())
	}
	s.Object.Call("emit", event.String(), string(data))
}
