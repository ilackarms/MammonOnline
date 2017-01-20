function main() {
    // init socket
    var socket = io();
    var handlers = require('./handlers/handlers')(socket);
    handlers.registerHandlers();

    //init game
    var game =  new Phaser.Game(800, 480, Phaser.CANVAS, 'game');

    //init game states
    game.state.add('boot', require('./states/boot')(game));
    game.state.add('load', require('./states/load')(game));
    game.state.add('login', require('./states/login')(game, socket));

    //enter boot state
    game.state.start('boot');
}

main();

function main_old(){
    socket = io();
    socket.on('connected', function (data) {
        game = new Phaser.Game(1200, 600, Phaser.AUTO, 'game', {
            preload: function () {
                var resources = [
                    'assets/gui/themes/metalworks-theme/images/warrior-up.png',
                    'assets/gui/themes/metalworks-theme/images/warrior-down.png',
                    'assets/gui/themes/metalworks-theme/images/rogue-up.png',
                    'assets/gui/themes/metalworks-theme/images/rogue-down.png',
                    'assets/gui/themes/metalworks-theme/images/sorcerer-up.png',
                    'assets/gui/themes/metalworks-theme/images/sorcerer-down.png',
                    'assets/gui/themes/metalworks-theme/images/radio-empty.png',
                    'assets/gui/themes/metalworks-theme/images/radio-filled.png',
                    'assets/gui/portraits/checkbox.bmp'
                ];
                for (var i = 1; i < 40; i++) {
                    resources.push('assets/gui/portraits/Rogue'+i+'.bmp');
                    resources.push('assets/gui/portraits/Sorc'+i+'.bmp');
                    resources.push('assets/gui/portraits/War'+i+'.bmp');
                }
                for (var i = 0; i < resources.length; i++) {
                    game.load.image(resources[i], resources[i]);
                }

                game.load.onLoadComplete.add(EZGUI.Compatibility.fixCache, game.load, null, resources);
            },
            create: function () {
                loadGUI();
                game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
            },
            update: function () {},
            render: function () {}
        });
    });

    socket.on('characterCreationSuccessful', function (data) {
        game.destroy();
        alert('DESTROY OLD GAME START NEW HERE :d '+ data);
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

        layout: [1, 10],
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
                text: '',
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
                text: 'Login',
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
                height: 300,
                layout: [3, 3],
                children: [
                    { id: 'warriorRadio', component: 'Radio', group: 'classSelect', position: 'center', width: 128, height: 128, image: 'assets/gui/themes/metalworks-theme/images/warrior-up.png', checkmark: 'assets/gui/portraits/checkbox.bmp'},
                    { id: 'rogueRadio', component: 'Radio', group: 'classSelect', position: 'center', width: 128, height: 128, image: 'assets/gui/themes/metalworks-theme/images/rogue-up.png', checkmark: 'assets/gui/portraits/checkbox.bmp'},
                    { id: 'sorcererRadio', component: 'Radio', group: 'classSelect', position: 'center', width: 128, height: 128, image: 'assets/gui/themes/metalworks-theme/images/sorcerer-up.png', checkmark: 'assets/gui/portraits/checkbox.bmp'},
                    null,
                    null,
                    null,
                    { id: 'warriorLabel', text: 'Warrior', component: 'Label', position: 'left', width: 240, height: 15},
                    { id: 'rogueLabel', text: 'Rogue', component: 'Label', position: 'left', width: 240, height: 15},
                    { id: 'sorcererLabel', text: 'Sorcerer', component: 'Label', position: 'left', width: 240, height: 15}
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

    var statSelectWindow = {
        id: 'statSelectWindow',
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
                text: 'Select Starting Stats',
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
                component: 'Layout',
                position: 'top center',
                padding: 10,
                width: 500,
                height: 200,
                layout: [2, 3],
                children: [
                    {
                        id: 'strSlider',
                        component: 'Slider',
                        slide: { width: 30, height: 40 },
                        position: 'center',
                        width: 240,
                        height: 40
                    },
                    {
                        id: 'strLabel',
                        text: 'Strength: ',
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
                        id: 'dexSlider',
                        component: 'Slider',
                        slide: { width: 30, height: 40 },
                        position: 'center',
                        width: 240,
                        height: 40
                    },
                    {
                        id: 'dexLabel',
                        text: 'Dexterity: ',
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
                        id: 'intSlider',
                        component: 'Slider',
                        slide: { width: 30, height: 40 },
                        position: 'center',
                        width: 240,
                        height: 40
                    },
                    {
                        id: 'intLabel',
                        text: 'Intelligence: ',
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
                ]
            },
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            {
                position: 'center',
                component: 'Layout_No_Border',
                width: 800,
                height: 60,
                children: [
                    {
                        id: 'statCancelButton',
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
                        id: 'statContinueButton',
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
    };

    var portraitSelectWindow = {
        id: 'portraitSelectWindow',
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
                text: 'Select Portrait',
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
                id: 'portraitList',
                component: 'List',
                position: 'top center',
                width: 800,
                height: 240,
                layout: [6, null],
                children: []
            },
            null,
            null,
            null,
            null,
            {
                text: 'Name:',
                position: 'center',
                component: 'Label',
                width: 100,
                height: 50,
                font: {
                    size: '18px',
                    family: 'Georgia',
                    color: '#fbfff8'
                }
            },
            {
                id: 'characterName',
                text: '',
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
            null,
            {
                position: 'center',
                component: 'Layout_No_Border',
                width: 800,
                height: 60,
                children: [
                    {
                        id: 'portraitCancelButton',
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
                        id: 'portraitContinueButton',
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
                if (this.children[i].id === 'portraitList') {
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

    var sorcererDescription = 'Sorcerers are skilled in magical arts, but have weaker combat skills.\n' +
        'Sorcerers excel in Alchemy, the art of crafting potions.' +
        'Class Skills: \n' +
        'Evasion, Alchemy, Herbalism, Magery, Magic Penetration, Meditation, \n' +
        'Magic Resistance, Concentration, Athletics, Barter';

    EZGUI.Theme.load(['assets/gui/themes/metalworks-theme/metalworks-theme.json'], function () {
        var oneTime = true;
        function runOnce(f) {
            if (oneTime) {
                f();
                oneTime = !oneTime;
                setTimeout(function () {
                    oneTime = true;
                }, 1);
            }
        }

        function getStat(percent) {
            return Math.ceil(10 + percent * 50);
        }

        function setStatLabels() {
            EZGUI.components.strLabel.text = "Strength:     "+getStat(EZGUI.components.strSlider.value);
            EZGUI.components.dexLabel.text = "Dexterity:    "+getStat(EZGUI.components.dexSlider.value);
            EZGUI.components.intLabel.text = "Intelligence: "+getStat(EZGUI.components.intSlider.value);
        }

        function balanceStats(stat) {
            var stat1, stat2;
            switch (stat) {
                case 'str':
                    stat1 = 'dex';
                    stat2 = 'int';
                    break;
                case 'dex':
                    stat1 = 'int';
                    stat2 = 'str';
                    break;
                case 'int':
                    stat1 = 'str';
                    stat2 = 'dex';
                    break;
            }
            var val1 = EZGUI.components[stat1+'Slider'].value;
            var val2 = EZGUI.components[stat2+'Slider'].value;
            var remaining = 1.5 - EZGUI.components[stat+'Slider'].value - val1 - val2;
            // console.log(getStat(remaining));
            val1 += remaining/2;
            val2 += remaining/2;
            EZGUI.components[stat1+'Slider'].value = val1;
            EZGUI.components[stat2+'Slider'].value = val2;
            console.log(105 - (getStat(EZGUI.components[stat+'Slider'].value) +
                getStat(EZGUI.components[stat1+'Slider'].value) +
                getStat(EZGUI.components[stat2+'Slider'].value)));
            setStatLabels();
        }

        var loginElement = EZGUI.create(loginWindow, 'metalworks');
        loginElement.visible = true;

        var characterSelectElement = EZGUI.create(characterSelectWindow, 'metalworks');
        characterSelectElement.visible = false;

        var classSelectElement = EZGUI.create(classSelectWindow, 'metalworks');
        classSelectElement.visible = false;
        EZGUI.components.classDescription.text = 'Select a class and click Continue';
        EZGUI.components.classDescription.y = 300;

        var skillSelectElement; //dynamically generated

        var statSelectElement = EZGUI.create(statSelectWindow, 'metalworks');
        statSelectElement.visible = false;
        EZGUI.components.strSlider.value = 0.5;
        EZGUI.components.dexSlider.value = 0.5;
        EZGUI.components.intSlider.value = 0.5;
        balanceStats('str');

        var portraitSelectElement; //dynamically generated

        //player selections
        var selectedClass;
        var selectedSkills;
        var selectedStats;
        var selectedPortrait;
        var characterName;

        function displaySkillListWindow(skills) {
            var list = skillSelectWindow.getListElement();
            for (var i = 0; i < skills.length; i++) {
                var skill = skills[i];
                list.children.push({ id: skill+'Checkbox', text: skill, component: 'Checkbox', position: 'center left', width: 40, height: 40});
            }
            //for some reason last xbox is not clickable, so make an extra one
            list.children.push({ id: 'bugFixCheckbox', text: 'DO_NOT_DISPLAY', component: 'Checkbox', position: 'center left', width: 40, height: 40, visible: false});
            skillSelectElement = EZGUI.create(skillSelectWindow, 'metalworks');
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
                    skillSelectElement.visible = false;
                    statSelectElement.visible = true;
                });
            });
        }

        function displayPortraitSelectWindow() {
            var imagePrefix;
            switch(selectedClass){
                case 'Rogue':
                    imagePrefix = 'Rogue';
                    break;
                case 'Warrior':
                    imagePrefix = 'War';
                    break;
                case 'Sorcerer':
                    imagePrefix = 'Sorc';
                    break;
            }
            var list = portraitSelectWindow.getListElement();
            for (var i = 1; i < 40; i++) {
                var img = 'assets/gui/portraits/'+imagePrefix+i+'.bmp';
                console.log(img);
                var portraitImage = {
                    id: img,
                    component: 'Radio',
                    position: 'center',
                    // padding: 20,
                    width: 110,
                    height: 170,
                    image: img,
                    checkmark: 'assets/gui/portraits/checkbox.bmp',
                    group: 'portraitGroup',
                };
                list.children.push(portraitImage);
            }
            portraitSelectElement = EZGUI.create(portraitSelectWindow, 'metalworks');
            portraitSelectElement.visible = true;

            EZGUI.components.portraitCancelButton.on('click', function (event) {
                location.reload();
            });
            EZGUI.components.portraitContinueButton.on('click', function (event) {
                runOnce(function () {
                    var portrait = EZGUI.radioGroups['portraitGroup'].selected;
                    characterName = EZGUI.components.characterName.text;
                    console.log(portrait);
                    if (portrait && characterName.length > 4 && characterName.length < 40) {
                        selectedPortrait = portrait.Id;
                        displaySummaryWindow();
                    }
                });
                portraitSelectElement.visible = false;
            });
        }

        function displaySummaryWindow() {
            // characterName = 'fooboo';
            // selectedClass = 'Rogue';
            // selectedStats = {str: 35, dex: 35, int: 35};
            // selectedSkills = ['Evasion', 'Athletics', 'Something'];
            // selectedPortrait = 'assets/gui/portraits/Rogue2.bmp';

            var summaryWindow = {
                id: 'summaryWindow',
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
                        text: 'Character Summary',
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
                        component: 'Layout',
                        position: 'top center',
                        width: 600,
                        height: 400,
                        layout: [2, 6],
                        children: [
                            {
                                text: 'Name: '+characterName,
                                position: 'center',
                                component: 'Label',
                                width: 100,
                                height: 50,
                                font: {
                                    size: '18px',
                                    family: 'Georgia',
                                    color: '#fbfff8'
                                }
                            },
                            null,
                            {
                                text: 'Class: '+selectedClass,
                                position: 'center',
                                component: 'Label',
                                width: 100,
                                height: 50,
                                font: {
                                    size: '18px',
                                    family: 'Georgia',
                                    color: '#fbfff8'
                                }
                            },
                            {
                                text: 'Strength: '+selectedStats.str+'\n' +
                                'Dexterity: '+selectedStats.dex+'\n'+
                                'Intelligence: '+selectedStats.int,
                                position: 'bottom center',
                                component: 'Label',
                                width: 100,
                                height: 50,
                                font: {
                                    size: '18px',
                                    family: 'Georgia',
                                    color: '#fbfff8'
                                }
                            },
                            null,
                            null,
                            {
                                image: selectedPortrait,
                                position: 'center',
                                component: 'Window',
                                width: 110,
                                height: 170,
                            },
                            {
                                text: 'Starting Skills: \n'+selectedSkills.join('\n'),
                                position: 'center',
                                component: 'Label',
                                width: 100,
                                height: 50,
                                font: {
                                    size: '18px',
                                    family: 'Georgia',
                                    color: '#fbfff8'
                                }
                            },
                            null,
                            null,
                        ],
                    },
                    null,
                    null,
                    null,
                    {
                        id: 'summaryErrText',
                        text: '',
                        position: 'center',
                        component: 'Label',
                        width: 100,
                        height: 50,
                        font: {
                            size: '18px',
                            family: 'Georgia',
                            color: '#b82730'
                        }
                    },
                    null,
                    null,
                    null,
                    {
                        position: 'center',
                        component: 'Layout_No_Border',
                        width: 800,
                        height: 60,
                        children: [
                            {
                                id: 'summaryCancelButton',
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
                                id: 'summaryConfirmButton',
                                text: 'Confirm',
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
            };
            var summaryElement = EZGUI.create(summaryWindow, 'metalworks');
            summaryElement.visible = true;
            EZGUI.components.summaryCancelButton.on('click', function (event) {
                location.reload();
            });
            socket.on('createNewCharacterError', function (data) {
                EZGUI.components.summaryErrText.text = data;
            });
            EZGUI.components.summaryConfirmButton.on('click', function (event) {
                runOnce(function () {
                    var newCharacterInfo = {
                        characterName: characterName,
                        selectedClass: selectedClass,
                        selectedStats: selectedStats,
                        selectedSkills: selectedSkills,
                        selectedPortrait: selectedPortrait,
                    };
                    socket.emit('createNewCharacter', JSON.stringify(newCharacterInfo));
                });
            });
        }


        EZGUI.components.strSlider.on('mouseup', function (event) {
            runOnce(function () {
                balanceStats('str');
            });
        });
        EZGUI.components.dexSlider.on('mouseup', function (event) {
            runOnce(function () {
                balanceStats('dex');
            });
        });
        EZGUI.components.intSlider.on('mouseup', function (event) {
            runOnce(function () {
                balanceStats('int');
            });
        });

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
                var selectedClassObj = EZGUI.radioGroups['classSelect'].selected;
                if (selectedClassObj) {
                    switch (selectedClassObj.Id) {
                        case 'warriorRadio':
                            selectedClass = 'Warrior';
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
                        case 'rogueRadio':
                            selectedClass = 'Rogue';
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
                        case 'sorcererRadio':
                            selectedClass = 'Sorcerer';
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

        EZGUI.components.statCancelButton.on('click', function (event) {
            location.reload();
        });
        EZGUI.components.statContinueButton.on('click', function (event) {
            runOnce(function () {
                statSelectElement.visible = false;
                selectedStats = {
                    str: getStat(EZGUI.components.strSlider.value),
                    dex: getStat(EZGUI.components.dexSlider.value),
                    int: getStat(EZGUI.components.intSlider.value)
                };
                displayPortraitSelectWindow();
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

//tryinig with slick instead
function main2(){
    socket = io();

    game = new Phaser.Game(1200, 600, Phaser.AUTO, 'game', {
        preload: function () {
            // You can use your own methods of making the plugin publicly available. Setting it as a global variable is the easiest solution.
            slickUI = game.plugins.add(Phaser.Plugin.SlickUI);
            slickUI.load('assets/gui/themes/kenney/kenney.json'); // Use the path to your kenney.json. This is the file that defines your theme.
            game.add.plugin(PhaserInput.Plugin);
        },
        create: function () {
            loadSlickGUI();
            // game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
        },
        update: function () {},
        render: function () {}
    });
}

function loadSlickGUI(){
    var panel;
    slickUI.add(panel = new SlickUI.Element.Panel(8, 8, 150, game.height - 16));
    var button;
    panel.add(button = new SlickUI.Element.Button(0,0, 140, 80));
    button.events.onInputUp.add(function () {console.log('Clicked button');});
    button.add(new SlickUI.Element.Text(0,0, "My button")).center();
    var password = game.add.inputField(10, 90, {
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
    setTimeout(function () {
        panel.destroy();
    }, 3000)
}

var MenuState = function () {
    function loadLoginMenu() {

    }

    function loadCharacterSelectMenu(characters) {

    }

    function loadCharacterCreateMenu() {

    }
};