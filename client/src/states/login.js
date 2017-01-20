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
        var char0 = panel.add(char1 = new SlickUI.Element.Button(panel.width/2 - 70, panel.height/2 - 80, 140, 40));
        if (character_names[0]) {
            char0.add(new SlickUI.Element.Text(0, 0, character_names[0], 20, 'basic')).center();
        } else {
            char0.add(new SlickUI.Element.Text(0, 0, 'NEW', 20, 'basic')).center();
            char0.events.onInputUp.add(function () {
                utils.deleteSlickUIElement(panel);
                //choose character slot
                this.slot = 0;
                login._displayNewCharacterMenu();
            });
        }
        var cancel = panel.add(new SlickUI.Element.Button(0, panel.height - 40, 140, 40));
        cancel.add(new SlickUI.Element.Text(0,0, "Cancel", 24, 'basic')).center();
        cancel.events.onInputUp.add(function () {
            location.reload();
        });
    };

    login._displayNewCharacterMenu = function () {
        var rogueDescription = 'Rogues are skilled in ranged combat, as well as techniques of subterfuge and thievery. ' +
            'Rogues have access to the Sneak Attack technique, which grants damage ' +
            'bonuses when attacking from stealth. Rogues are the only class capable of using bows.\n' +
            'Class Skills: ' +
            'Archery, Mace Fighting, Swordsmanship, Tactics, Unarmed Fighting, ' +
            'Evasion, Detecting Hidden, Hiding, Snooping, Stealing, Stealth, ' +
            'Athletics, Barter, Magic Resistance';

        var warriorDescription = 'Warriors are experts in melee combat. They excel at tanking and dealing large amounts of ' +
            'physical damage. Warriors are the only class capable of using shields. ' +
            'Warriors excel in crafting skills.\n'+
            'Class Skills:'+
            'Mace Fighting, Parrying, Swordsmanship, Tactics, Unarmed Fighting, Evasion, Healing, ' +
            'Mining, Blacksmithy, Lumberjacking, Carpentry, Athletics, Barter, Magic Resistance';

        var sorcererDescription = 'Sorcerers are skilled in magical arts, but have weaker combat skills. ' +
            'Sorcerers excel in Alchemy, the art of crafting potions.\n' +
            'Class Skills: ' +
            'Evasion, Alchemy, Herbalism, Magery, Magic Penetration, Meditation, ' +
            'Magic Resistance, Concentration, Athletics, Barter';


        var panel = this.slickUI.add(new SlickUI.Element.Panel(20, 20, game.width - 40, game.height - 40));
        panel.add(new SlickUI.Element.Text(0, 0, 'Create a New Character', 36, 'title')).centerHorizontally();
        var selectedClassText = panel.add(new SlickUI.Element.Text(40, 60, 'Select Class:', 24, 'basic'));
        var classInfo = panel.add(new SlickUI.Element.Text(20, 240, '', 18, 'basic', panel.width - 40));
        
        //rogue
        var rogueIcon = game.add.sprite(0, 0, 'rogue_icon');
        var rogueButton = panel.add(new SlickUI.Element.Button(80, 100, rogueIcon.width+10, rogueIcon.height+20));
        rogueButton.add(new SlickUI.Element.DisplayObject(0, 0, rogueIcon));
        rogueButton.add(new SlickUI.Element.Text(0, rogueButton.height - 16, 'Rogue', 14, 'basic')).centerHorizontally();
        rogueButton.events.onInputUp.add(function () {
            classInfo.value = rogueDescription;
            selectedClassText.value = 'Selected: Rogue';
            this.selectedClass = 'Rogue';
        });
        
        //warrior
        var warriorIcon = game.add.sprite(0, 0, 'warrior_icon');
        var warriorButton = panel.add(new SlickUI.Element.Button(280, 100, warriorIcon.width+10, warriorIcon.height+20));
        warriorButton.add(new SlickUI.Element.DisplayObject(0, 0, warriorIcon));
        warriorButton.add(new SlickUI.Element.Text(0, warriorButton.height - 16, 'Warrior', 14, 'basic')).centerHorizontally();
        warriorButton.events.onInputUp.add(function () {
            classInfo.value = warriorDescription;
            selectedClassText.value = 'Selected: Warrior';
            this.selectedClass = 'Warrior';
        });

        //sorcerer
        var sorcererIcon = game.add.sprite(0, 0, 'sorcerer_icon');
        var sorcererButton = panel.add(new SlickUI.Element.Button(480, 100, sorcererIcon.width+10, sorcererIcon.height+20));
        sorcererButton.add(new SlickUI.Element.DisplayObject(0, 0, sorcererIcon));
        sorcererButton.add(new SlickUI.Element.Text(0, sorcererButton.height - 16, 'Sorcerer', 14, 'basic')).centerHorizontally();
        sorcererButton.events.onInputUp.add(function () {
            classInfo.value = sorcererDescription;
            selectedClassText.value = 'Selected: Sorcerer';
            this.selectedClass = 'Sorcerer';
        });

        var cont = panel.add(new SlickUI.Element.Button(panel.width - 140, panel.height - 40, 140, 40));
        cont.add(new SlickUI.Element.Text(0,0, "Continue", 24, 'basic')).center();
        cont.events.onInputUp.add(function () {
            if (this.selectedClass) {
                utils.deleteSlickUIElement(panel);
                login._displayStatsMenu();
            }
        });

        var cancel = panel.add(new SlickUI.Element.Button(0, panel.height - 40, 140, 40));
        cancel.add(new SlickUI.Element.Text(0,0, "Cancel", 24, 'basic')).center();
        cancel.events.onInputUp.add(function () {
            location.reload();
        });
    };

    login._displayStatsMenu = function () {
        var strDescription = 'Strength affects accuracy and combat damage with melee weapons, ' +
            'base hit points, and all-around toughness.';
        var dexDescription = 'Dexterity affects accuracy and combat damage with bows, ' +
            'attack speed (with all weapons), evasion rating, and skills related to ' +
            'subterfuge and pickpocketing.';
        var intDescription = 'Intelligence affects spell damage, magic resistance, and all abilities ' +
            'related to the arcane arts. Intelligence also affects the rate at which charcters raise their ' +
            'skills.';
        var panel = this.slickUI.add(new SlickUI.Element.Panel(20, 20, game.width - 40, game.height - 40));
        panel.add(new SlickUI.Element.Text(0, 0, 'Create a New Character', 36, 'title')).centerHorizontally();
        panel.add(new SlickUI.Element.Text(40, 60, 'Select Starting Attributes:', 24, 'basic'));
        var attributeInfo = panel.add(new SlickUI.Element.Text(20, 240, '', 18, 'basic', panel.width - 40));

        var cont = panel.add(new SlickUI.Element.Button(panel.width - 140, panel.height - 40, 140, 40));
        cont.add(new SlickUI.Element.Text(0,0, "Continue", 24, 'basic')).center();
        cont.events.onInputUp.add(function () {
            console.log(this.stats = {});
        });

        var cancel = panel.add(new SlickUI.Element.Button(0, panel.height - 40, 140, 40));
        cancel.add(new SlickUI.Element.Text(0,0, "Cancel", 24, 'basic')).center();
        cancel.events.onInputUp.add(function () {
            location.reload();
        });
    };


    return login;
};