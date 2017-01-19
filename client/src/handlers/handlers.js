//requires events.js
//requires connected.js
var Handlers = Handlers || {};

module.exports = Handlers;

function connectedHandler(so){
    return function (msg) {
        // console.log('connection established with socket id ', so.id, ", booting...");
    };
}


Handlers.registerHandlers = function(so){
    var enums = require('../enums/enums');
    var routes = [
        // [enums.events.CLIENT_EVENTS.CONNECTION_ACK, connectedHandler(so)],
    ];

    for (var i = 0; i < routes.length; i++) {
        var event = routes[i][0],
            handler = routes[i][1];
        so.on(event, handler);
    }
};