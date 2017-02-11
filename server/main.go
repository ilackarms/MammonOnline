package main

import (
	log "github.com/Sirupsen/logrus"
	"net/http"

	"github.com/googollee/go-socket.io"
	"github.com/ilackarms/MammonOnline/server/enums"
	"github.com/ilackarms/MammonOnline/server/handlers"
	"github.com/ilackarms/MammonOnline/server/stateful"
	"os"
)

func main() {
	if debug := os.Getenv("DEBUG"); debug != "" && debug != "0" {
		log.SetLevel(log.DebugLevel)
	}
	state := &stateful.State{
		PersistentState: &stateful.PersistentState{},
		EphemeralState: &stateful.EphemeralState{
			Sessions: make(map[string]*stateful.Session),
		},
	}

	server, err := socketio.NewServer(nil)
	if err != nil {
		log.Fatal(err)
	}
	server.On(enums.SERVER_EVENTS.CONNECTION.String(), func(so socketio.Socket) {
		log.Infof("New Socket %v Connected, adding handlers...", so.Id())
		handlers.RegisterHandlers(state, so)
	})
	server.On("error", func(so socketio.Socket, err error) {
		log.Println("TODO: error HANDLER:", err)
	})

	http.Handle("/socket.io/", server)
	http.Handle("/", http.FileServer(http.Dir("../client/")))
	log.Println("Serving at localhost:5000...")
	log.Fatal(http.ListenAndServe(":5000", nil))
}
