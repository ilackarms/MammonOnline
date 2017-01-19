var Boot = function () {};

module.exports = Boot;

Boot.prototype = {

    preload: function () {
        this.load.image('loading', 'assets/gui/preloader/loading.png');
        this.load.image('load_progress_bar_dark', 'assets/gui/preloader/progress_bar_bg.png');
        this.load.image('load_progress_bar', 'assets/gui/preloader/progress_bar_fg.png');
    },

    create: function () {
        window.game.stage.disableVisibilityChange = true; // So that game doesn't stop when window loses focus.
        window.game.input.maxPointers = 1;

        if (window.game.device.desktop) {
            window.game.stage.scale.pageAlignHorizontally = true;
        } else {
            window.game.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL;
            window.game.stage.scale.minWidth =  480;
            window.game.stage.scale.minHeight = 260;
            window.game.stage.scale.maxWidth = 640;
            window.game.stage.scale.maxHeight = 480;
            window.game.stage.scale.forceLandscape = true;
            window.game.stage.scale.pageAlignHorizontally = true;
            window.game.stage.scale.setScreenSize(true);
        }

        // window.game.state.start('Preloader');
    }
};