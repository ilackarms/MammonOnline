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
                'assets/gui/themes/metalworks-theme/images/sorcerer-down.png',
                'assets/gui/themes/metalworks-theme/images/radio-empty.png',
                'assets/gui/themes/metalworks-theme/images/radio-filled.png'
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
        height: 550,

        layout: [null, 10],
        children: [
            {
                text: 'Mammon Online v0.1',
                font: {
                    size: '20px',
                    family: 'Georgia',
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
                    family: 'Georgia',
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
                    family: 'Georgia',
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
                    family: 'Georgia',
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
        height: 550,

        layout: [null, 10],
        children: [
            {
                text: 'Character Select',
                font: {
                    size: '20px',
                    family: 'Georgia',
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
        height: 550,

        layout: [null, 10],
        children: [
            {
                text: 'Select Class',
                font: {
                    size: '20px',
                    family: 'Georgia',
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
                padding: 50,
                position: 'center',
                width: 790,
                height: 200,
                layout: [3, 2],
                children: [
                    { id: 'warriorIcon', component: 'Window', group: 'classSelect', position: 'center', width: 128, height: 128, image: 'assets/gui/themes/metalworks-theme/images/warrior-up.png'},
                    { id: 'rogueIcon', component: 'Window', group: 'classSelect', position: 'center', width: 128, height: 128, image: 'assets/gui/themes/metalworks-theme/images/rogue-up.png'},
                    { id: 'sorcererIcon', component: 'Window', group: 'classSelect', position: 'center', width: 128, height: 128, image: 'assets/gui/themes/metalworks-theme/images/sorcerer-up.png'},
                    { id: 'warriorRadio', text: 'Warrior', component: 'Radio', position: 'left', width: 32, height: 32, image: 'assets/gui/themes/metalworks-theme/images/radio-empty.png', checkmark: 'assets/gui/themes/metalworks-theme/images/radio-filled.png'},
                    { id: 'rogueRadio', text: 'Rogue', component: 'Radio', position: 'left', width: 32, height: 32, image: 'assets/gui/themes/metalworks-theme/images/radio-empty.png', checkmark: 'assets/gui/themes/metalworks-theme/images/radio-filled.png'},
                    { id: 'sorcererRadio', text: 'Sorcerer', component: 'Radio', position: 'left', width: 32, height: 32, image: 'assets/gui/themes/metalworks-theme/images/radio-empty.png', checkmark: 'assets/gui/themes/metalworks-theme/images/radio-filled.png'}
                ]
            },
            null,
            null,
            {
                id: 'classDescription',
                component: 'Label',
                width: 790,
                height: 200,
                padding: 0,
                // text: 'Select a class to read its description.\nClick OK to continue',
                text: '',
                position: 'top left',
                font: {
                    size: '20px',
                    family: 'Georgia',
                    color: '#ffffff'
                }
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
                    size: '15px',
                    family: 'Georgia',
                    color: '#ffffff'
                }
            }
        ]
    };

    var warriorDescription = 'Warriors are experts in melee combat. They excel at tanking and dealing large amounts of \n' +
        'physical damage. Warriors are the only class capable of using shields.\n' +
        'Warriors excel in crafting skills.\n'+
        'Class Skills:\n'+
        'Mace Fighting, Parrying, Swordsmanship, Tactics, Unarmed Fighting, Evasion, Healing, \n' +
        'Mining, Blacksmithy, Lumberjacking, Carpentry, Athletics, Barter, Magic Resistance';

    var rogueDescription = 'Rogues are skilled in ranged combat, as well as techniques of subterfuge and thievery. \n' +
        'Rogues have access to the Sneak Attack technique, which grants damage \n' +
        'bonuses when attacking from stealth. Rogues are the only class capable of using bows. \n' +
        'Class Skills: \n' +
        'Archery, Mace Fighting, Swordsmanship, Tactics, Unarmed Fighting, \n' +
        'Evasion, Detecting Hidden, Hiding, Snooping, Stealing, Stealth, \n' +
        'Athletics, Barter, Magic Resistance';

    var sorcererDescription = 'Sorcerers are skilled in magical arts, but lack combat skills.\n' +
        'Sorcerers excel in Alchemy, the art of crafting potions.' +
        'Class Skills: \n' +
        'Evasion, Alchemy, Herbalism, Magery, Magic Penetration, Meditation, \n' +
        'Magic Resistance, Concentration';

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

        EZGUI.components.classDescription.text = 'Select a class and click OK';
        EZGUI.components.classDescription.y = 300;

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

        EZGUI.components.warriorRadio.on('click', function (event) {
            EZGUI.components.classDescription.text = warriorDescription;
        });
        EZGUI.components.rogueRadio.on('click', function (event) {
            EZGUI.components.classDescription.text = rogueDescription;
        });
        EZGUI.components.sorcererRadio.on('click', function (event) {
            EZGUI.components.classDescription.text = sorcererDescription;
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