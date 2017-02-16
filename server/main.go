package main

import (
	log "github.com/Sirupsen/logrus"
	"net/http"

	"encoding/json"
	"flag"
	"fmt"
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
	saveFile := flag.String("f", "gamestate.json", "save file for whole game state")
	flag.Parse()
	if *verbose {
		log.SetLevel(log.DebugLevel)
	}

	state, err := initializeState(*saveFile)
	if err != nil {
		log.Fatal(err)
	}

	log.Infof("loaded world: %+v", state.World)

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

func initializeState(saveFile string) (*stateful.State, error) {
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
			return state, nil
		} else {
			log.Warn("failed to parse state file: ", err)
		}
	}

	log.Info("unable to load state from " + saveFile + ", generating world")
	world, err := stateful.GenerateWorld()
	if err != nil {
		return nil, errors.New("failed to create new world", err)
	}
	state.World = world

	return state, nil
}

func saveState(fileName string, state *stateful.State) error {
	data, err := json.Marshal(state)
	if err != nil {
		return errors.New("failed to marshal state", err)
	}
	if err := ioutil.WriteFile(fileName, data, 0644); err != nil {
		return errors.New("writing save file", err)
	}
	var sizeStr = fmt.Sprintf("%v bytes", len(data))
	if len(data)>>10 > 0 {
		sizeStr = fmt.Sprintf("%v kb", len(data)>>10)
	}
	if len(data)>>20 > 0 {
		sizeStr = fmt.Sprintf("%v mb", len(data)>>20)
	}
	log.Debugf("state saved to "+fileName+" %s", sizeStr)
	return nil
}
