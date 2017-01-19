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
	CONNECTION    ServerEvent
	DISCONNECTION ServerEvent
	LOGIN_REQUEST ServerEvent
}
type clientEvents struct {
	CONNECTION_ACK ClientEvent
	LOGIN_RESPONSE ClientEvent
}

var SERVER_EVENTS = serverEvents{
	CONNECTION:    "connection",
	DISCONNECTION: "disconnection",
	LOGIN_REQUEST: "LOGIN_REQUEST",
}
var CLIENT_EVENTS = clientEvents{
	CONNECTION_ACK: "CONNECTION_ACK",
	LOGIN_RESPONSE: "LOGIN_RESPONSE",
}
