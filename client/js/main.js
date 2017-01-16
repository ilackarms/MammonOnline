window.onload = main;

function main(){
    var socket = io();
    socket.on('connected', function (data) {
        console.log('welcome to the server bro: ', data);
        socket.emit('asdf', 'hihi');
    });

    var game = new Phaser.Game(1200, 600, Phaser.AUTO, 'game', {
        preload: function () {},
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
                id: 'btn1',
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

    //load EZGUI themes
    //here you can pass multiple themes
    EZGUI.Theme.load(['assets/gui/themes/metalworks-theme/metalworks-theme.json'], function () {

        //create the gui
        //the second parameter is the theme name, see metalworks-theme.json, the name is defined under __config__ field
        var loginElement = EZGUI.create(loginWindow, 'metalworks');
        var characterSelectElement = EZGUI.create(characterSelectWindow, 'metalworks');
        characterSelectElement.visible = false;

        EZGUI.components.btn1.on('click', function (event) {
            console.log(EZGUI.components.username.text, EZGUI.components.password.text);
            loginElement.visible = false;
            characterSelectElement.visible = true;
        });
    });
}