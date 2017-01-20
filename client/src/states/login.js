module.exports = function (game, socket) {
    var login = {};

    var enums = require('../enums/enums');
    var utils = require('../utils/utils')();

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
        panel.add(new SlickUI.Element.Text(0, 0, 'Mammon Online', 72, 'title')).centerHorizontally();
        var errTxt;
        panel.add(errTxt = new SlickUI.Element.Text(20, panel.height - 36, '', 14, 'basic'));
        var button;
        panel.add(button = new SlickUI.Element.Button(panel.width - 140, panel.height-80, 140, 80));
        button.events.onInputUp.add(function () {
            console.log(panel);
            socket.emit(enums.events.SERVER_EVENTS.LOGIN_REQUEST,
                JSON.stringify({
                    username: username.value,
                    password: password.value
                })
            );
        });
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
        username.startFocus();
        socket.on(enums.events.CLIENT_EVENTS.LOGIN_RESPONSE, function (data) {
            var response = JSON.parse(data);
            if (!response) {
                return;
            }
            console.log(data, response);
            if (response.code) {
                errTxt.value = response.msg;
            } else {
                utils.deleteSlickUIElement(panel);
                username.destroy();
                password.destroy();
                login._displayCharacterSelectMenu(response.character_names);
            }
        })
    };

    login._displayCharacterSelectMenu = function (character_names) {
        var panel = this.slickUI.add(new SlickUI.Element.Panel(80, 80, game.width - 160, game.height - 160));
        console.log(panel.width-1);
        panel.add(new SlickUI.Element.Text(0, 0, 'Character Select', 36, 'title')).centerHorizontally();
        var char1 = panel.add(char1 = new SlickUI.Element.Button(panel.width/2 - 70, panel.height/2 - 80, 140, 40));
        // panel.add(char2 = new SlickUI.Element.Button(0, 140, 140, 40)).centerHorizontally();
        // panel.add(char3 = new SlickUI.Element.Button(0, 180, 140, 40)).centerHorizontally();
        if (character_names[0]) {
            char1.add(new SlickUI.Element.Text(0, 0, character_names[0], 20, 'basic')).center();
        } else {
            char1.add(new SlickUI.Element.Text(0, 0, 'NEW', 20, 'basic')).center();
            char1.events.onInputUp.add(function () {
                console.log(panel);
            });
        }
        var cancel = panel.add(cancel = new SlickUI.Element.Button(0, panel.height - 40, 140, 40));
        cancel.add(new SlickUI.Element.Text(0,0, "Cancel", 24, 'basic')).center();
        cancel.events.onInputUp.add(function () {
            location.reload();
        });
    };

    return login;
};