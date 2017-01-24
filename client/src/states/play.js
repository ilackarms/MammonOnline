module.exports = function (game, socket) {
    var play = {};

    var enums = require('../enums/enums');
    var maps = require('../map/map');

    play.init = function (gameData) {
        console.log(gameData);
        play.gameData = gameData;
    };

    play.preload = function () {
        play.map = new maps.Map(game, play.gameData.map, false, true);
    };
    
    play.create = function () {
        console.log('playing game');
        play.map.draw(0, 0);
    };

    return play;
};
