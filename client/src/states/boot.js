module.exports = function (game) {
    var boot = {};

    boot.preload = function () {
        this.load.image('loading_text', 'assets/gui/preloader/loading.png');
        this.load.image('load_progress_bar_dark', 'assets/gui/preloader/progress_bar_bg.png');
        this.load.image('load_progress_bar', 'assets/gui/preloader/progress_bar_fg.png');
        this.load.json('assets', 'assets/assets.json')
    };
    
    boot.create = function () {
        // game.stage.disableVisibilityChange = true; // So that game doesn't stop when window loses focus.
        // game.input.maxPointers = 1;
        console.log('booted');
        game.state.start('load');
    };

    return boot;
};