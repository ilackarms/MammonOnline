package enums

type ClientEvent string
type ServerEvent string

func (e ServerEvent) String() string {
	return string(e)
}
func (e ClientEvent) String() string {
	return string(e)
}

type serverEvents struct {
	CONNECTION               ServerEvent
	DISCONNECTION            ServerEvent
	LOGIN_REQUEST            ServerEvent
	CREATE_CHARACTER_REQUEST ServerEvent
	PLAY_CHARACTER_REQUEST   ServerEvent
	DELETE_CHARACTER_REQUEST ServerEvent
}
type clientEvents struct {
	NO_REPLY                  ClientEvent
	CONNECTION_ACK            ClientEvent
	LOGIN_RESPONSE            ClientEvent
	CREATE_CHARACTER_RESPONSE ClientEvent
	PLAY_CHARACTER_RESPONSE   ClientEvent
	DELETE_CHARACTER_RESPONSE ClientEvent
}

var SERVER_EVENTS = serverEvents{
	CONNECTION:               "connection",
	DISCONNECTION:            "disconnection",
	LOGIN_REQUEST:            "LOGIN_REQUEST",
	CREATE_CHARACTER_REQUEST: "CREATE_CHARACTER_REQUEST",
	PLAY_CHARACTER_REQUEST:   "PLAY_CHARACTER_REQUEST",
	DELETE_CHARACTER_REQUEST: "DELETE_CHARACTER_REQUEST",
}
var CLIENT_EVENTS = clientEvents{
	NO_REPLY:                  "NO_REPLY",
	CONNECTION_ACK:            "CONNECTION_ACK",
	LOGIN_RESPONSE:            "LOGIN_RESPONSE",
	CREATE_CHARACTER_RESPONSE: "CREATE_CHARACTER_RESPONSE",
	PLAY_CHARACTER_RESPONSE:   "PLAY_CHARACTER_RESPONSE",
	DELETE_CHARACTER_RESPONSE: "DELETE_CHARACTER_RESPONSE",
}
