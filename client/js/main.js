window.onload = main;

function main(){
    var socket = io();
    socket.on('connected', function (data) {
        console.log('welcome to the server bro: ', data);
        socket.emit('asdf', 'hihi');
    });

    var game = new Phaser.Game(1200, 600, Phaser.AUTO, 'game', {
        preload: function () {
            var resources = [
                'assets/gui/themes/metalworks-theme/images/warrior-up.png',
                'assets/gui/themes/metalworks-theme/images/warrior-down.png',
                'assets/gui/themes/metalworks-theme/images/rogue-up.png',
                'assets/gui/themes/metalworks-theme/images/rogue-down.png',
                'assets/gui/themes/metalworks-theme/images/sorcerer-up.png',
                'assets/gui/themes/metalworks-theme/images/sorcerer-down.png'
            ];
            for (var i = 0; i < resources.length; i++) {
                game.load.image(resources[i], resources[i]);
            }

            game.load.onLoadComplete.add(EZGUI.Compatibility.fixCache, game.load, null, resources);
        },
        create: function () {
            loadGUI();
        },
        update: function () {},
        render: function () {}
    });
}

function loadGUI() {
    var loginWindow = {
        id: 'loginWindow',
        component: 'Window',
        draggable: false,

        padding: 4,

        //component position relative to parent
        position: {x: 350, y: 10},

        width: 500,
        height: 500,

        layout: [null, 10],
        children: [
            {
                text: 'Mammon Online v0.1',
                font: {
                    size: '20px',
                    family: 'Arial',
                    color: '#fff'
                },
                component: 'Header',

                position: 'center',

                width: 400,
                height: 40
            },
            null,
            {
                id: 'username',
                text: 'username',
                component: 'Input',
                position: 'center',
                width: 300,
                height: 50,
                font: {
                    size: '18px',
                    family: 'Arial',
                    color: '#fbfff8'
                }
            },
            {
                id: 'password',
                text: 'password',
                component: 'Input',
                position: 'center',
                width: 300,
                height: 50,
                font: {
                    size: '18px',
                    family: 'Arial',
                    color: '#fbfff8'
                }
            },
            null, null,
            {
                id: 'errTxt',
                text: '[Error Msg]',
                component: 'Label',
                position: 'center',
                width: 200,
                height: 25,
                font: {
                    size: '25px',
                    family: 'Arial',
                    color: '#b82730'
                }
            },
            null,
            {
                id: 'loginButton',
                text: 'Get Text Value',
                component: 'Button',
                position: 'center',
                width: 200,
                height: 100,
                font: {
                    size: '15px',
                    family: 'Exocet',
                    color: '#070014'
                }
            }
        ]
    };

    var characterSelectWindow = {
        id: 'characterSelectWindow',
        component: 'Window',
        draggable: false,

        padding: 4,

        //component position relative to parent
        position: {x: 350, y: 10},

        width: 500,
        height: 500,

        layout: [null, 10],
        children: [
            {
                text: 'Character Select',
                font: {
                    size: '20px',
                    family: 'Arial',
                    color: '#fff'
                },
                component: 'Header',

                position: 'center',

                width: 400,
                height: 40
            },
            null,
            {
                id: 'char1',
                text: 'NEW',
                component: 'Button',
                position: 'center',
                width: 300,
                height: 50
            },
            {
                id: 'char2',
                text: 'NEW',
                component: 'Button',
                position: 'center',
                width: 300,
                height: 50
            },
            {
                id: 'char3',
                text: 'NEW',
                component: 'Button',
                position: 'center',
                width: 300,
                height: 50
            }
        ]
    };

    var characterCreateWindow = {
        id: 'characterCreateWindow',
        component: 'Window',
        draggable: false,

        padding: 4,

        //component position relative to parent
        position: {x: 200, y: 10},

        width: 800,
        height: 500,

        layout: [null, 10],
        children: [
            {
                text: 'Class',
                font: {
                    size: '20px',
                    family: 'Arial',
                    color: '#fff'
                },
                component: 'Header',

                position: 'center',

                width: 500,
                height: 40
            },
            null,
            null,
            {
                id: 'classSelect',
                component: 'List',
                padding: 20,
                position: 'center',
                width: 770,
                height: 200,
                layout: [3, 2],
                children: [
                    { id: 'warrior', component: 'Window', group: 'classSelect', position: 'center', width: 128, height: 128, image: 'assets/gui/themes/metalworks-theme/images/warrior-up.png', checkmark: 'assets/gui/themes/metalworks-theme/images/warrior-down.png', checked: true },
                    { id: 'rogue', component: 'Window', group: 'classSelect', position: 'center', width: 128, height: 128, image: 'assets/gui/themes/metalworks-theme/images/rogue-up.png', checkmark: 'assets/gui/themes/metalworks-theme/images/rogue-down.png' },
                    { id: 'sorcerer', component: 'Window', group: 'classSelect', position: 'center', width: 128, height: 128, image: 'assets/gui/themes/metalworks-theme/images/sorcerer-up.png', checkmark: 'assets/gui/themes/metalworks-theme/images/sorcerer-down.png' },
                    { text: 'Warrior', component: 'Label', position: 'center', width: 128, height: 128},
                    { text: 'Rogue', component: 'Label', position: 'center', width: 128, height: 128, font: {size: '20px', family: 'Exocet', color: '#ffffff'}},
                    { text: 'Sorcerer', component: 'Label', position: 'center', width: 128, height: 128}
                ]
            },
            null,
            null,
            {
                id: 'classDescription',
                component: 'Label',
                width: 770,
                height: 200,
                padding: 25,
                text: 'class description here\n and here',
                position: 'center'
            },
            null,
            null,
            {
                id: 'cancelButton',
                text: 'Cancel',
                component: 'Button',
                position: 'left',
                width: 80,
                height: 50,
                font: {
                    size: '20px',
                    family: 'Arial',
                    color: '#ffffff'
                }
            }
        ]
    };


    //load EZGUI themes
    //here you can pass multiple themes
    EZGUI.Theme.load(['assets/gui/themes/metalworks-theme/metalworks-theme.json'], function () {

        //create the gui
        //the second parameter is the theme name, see metalworks-theme.json, the name is defined under __config__ field
        var loginElement = EZGUI.create(loginWindow, 'metalworks');
        loginElement.visible = false;

        var characterSelectElement = EZGUI.create(characterSelectWindow, 'metalworks');
        characterSelectElement.visible = false;

        var characterCreateElement = EZGUI.create(characterCreateWindow, 'metalworks');
        characterCreateElement.visible = true;

        var oneTime = true;

        EZGUI.components.loginButton.on('click', function (event) {
            if (oneTime) {
                console.log(EZGUI.components.username.text, EZGUI.components.password.text);
                oneTime = !oneTime;
                setTimeout(function () {
                    oneTime = true;
                }, 1);
            }
            loginElement.visible = false;
            characterSelectElement.visible = true;
        });

        EZGUI.components.char1.on('click', function (event) {
            characterSelectElement.visible = false;
            characterCreateElement.visible = true;
        });

        EZGUI.components.char2.on('click', function (event) {
            characterSelectElement.visible = false;
            characterCreateElement.visible = true;
        });

        EZGUI.components.char3.on('click', function (event) {
            characterSelectElement.visible = false;
            characterCreateElement.visible = true;
        });

    });
}