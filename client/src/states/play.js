module.exports = function (game, socket) {
    var play = {};

    var enums = require('../enums/enums');

    play.init = function (gameData) {
        console.log(gameData);
    };

    play.preload = function () {
        //nothing?
    };
    
    play.create = function () {
        console.log('playing game');
    };

    return play;
};

function drawMap() {

}