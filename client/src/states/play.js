module.exports = function (game, socket) {
    var play = {};

    play.init = function (gameData) {
        // console.log(gameData);
        play.gameData = gameData;
    };

    play.preload = function () {
        //for debug only
        document.play = play;

        //prepare params to client
        play.playerUid = play.gameData.player_uid;
        var world = JSON.stringify(play.gameData.world);

        //create Go client
        play.Client = Client.New(game, world, socket, play.playerUid);

        play.Client.Preload();
    };

    play.create = function () {
        play.Client.Create();
    };

    play.update = function () {
        play.Client.Update();
    };

    play.render = function() {
        play.Client.Render();
    };

    return play;
};
