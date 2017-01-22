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
        var attributeInfo = panel.add(new SlickUI.Element.Text(20, 260, '', 18, 'basic', panel.width - 40));

        var attrs = {
            str: 35,
            dex: 35,
            int: 35
        };
        
        function adjustStatSlider(slider, statValue) {
            utils.setSliderValue(slider, 265, 465, (statValue - 10)/50);
        }

        function balanceStatSliders(changed, value) {
            attrs[changed] = value*50 + 10;
            if (attrs[changed] > 60) {
                attrs[changed] = 60;
            }
            if (attrs[changed] < 10) {
                attrs[changed] = 10;
            }
            var stat1, stat2;
            switch (changed) {
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

            var remainder = 105 - (attrs[changed] + attrs[stat1] + attrs[stat2]);
            var adjust1 = remainder;
            var adjust2 = 0;
            attrs[stat1] += adjust1;
            if (attrs[stat1] < 10) {
                adjust2 += attrs[stat1] - 10;
                attrs[stat1] = 10;
            }
            if (attrs[stat1] > 60) {
                adjust2 += attrs[stat1] - 60;
                attrs[stat1] = 60;
            }
            attrs[stat2] += adjust2;

            console.log(value, remainder, adjust1, adjust2);

            attrs.str = Math.floor(attrs.str);
            attrs.dex = Math.floor(attrs.dex);
            attrs.int = Math.floor(attrs.int);

            adjustStatSlider(strSlider, attrs.str);
            adjustStatSlider(dexSlider, attrs.dex);
            adjustStatSlider(intSlider, attrs.int);

            strText.value = 'Strength: '+attrs.str;
            dexText.value = 'Dexterity: '+attrs.dex;
            intText.value = 'Intelligence: '+attrs.int;
        }

        var strText = panel.add(new SlickUI.Element.Text(40, 140, 'Strength: ', 20, 'basic'));
        var strSlider = panel.add(new SlickUI.Element.Slider(240, 140, 200, 0.5));
        strSlider.onDrag.add(function (value) {
            balanceStatSliders('str', value);
            attributeInfo.value = strDescription;
        });
        var dexText = panel.add(new SlickUI.Element.Text(40, 180, 'Dexterity: ', 20, 'basic'));
        var dexSlider = panel.add(new SlickUI.Element.Slider(240, 180, 200, 0.5));
        dexSlider.onDrag.add(function (value) {
            balanceStatSliders('dex', value);
            attributeInfo.value = dexDescription;
        });
        var intText = panel.add(new SlickUI.Element.Text(40, 220, 'Intelligence: ', 20, 'basic'));
        var intSlider = panel.add(new SlickUI.Element.Slider(240, 220, 200, 0.5));
        intSlider.onDrag.add(function (value) {
            balanceStatSliders('int', value);
            attributeInfo.value = intDescription;
        });

        var cont = panel.add(new SlickUI.Element.Button(panel.width - 140, panel.height - 40, 140, 40));
        cont.add(new SlickUI.Element.Text(0,0, "Continue", 24, 'basic')).center();
        cont.events.onInputUp.add(function () {
            this.attrs = attrs;
            utils.deleteSlickUIElement(panel);
            login._displaySkillsMenu();
        });

        var cancel = panel.add(new SlickUI.Element.Button(0, panel.height - 40, 140, 40));
        cancel.add(new SlickUI.Element.Text(0,0, "Cancel", 24, 'basic')).center();
        cancel.events.onInputUp.add(function () {
            location.reload();
        });
    };



    login._displaySkillsMenu = function () {
        function classSkills () {
            switch (this.selectedClass) {
                case 'Warrior':
                    return [
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
                    ];
                    break;
                case 'Rogue':
                    return [
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
                    ];
                    break;
                case 'Sorcerer':
                    return [
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
                    ];
                    break;
                default:
                    throw new Error('what?? no selected class? '+this.selectedClass);
            }
        }
        function removeSkill(skillList, skillName) {
            console.log('removing', skillName, skillList);
            for (var i = 0; i < skillList.length; i++) {
                if (skillList[i] === skillName) {
                    skillList.splice(i, 1);
                    return
                }
            }
            throw new Error(skillName+ ' skill not found??');
        }
        function checkboxCallback(cb, skill) {
            return function () {
                if (cb.checked) {
                    if (selectedSkills.length == 3) {
                        cb.checked = false;
                    } else {
                        selectedSkills.push(skill);
                    }
                } else {
                    removeSkill(selectedSkills, skill);
                }
                console.log(cb.checked ? 'Checked' : 'Unchecked', selectedSkills);
            };
        }
        var panel = this.slickUI.add(new SlickUI.Element.Panel(20, 20, game.width - 40, game.height - 40));
        panel.add(new SlickUI.Element.Text(0, 0, 'Create a New Character', 36, 'title')).centerHorizontally();
        panel.add(new SlickUI.Element.Text(40, 60, 'Select 3 Starting Skills:', 24, 'basic'));
        var skills = classSkills();
        var columns = 3;

        var selectedSkills = [];
        for (var i = 0; i < skills.length; i++) {
            var skill = skills[i];
            var col = i % columns,
                row = Math.floor(i / columns);
            panel.add(new SlickUI.Element.Text(col * 240 + 60, row * 40 + 120, skill, 20, 'basic'));
            var cb = panel.add(new SlickUI.Element.Checkbox(col * 240 + 20, row * 40 + 110, SlickUI.Element.Checkbox.TYPE_CHECKBOX));
            cb.events.onInputUp.add(checkboxCallback(cb, skill), this);
        }
    };

    return login;
};