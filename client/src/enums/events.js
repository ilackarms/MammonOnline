var Events = Events || {};

module.exports = Events;

Events.SERVER_EVENTS = {
    CONNECTION:    "connection",
    DISCONNECTION: "disconnection",
    LOGIN_REQUEST: "LOGIN_REQUEST",
};

Events.CLIENT_EVENTS = {
    CONNECTION_ACK: "CONNECTION_ACK",
    LOGIN_RESPONSE: "LOGIN_RESPONSE",
};

/*
 NOTE: from enums.go###

 var SERVER_EVENTS = serverEvents{
     CONNECTION:    "connection",
     DISCONNECTION: "disconnection",
     LOGIN_REQUEST: "LOGIN_REQUEST",
 }
 var CLIENT_EVENTS = clientEvents{
     CONNECTION_ACK: "CONNECTION_ACK",
     LOGIN_RESPONSE: "LOGIN_RESPONSE",
 }


 */