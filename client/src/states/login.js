module.exports = function (game) {
    var login = {};

    login.preload = function () {
        //init UI Plugins
        this.slickUI = game.add.plugin(Phaser.Plugin.SlickUI);
        game.add.plugin(PhaserInput.Plugin);
        this.slickUI.load('assets/gui/themes/kenney/kenney.json');
    };

    login.create = function () {
        this._displayLoginMenu();
    };

    login._displayLoginMenu = function () {
        var panel = this.slickUI.add(new SlickUI.Element.Panel(80, 80, game.width - 160, game.height - 160));
        console.log(panel.width-1);
        panel.add(new SlickUI.Element.Text(panel.width/2 - 220, 0, 'Mammon Online', 72, 'title'));
        var button;
        panel.add(button = new SlickUI.Element.Button(panel.width - 140, panel.height-80, 140, 80));
        button.events.onInputUp.add(function () {console.log(username.value, password.value);});
        button.add(new SlickUI.Element.Text(0,0, "Login", 24, 'basic')).center();
        var username = game.add.inputField(panel._x + panel.width/2 - 75, panel._y + panel.height/2 - 20, {
            font: '18px Arial',
            fill: '#212121',
            fontWeight: 'bold',
            width: 150,
            padding: 8,
            borderWidth: 1,
            borderColor: '#000',
            borderRadius: 6,
            placeHolder: 'Username',
            type: PhaserInput.InputType.text
        });
        var password = game.add.inputField(panel._x + panel.width/2 - 75, panel._y + panel.height/2 + 20, {
            font: '18px Arial',
            fill: '#212121',
            fontWeight: 'bold',
            width: 150,
            padding: 8,
            borderWidth: 1,
            borderColor: '#000',
            borderRadius: 6,
            placeHolder: 'Password',
            type: PhaserInput.InputType.password
        });
    };

    return login;
};