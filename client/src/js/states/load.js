module.exports = function (game) {
    var load = {};
    
    load._loadAssets = function () {
        var assets = game.cache.getJSON('assets');
        var loadCount = 0;
        for (var key in assets.images) {
            if (!assets.images.hasOwnProperty(key)) {
                continue;
            }
            loadCount++;
            game.load.image(key, 'assets/'+assets.images[key]);
        }
        for (var key in assets.datas) {
            if (!assets.datas.hasOwnProperty(key)) {
                continue;
            }
            loadCount++;
            game.load.json(key, 'assets/'+assets.datas[key]);
        }
        for (var key in assets.atlases) {
            if (!assets.atlases.hasOwnProperty(key)) {
                continue;
            }
            loadCount++;
            game.load.atlas(key, 'assets/'+assets.atlases[key].image, 'assets/'+assets.atlases[key].data);
        }
        console.log(assets, 'loading', loadCount);
    };

    load._displayLoadScreen = function () {
        var centerX = game.camera.width / 2;
        var centerY = game.camera.height / 2;

        this.loading = game.add.sprite(centerX, 80, 'title');
        this.loading.anchor.setTo(0.5, 0.5);

        // this.loading = game.add.sprite(centerX, centerY - 20, 'loading_text');
        // this.loading.anchor.setTo(0.5, 0.5);
        game.add.bitmapText(300, 200, 'basic', 'Loading...', 64);

        this.barBg = game.add.sprite(centerX, centerY + 40, 'load_progress_bar_dark');
        this.barBg.anchor.setTo(0.5, 0.5);

        this.bar = game.add.sprite(centerX - 192, centerY + 40, 'load_progress_bar');
        this.bar.anchor.setTo(0, 0.5);
        this.load.setPreloadSprite(this.bar);

        // onLoadComplete is dispatched when the final file in the load queue has been loaded/failed. addOnce adds that function as a callback, but only to fire once.
        this.load.onLoadComplete.addOnce(this._onLoadComplete, this);
    };

    load._onLoadComplete = function () {
        this.ready = true;
    };

    load.preload = function () {
        game.stage.disableVisibilityChange = true; // So that game doesn't stop when window loses focus.
        this._displayLoadScreen();
        this._loadAssets();
    };

    load.create = function () {
        game.stage.disableVisibilityChange = false;
        game.state.start('login');
    };


    return load;
};