module.exports = function (game) {
    var boot = {};

    boot.preload = function () {
        //assets for preload screen
        this.load.image('title', 'assets/gui/logos/title.png');
        this.load.image('loading_text', 'assets/gui/preloader/loading.png');
        this.load.image('load_progress_bar_dark', 'assets/gui/preloader/progress_bar_bg.png');
        this.load.image('load_progress_bar', 'assets/gui/preloader/progress_bar_fg.png');
        this.load.json('assets', 'assets/assets.json')

    };
    
    boot.create = function () {
        game.canvas.oncontextmenu = function (e) { e.preventDefault(); };
        console.log('booted');
        game.state.start('load');
    };

    return boot;
};