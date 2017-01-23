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
	"log"
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
		logrus.SetLevel(logrus.DebugLevel)
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
			EphemeralState: &stateful.EphemeralState{
				Sessions: make(map[string]*stateful.Session),
			},
		}
	})
	Describe("LoginHandler", func() {
		Context("on new account creation", func() {
			It("responds with session token "+
				"and adds a new account to the state", func() {
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
				Expect(state.Accounts).To(HaveLen(1))
				account, ok := state.GetAccount("testuser", "testpass")
				Expect(ok).To(BeTrue())
				Expect(account).NotTo(BeNil())
				Expect(account.Characters).To(HaveLen(3))
				for _, character := range account.Characters {
					Expect(character).To(BeNil())
				}
			})
		})
		Context("on invalid login", func() {
			It("replies with invalid login error", func() {
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
				<-responseChan
				data, err = json.Marshal(api.LoginRequest{
					Username: "testuser",
					Password: "wrongpass",
				})
				must(err)
				client.On(enums.CLIENT_EVENTS.LOGIN_RESPONSE.String(), func(msg string) {
					responseChan <- msg
				})
				client.Emit(enums.SERVER_EVENTS.LOGIN_REQUEST.String(), string(data))
				Expect(<-responseChan).To(ContainSubstring("invalid password"))
			})
		})
	})
	Describe("CreateCharacterHandler", func() {
		It("validates the create character request "+
			"and adds the character to the given slot on the account", func() {
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
			<-responseChan
			Expect(state.Accounts).To(HaveLen(1))
			account, ok := state.GetAccount("testuser", "testpass")
			Expect(ok).To(BeTrue())
			Expect(account).NotTo(BeNil())
			Expect(account.Characters).To(HaveLen(3))
			for _, character := range account.Characters {
				Expect(character).To(BeNil())
			}
			characterCreateRequest := api.CreateCharacterRequest{
				Attributes: struct {
					Strength     int `json:"str"`
					Dexterity    int `json:"dex"`
					Intelligence int `json:"int"`
				}{
					Strength:     35,
					Dexterity:    35,
					Intelligence: 35,
				},
				Skills: map[enums.Skill]int{
					enums.SKILLS.ALCHEMY:       25,
					enums.SKILLS.CONCENTRATION: 50,
					enums.SKILLS.MAGERY:        25,
				},
				SelectedClass: enums.CLASSES.SORCERER,
				Slot:          0,
				PortraitKey:   "Sorc1",
				Name:          "Morethan4chars",
			}
			data, err = json.Marshal(characterCreateRequest)
			must(err)
			client.On(enums.CLIENT_EVENTS.CREATE_CHARACTER_RESPONSE.String(), func(msg string) {
				log.Print("1")
				responseChan <- msg
				log.Print("2")
			})
			client.Emit(enums.SERVER_EVENTS.CREATE_CHARACTER_REQUEST.String(), string(data))
			log.Print("3")
			Expect(<-responseChan).To(ContainSubstring("FOOBAR"))
			log.Print("4444444444444444444444444")
		})
	})
})
