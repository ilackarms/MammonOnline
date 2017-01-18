package handlers_test

import (
	. "github.com/ilackarms/MammonOnline/server/handlers"

	"encoding/json"
	"github.com/Sirupsen/logrus"
	"github.com/googollee/go-socket.io"
	"github.com/ilackarms/MammonOnline/server/api"
	"github.com/ilackarms/MammonOnline/server/enums"
	"github.com/ilackarms/MammonOnline/server/stateful"
	"github.com/ilackarms/MammonOnline/server/testutils"
	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
	"github.com/zhouhui8915/go-socket.io-client"
	"time"
)

var state *stateful.State
var so socketio.Socket
var client *socketio_client.Client

func must(err error) {
	if err != nil {
		logrus.Fatal("TEST ERR:", err)
	}
}

var _ = Describe("Handlers", func() {
	BeforeSuite(func() {
		sockChan, err := testutils.SocketIOServer()
		must(err)
		time.Sleep(time.Millisecond * 500)
		client, err = testutils.SocketIOClient()
		must(err)
		logrus.Info("waiting for socket")
		so = <-sockChan
	})
	BeforeEach(func() {
		state = &stateful.State{
			PersistentState: &stateful.PersistentState{},
			EphemeralState:  &stateful.EphemeralState{},
		}
	})
	Describe("LoginHandler", func() {
		Context("on new account creation", func() {
			It("adds a new account to the state", func() {
				RegisterHandlers(state, so)
				data, err := json.Marshal(api.LoginRequest{
					Username: "testuser",
					Password: "testpass",
				})
				must(err)
				responseChan := make(chan string)
				client.On(enums.CLIENT_EVENTS.LOGIN_RESPONSE.String(), func(msg string) {
					responseChan <- msg
				})
				client.Emit(enums.SERVER_EVENTS.LOGIN_REQUEST.String(), string(data))
				Expect(<-responseChan).To(MatchRegexp(`{"session_token":".*","character_names":\[\]}`))
			})
		})
	})
})
