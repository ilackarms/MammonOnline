var Events = {};

module.exports = Events;

Events.SERVER_EVENTS = {
    NO_REPLY:                   "NO_REPLY",
    CONNECTION:                 "connection",
    DISCONNECTION:              "disconnection",
    LOGIN_REQUEST:              "LOGIN_REQUEST",
    CREATE_CHARACTER_REQUEST:   "CREATE_CHARACTER_REQUEST",
};

Events.CLIENT_EVENTS = {
    CONNECTION_ACK:             "CONNECTION_ACK",
    LOGIN_RESPONSE:             "LOGIN_RESPONSE",
    CREATE_CHARACTER_RESPONSE:  "CREATE_CHARACTER_RESPONSE",
};

/*
 NOTE: from enums.go###
 var SERVER_EVENTS = serverEvents{
     CONNECTION:               "connection",
     DISCONNECTION:            "disconnection",
     LOGIN_REQUEST:            "LOGIN_REQUEST",
     CREATE_CHARACTER_REQUEST: "CREATE_CHARACTER_REQUEST",
 }
 var CLIENT_EVENTS = clientEvents{
     NO_REPLY:                  "NO_REPLY",
     CONNECTION_ACK:            "CONNECTION_ACK",
     LOGIN_RESPONSE:            "LOGIN_RESPONSE",
     CREATE_CHARACTER_RESPONSE: "CREATE_CHARACTER_RESPONSE",
 }


 */