package main

import (
	log "github.com/Sirupsen/logrus"
	"net/http"

	"encoding/json"
	"flag"
	"github.com/emc-advanced-dev/pkg/errors"
	"github.com/googollee/go-socket.io"
	"github.com/ilackarms/MammonOnline/server/enums"
	"github.com/ilackarms/MammonOnline/server/handlers"
	"github.com/ilackarms/MammonOnline/server/stateful"
	"io/ioutil"
	"time"
)

func main() {
	verbose := flag.Bool("v", false, "run with verbose logging")
	saveFile := flag.String("f", "game_state.json", "save file for whole game state")
	flag.Parse()
	if *verbose {
		log.SetLevel(log.DebugLevel)
	}

	state := initializeState(*saveFile)

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

func initializeState(saveFile string) *stateful.State {
	state := &stateful.State{
		PersistentState: &stateful.PersistentState{},
		EphemeralState: &stateful.EphemeralState{
			Sessions: make(map[string]*stateful.Session),
		},
	}

	defer func() {
		go func() {
			for {
				if err := saveState(saveFile, state); err != nil {
					log.Error("failed to save game state to file", err)
				}
				time.Sleep(time.Second * 30)
			}
		}()
	}()

	data, err := ioutil.ReadFile(saveFile)
	if err == nil {
		if err := json.Unmarshal(data, state.PersistentState); err == nil {
			log.Info("state loaded from " + saveFile)
			return state
		}
	}

	log.Info("unable to load state from " + saveFile + ", starting with clean state")

	return state
}

func saveState(fileName string, state *stateful.State) error {
	data, err := json.Marshal(state)
	if err != nil {
		return errors.New("failed to marshal state", err)
	}
	if err := ioutil.WriteFile(fileName, data, 0644); err != nil {
		return errors.New("writing save file", err)
	}
	log.Debugf("state saved to "+fileName+" %v bytes", len(data))
	return nil
}
