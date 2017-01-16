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

        layout: [2, 10],
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

    var classSelectWindow = {
        id: 'classSelectWindow',
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
                    { id: 'warriorIcon', component: 'Window', position: 'center', width: 128, height: 128, image: 'assets/gui/themes/metalworks-theme/images/warrior-up.png'},
                    { id: 'rogueIcon', component: 'Window', position: 'center', width: 128, height: 128, image: 'assets/gui/themes/metalworks-theme/images/rogue-up.png'},
                    { id: 'sorcererIcon', component: 'Window', position: 'center', width: 128, height: 128, image: 'assets/gui/themes/metalworks-theme/images/sorcerer-up.png'},
                    { id: 'warriorRadio', text: 'Warrior', component: 'Radio', group: 'classSelect', position: 'left', width: 32, height: 32, image: 'assets/gui/themes/metalworks-theme/images/radio-empty.png', checkmark: 'assets/gui/themes/metalworks-theme/images/radio-filled.png'},
                    { id: 'rogueRadio', text: 'Rogue', component: 'Radio', group: 'classSelect', position: 'left', width: 32, height: 32, image: 'assets/gui/themes/metalworks-theme/images/radio-empty.png', checkmark: 'assets/gui/themes/metalworks-theme/images/radio-filled.png'},
                    { id: 'sorcererRadio', text: 'Sorcerer', component: 'Radio', group: 'classSelect', position: 'left', width: 32, height: 32, image: 'assets/gui/themes/metalworks-theme/images/radio-empty.png', checkmark: 'assets/gui/themes/metalworks-theme/images/radio-filled.png'}
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
                id: 'buttonFrame',
                position: 'center',
                component: 'Layout_No_Border',
                width: 800,
                height: 60,
                children: [
                    {
                        id: 'classCancelButton',
                        text: 'Cancel',
                        component: 'Button',
                        position: 'left',
                        width: 80,
                        height: 50,
                        font: {
                            size: '15px',
                            family: 'Georgia',
                            color: '#000000'
                        }
                    },
                    {
                        id: 'classContinueButton',
                        text: 'Continue',
                        component: 'Button',
                        position: 'right',
                        width: 80,
                        height: 50,
                        font: {
                            size: '15px',
                            family: 'Georgia',
                            color: '#000000'
                        }
                    }
                ]
            }
        ]
    };

    var skillSelectWindow = {
        id: 'skillSelectWindow',
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
                text: 'Select Starting Skills',
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
            {
                id: 'startingSkillsList',
                component: 'List',
                padding: 20,
                position: 'top center',
                width: 600,
                height: 400,
                layout: [null, 10],
                children: []
            },
            null,
            null,
            null,
            null,
            null,
            null,
            {
                id: 'skillSelectMessage',
                text: 'Tip: Click and drag checkboxes to scroll this list',
                component: 'Label',
                position: 'center',
                padding: 20,
                width: 80,
                height: 20,
                font: {
                    size: '18px',
                    family: 'Georgia',
                    color: '#ffffff'
                }
            },
            {
                position: 'center',
                component: 'Layout_No_Border',
                width: 800,
                height: 60,
                children: [
                    {
                        id: 'skillCancelButton',
                        text: 'Cancel',
                        component: 'Button',
                        position: 'left',
                        width: 80,
                        height: 50,
                        font: {
                            size: '15px',
                            family: 'Georgia',
                            color: '#000000'
                        }
                    },
                    {
                        id: 'skillContinueButton',
                        text: 'Continue',
                        component: 'Button',
                        position: 'right',
                        width: 80,
                        height: 50,
                        font: {
                            size: '15px',
                            family: 'Georgia',
                            color: '#000000'
                        }
                    }
                ]
            }
        ],
        getListElement: function () {
            for (var i = 0; this.children.length; i++) {
                if (this.children[i].id === 'startingSkillsList') {
                    return this.children[i];
                }
            }
        }
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
        'Magic Resistance, Concentration, Athletics, Barter';

    //load EZGUI themes
    //here you can pass multiple themes
    EZGUI.Theme.load(['assets/gui/themes/metalworks-theme/metalworks-theme.json'], function () {

        //create the gui
        //the second parameter is the theme name, see metalworks-theme.json, the name is defined under __config__ field
        var loginElement = EZGUI.create(loginWindow, 'metalworks');
        loginElement.visible = false;

        var characterSelectElement = EZGUI.create(characterSelectWindow, 'metalworks');
        characterSelectElement.visible = false;

        var classSelectElement = EZGUI.create(classSelectWindow, 'metalworks');
        classSelectElement.visible = true;

        var skillSelectElement; //dynamically generated

        var oneTime = true;
        var oneTimePermanently = true;

        EZGUI.components.classDescription.text = 'Select a class and click Continue';
        EZGUI.components.classDescription.y = 300;

        function runOnce(f) {
            if (oneTime) {
                f();
                oneTime = !oneTime;
                setTimeout(function () {
                    oneTime = true;
                }, 1);
            }
        }

        //player selections
        var selectedClass;
        var selectedSkills;

        function displaySkillListWindow(skills) {
            var list = skillSelectWindow.getListElement();
            for (var i = 0; i < skills.length; i++) {
                var skill = skills[i];
                list.children.push({ id: skill+'Checkbox', text: skill, component: 'Checkbox', position: 'center left', width: 40, height: 40});
            }
            //for some reason last xbox is not clickable, so make an extra one
            list.children.push({ id: 'bugFixCheckbox', text: 'DO_NOT_DISPLAY', component: 'Checkbox', position: 'center left', width: 40, height: 40, visible: false});
            skillSelectElement = EZGUI.create(skillSelectWindow, 'metalworks');
            skillSelectElement.visible = false;
            //set up button handlers
            EZGUI.components.bugFixCheckbox.visible = false;

                EZGUI.components.skillCancelButton.on('click', function (event) {
                location.reload();
            });
            EZGUI.components.skillContinueButton.on('click', function (event) {
                runOnce(function () {
                    var checkedSkills = [];
                    for (var i = 0; i < skills.length; i++) {
                        var skill = skills[i];
                        var checkboxID = skill+'Checkbox';
                        if (EZGUI.components[checkboxID].checked) {
                            console.log(skill);
                            checkedSkills.push(skill);
                        }
                    }

                    if (checkedSkills.length != 3) {
                        EZGUI.components.skillSelectMessage.text = 'You must select exactly 3 starting skills';
                        return;
                    }
                    selectedSkills = checkedSkills;
                    classSelectElement.visible = true;
                    skillSelectElement.visible = false;
                });
            });
        }

        EZGUI.components.loginButton.on('click', function (event) {
            runOnce(function () {
                console.log(EZGUI.components.username.text, EZGUI.components.password.text);
            });
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

        EZGUI.components.classCancelButton.on('click', function (event) {
            location.reload();
        });
        EZGUI.components.classContinueButton.on('click', function (event) {
            runOnce(function () {
                selectedClass = EZGUI.radioGroups['classSelect'].selected;
                if (selectedClass) {
                    switch (selectedClass.text) {
                        case 'Warrior':
                            displaySkillListWindow([
                                'Athletics',
                                'Barter',
                                'Blacksmithy',
                                'Carpentry',
                                'Evasion',
                                'Healing',
                                'Lumberjacking',
                                'Mace Fighting',
                                'Magic Resistance',
                                'Mining',
                                'Parrying',
                                'Swordsmanship',
                                'Tactics',
                                'Unarmed Fighting'
                            ]);
                            break;
                        case 'Rogue':
                            displaySkillListWindow([
                                'Archery',
                                'Athletics',
                                'Barter',
                                'Detecting Hidden',
                                'Evasion',
                                'Hiding',
                                'Mace Fighting',
                                'Magic Resistance',
                                'Swordsmanship',
                                'Tactics',
                                'Unarmed Fighting',
                                'Snooping',
                                'Stealing',
                                'Stealth'
                            ]);
                            break;
                        case 'Sorcerer':
                            displaySkillListWindow([
                                'Alchemy',
                                'Athletics',
                                'Barter',
                                'Concentration',
                                'Evasion',
                                'Herbalism',
                                'Magery',
                                'Magic Penetration',
                                'Magic Resistance',
                                'Meditation'
                            ]);
                            break;
                    }
                    classSelectElement.visible = false;
                    skillSelectElement.visible = true;

                }
            });
        });

        EZGUI.components.char1.on('click', function (event) {
            characterSelectElement.visible = false;
            classSelectElement.visible = true;
        });

        EZGUI.components.char2.on('click', function (event) {
            characterSelectElement.visible = false;
            classSelectElement.visible = true;
        });

        EZGUI.components.char3.on('click', function (event) {
            characterSelectElement.visible = false;
            classSelectElement.visible = true;
        });



    });
}