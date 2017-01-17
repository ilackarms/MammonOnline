package enums

type ClientEvent string
type ServerEvent string

type serverEvents struct {
	LOGIN_REQUEST ServerEvent
}
type clientEvents struct {
	LOGIN_RESPONSE ClientEvent
}

var SERVER_EVENTS = serverEvents{
	LOGIN_REQUEST: "LOGIN_REQUEST",
}
var CLIENT_EVENTS = clientEvents{
	LOGIN_RESPONSE: "LOGIN_RESPONSE",
}
