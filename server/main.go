package main

import (
	log "github.com/Sirupsen/logrus"
	"net/http"

	"github.com/googollee/go-socket.io"
	"github.com/ilackarms/MammonOnline/server/enums"
	"github.com/ilackarms/MammonOnline/server/handlers"
	"github.com/ilackarms/MammonOnline/server/stateful"
)

func main() {
	state := &stateful.State{
		PersistentState: &stateful.PersistentState{},
		EphemeralState:  &stateful.EphemeralState{},
	}

	server, err := socketio.NewServer(nil)
	if err != nil {
		log.Fatal(err)
	}
	server.On(enums.SERVER_EVENTS.CONNECTION.String(), func(so socketio.Socket) {
		log.Infof("New Socket %v Connected, adding handlers...", so.Id())
		handlers.RegisterHandlers(state, so)
		so.On("disconnection", func() {
			log.Println("TODO: disconnection HANDLER")
		})
	})
	server.On("error", func(so socketio.Socket, err error) {
		log.Println("TODO: error HANDLER:", err)
	})

	http.Handle("/socket.io/", server)
	http.Handle("/", http.FileServer(http.Dir("../client/")))
	log.Println("Serving at localhost:5000...")
	log.Fatal(http.ListenAndServe(":5000", nil))
}
