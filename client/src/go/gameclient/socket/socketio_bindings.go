package socket

import "github.com/gopherjs/gopherjs/js"

type Socket struct {
	*js.Object
}

func (s *Socket) On(event string, f func(data string)) {
	s.Object.Call("on", event, f)
}

func (s *Socket) Emit(event, data string) {
	s.Object.Call("emit", event, data)
}
