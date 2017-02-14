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
            socket.emit(enums.EVENTS.SERVER_EVENTS.LOGIN_REQUEST,
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
        socket.on(enums.EVENTS.CLIENT_EVENTS.LOGIN_RESPONSE, function (data) {
            var response = JSON.parse(data);
            if (!response) {
                return;
            }
            console.log(data, response);
            if (response.code) {
                errTxt.value = response.msg;
            } else {
                utils.setSlickUIElementVisible(panel, false);
                username.destroy();
                password.destroy();
                login._displayCharacterSelectMenu(response.character_names);
            }
        });
    };

    var characterSelectPanel,
        classSelectPanel,
        attrsSelectPanel,
        skillSelectPanel,
        skillSliderPanel,
        portraitPanel,
        confirmationPanel;

    var newCharacter = {};
    var playSlot = {};

    login._displayCharacterSelectMenu = function (character_names) {
        characterSelectPanel = this.slickUI.add(new SlickUI.Element.Panel(80, 80, game.width - 160, game.height - 160));
        console.log(characterSelectPanel.width-1);
        characterSelectPanel.add(new SlickUI.Element.Text(0, 0, 'Character Select', 36, 'title')).centerHorizontally();
        for (var i = 0; i < 3; i++) {
            var char = characterSelectPanel.add(new SlickUI.Element.Button(characterSelectPanel.width/2 - 70, characterSelectPanel.height/2 - 80 + i * 60, 140, 40));
            if (character_names[i]) {
                char.add(new SlickUI.Element.Text(0, 0, character_names[i], 20, 'basic')).center();
                char.events.onInputUp.add(function (i) {
                    return function () {
                        utils.setSlickUIElementVisible(characterSelectPanel, false);
                        //choose character slot
                        playSlot = i;
                        login._displayPlayAsMenu(character_names[i]);
                    };
                }(i));
            } else {
                char.add(new SlickUI.Element.Text(0, 0, 'NEW', 20, 'basic')).center();
                char.events.onInputUp.add(function (i) {
                    return function () {
                        utils.setSlickUIElementVisible(characterSelectPanel, false);
                        //choose character slot
                        newCharacter.slot = i;
                        login._displayNewCharacterMenu();
                    };
                }(i));
            }
        }

        var cancel = characterSelectPanel.add(new SlickUI.Element.Button(0, characterSelectPanel.height - 40, 140, 40));
        cancel.add(new SlickUI.Element.Text(0,0, "Cancel", 24, 'basic')).center();
        cancel.events.onInputUp.add(function () {
            location.reload();
        });
    };

    login._displayPlayAsMenu = function (name) {
        var panel = this.slickUI.add(new SlickUI.Element.Panel(20, 20, game.width - 40, game.height - 40));

        panel.add(new SlickUI.Element.Text(0, 0, 'Log in as '+name+"?", 24, 'basic')).center();
        var errTxt = panel.add(new SlickUI.Element.Text(0, 0, '', 24, 'basic')).center();

        var confirm = panel.add(new SlickUI.Element.Button(panel.width - 140, panel.height - 40, 140, 40));
        confirm.add(new SlickUI.Element.Text(0,0, "Play", 24, 'basic')).center();
        confirm.events.onInputUp.add(function () {
            socket.emit(enums.EVENTS.SERVER_EVENTS.PLAY_CHARACTER_REQUEST, JSON.stringify({slot: playSlot}));
        });

        var deleteButton = panel.add(new SlickUI.Element.Button(panel.width/2-70, panel.height - 40, 140, 40));
        deleteButton.add(new SlickUI.Element.Text(0,0, "Delete", 24, 'basic')).center();
        deleteButton.events.onInputUp.add(function () {
            if  (window.confirm("Are you sure you wish to delete "+name+"?")){
                socket.emit(enums.EVENTS.SERVER_EVENTS.DELETE_CHARACTER_REQUEST, JSON.stringify({slot: playSlot}));
                location.reload();
            }
        });

        socket.on(enums.EVENTS.CLIENT_EVENTS.PLAY_CHARACTER_RESPONSE, function (data) {
            // console.log('play char resposne:', data);
            var response = JSON.parse(data);
            if (!response) {
                return;
            }
            // console.log(data, response);
            if (response.code) {
                errTxt.value = response.msg;
            } else {
                game.state.start('play', true, null, response);
            }
        });

        var back = panel.add(new SlickUI.Element.Button(0, panel.height - 40, 140, 40));
        back.add(new SlickUI.Element.Text(0,0, "Back", 24, 'basic')).center();
        back.events.onInputUp.add(function () {
            utils.setSlickUIElementVisible(panel, false);
            utils.setSlickUIElementVisible(characterSelectPanel, true);
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


        classSelectPanel = this.slickUI.add(new SlickUI.Element.Panel(20, 20, game.width - 40, game.height - 40));
        classSelectPanel.add(new SlickUI.Element.Text(0, 0, 'Create a New Character', 36, 'title')).centerHorizontally();
        var selectedClassText = classSelectPanel.add(new SlickUI.Element.Text(40, 60, 'Select Class:', 24, 'basic'));
        var classInfo = classSelectPanel.add(new SlickUI.Element.Text(20, 240, '', 18, 'basic', classSelectPanel.width - 40));

        //rogue
        var rogueIcon = game.add.sprite(0, 0, 'rogue_icon');
        var rogueButton = classSelectPanel.add(new SlickUI.Element.Button(80, 100, rogueIcon.width+10, rogueIcon.height+20));
        rogueButton.add(new SlickUI.Element.DisplayObject(0, 0, rogueIcon));
        rogueButton.add(new SlickUI.Element.Text(0, rogueButton.height - 16, 'Rogue', 14, 'basic')).centerHorizontally();
        rogueButton.events.onInputUp.add(function () {
            classInfo.value = rogueDescription;
            selectedClassText.value = 'Selected: Rogue';
            newCharacter.selectedClass = 'Rogue';
        });

        //warrior
        var warriorIcon = game.add.sprite(0, 0, 'warrior_icon');
        var warriorButton = classSelectPanel.add(new SlickUI.Element.Button(280, 100, warriorIcon.width+10, warriorIcon.height+20));
        warriorButton.add(new SlickUI.Element.DisplayObject(0, 0, warriorIcon));
        warriorButton.add(new SlickUI.Element.Text(0, warriorButton.height - 16, 'Warrior', 14, 'basic')).centerHorizontally();
        warriorButton.events.onInputUp.add(function () {
            classInfo.value = warriorDescription;
            selectedClassText.value = 'Selected: Warrior';
            newCharacter.selectedClass = 'Warrior';
        });

        //sorcerer
        var sorcererIcon = game.add.sprite(0, 0, 'sorcerer_icon');
        var sorcererButton = classSelectPanel.add(new SlickUI.Element.Button(480, 100, sorcererIcon.width+10, sorcererIcon.height+20));
        sorcererButton.add(new SlickUI.Element.DisplayObject(0, 0, sorcererIcon));
        sorcererButton.add(new SlickUI.Element.Text(0, sorcererButton.height - 16, 'Sorcerer', 14, 'basic')).centerHorizontally();
        sorcererButton.events.onInputUp.add(function () {
            classInfo.value = sorcererDescription;
            selectedClassText.value = 'Selected: Sorcerer';
            newCharacter.selectedClass = 'Sorcerer';
        });

        var cont = classSelectPanel.add(new SlickUI.Element.Button(classSelectPanel.width - 140, classSelectPanel.height - 40, 140, 40));
        cont.add(new SlickUI.Element.Text(0,0, "Continue", 24, 'basic')).center();
        cont.events.onInputUp.add(function () {
            if (newCharacter.selectedClass) {
                utils.setSlickUIElementVisible(classSelectPanel, false);
                login._displayStatsMenu();
            }
        });

        var back = classSelectPanel.add(new SlickUI.Element.Button(0, classSelectPanel.height - 40, 140, 40));
        back.add(new SlickUI.Element.Text(0,0, "Back", 24, 'basic')).center();
        back.events.onInputUp.add(function () {
            utils.setSlickUIElementVisible(classSelectPanel, false);
            utils.setSlickUIElementVisible(characterSelectPanel, true);
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
        attrsSelectPanel = this.slickUI.add(new SlickUI.Element.Panel(20, 20, game.width - 40, game.height - 40));
        attrsSelectPanel.add(new SlickUI.Element.Text(0, 0, 'Create a New Character', 36, 'title')).centerHorizontally();
        attrsSelectPanel.add(new SlickUI.Element.Text(40, 60, 'Select Starting Attributes:', 24, 'basic'));
        var attributeInfo = attrsSelectPanel.add(new SlickUI.Element.Text(20, 260, '', 18, 'basic', attrsSelectPanel.width - 40));

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

        var strText = attrsSelectPanel.add(new SlickUI.Element.Text(40, 140, 'Strength: 35', 20, 'basic'));
        var strSlider = attrsSelectPanel.add(new SlickUI.Element.Slider(240, 140, 200, 0.5));
        strSlider.onDrag.add(function (value) {
            balanceStatSliders('str', value);
            attributeInfo.value = strDescription;
        });
        var dexText = attrsSelectPanel.add(new SlickUI.Element.Text(40, 180, 'Dexterity: 35', 20, 'basic'));
        var dexSlider = attrsSelectPanel.add(new SlickUI.Element.Slider(240, 180, 200, 0.5));
        dexSlider.onDrag.add(function (value) {
            balanceStatSliders('dex', value);
            attributeInfo.value = dexDescription;
        });
        var intText = attrsSelectPanel.add(new SlickUI.Element.Text(40, 220, 'Intelligence: 35', 20, 'basic'));
        var intSlider = attrsSelectPanel.add(new SlickUI.Element.Slider(240, 220, 200, 0.5));
        intSlider.onDrag.add(function (value) {
            balanceStatSliders('int', value);
            attributeInfo.value = intDescription;
        });

        var cont = attrsSelectPanel.add(new SlickUI.Element.Button(attrsSelectPanel.width - 140, attrsSelectPanel.height - 40, 140, 40));
        cont.add(new SlickUI.Element.Text(0,0, "Continue", 24, 'basic')).center();
        cont.events.onInputUp.add(function () {
            newCharacter.attrs = attrs;
            utils.setSlickUIElementVisible(attrsSelectPanel, false);
            login._displaySkillsMenu();
        });

        var back = attrsSelectPanel.add(new SlickUI.Element.Button(0, attrsSelectPanel.height - 40, 140, 40));
        back.add(new SlickUI.Element.Text(0,0, "Back", 24, 'basic')).center();
        back.events.onInputUp.add(function () {
            utils.setSlickUIElementVisible(attrsSelectPanel, false);
            utils.setSlickUIElementVisible(classSelectPanel, true);
        });
    };

    var skillDescriptions = {
        "Alchemy":'Alchemy is used to craft magical potions.',
        "Archery":'Archery determines damage and chance to hit with bows.',
        "Athletics":'Athletics affects movement speed.',
        "Barter":'Barter affects favorability of buying and selling prices when trading with NPCs',
        "Blacksmithy":'Blacksmithy is used to craft weapons, armor, and other items from metal ore.',
        "Carpentry":'Carpentry is used to craft weapons, armor, and other items from wood.',
        "Concentration":'Concentration prevents interruption of spell casting and other skill use (such as healing) during combat.',
        "Detecting Hidden":'Detecting hidden is used to detect hidden creatures, charcters, and objects.',
        "Evasion":'Evasion improves a character\'s ability to evade attacks.',
        "Healing":'Healing is a non-magical means of restoring character health via applying bandages.',
        "Herbalism":'Herbalism is used to collect alchemical ingredients.',
        "Hiding":'Hiding is a non-magical means of disappearing from sight.',
        "Lumberjacking":'Lumberjacking is used to harvest wood from trees. Lumberjacking also increases damage dealt with axes.',
        "Mace Fighting":'Mace Fighting  determines damage and chance to hit with maces, as well as the probability of slowing an opponent with a mace.',
        "Magery":'Magery determines the ability to cast spells and their power.',
        "Magic Penetration":'Magic Penetration is used to penetrate a target\'s magic resistance when calculating damage, or determining whether a spell is effective.',
        "Magic Resistance":'Magic Resistance is used to diminish the damage dealt by spells to the character, or negate the effects of negative spells',
        "Meditation":'Meditation is used to quickly regenerate mana spent casting spells.',
        "Mining":'Mining is used to harvest metal ores in caves.',
        "Parrying":'Parrying is used (only by fighters) to increase the chancec to deflect attacks with a shield.',
        "Snooping":'Snooping is used to inspect the conetnts of other character\'s backpacks.',
        "Stealing":'Stealing is used to steal items from other character\'s backpacks.',
        "Stealth":'Stealth is used to move while hidden, without revealing oneself.',
        "Swordsmanship":'Swordsmanship determines damage and chance to hit with swords and axes, as well as the probability of inflicting a bleed an opponent with a sword or axe.',
        "Tactics":'Tactics increases damage dealt with all weapons in combat.',
        "Unarmed Fighting":'Unarmed Fighting determines damage and chance to hit while unarmed, as well as the probability of stunning an opponent with an unarmed attack.'
    };

    login._displaySkillsMenu = function () {
        function classSkills () {
            switch (newCharacter.selectedClass) {
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
                    throw new Error('what?? no selected class? '+newCharacter.selectedClass);
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
                skillInfoText.value = skillDescriptions[skill];
            };
        }
        skillSelectPanel = this.slickUI.add(new SlickUI.Element.Panel(20, 20, game.width - 40, game.height - 40));
        skillSelectPanel.add(new SlickUI.Element.Text(0, 0, 'Create a New Character', 36, 'title')).centerHorizontally();
        skillSelectPanel.add(new SlickUI.Element.Text(40, 60, 'Select 3 Starting Skills:', 24, 'basic'));
        var skillInfoText = skillSelectPanel.add(new SlickUI.Element.Text(40, 320, '', 20, 'basic'));
        var skills = classSkills();
        var columns = 3;

        var selectedSkills = [];
        for (var i = 0; i < skills.length; i++) {
            var skill = skills[i];
            var col = i % columns,
                row = Math.floor(i / columns);
            skillSelectPanel.add(new SlickUI.Element.Text(col * 240 + 60, row * 40 + 120, skill, 20, 'basic'));
            var cb = skillSelectPanel.add(new SlickUI.Element.Checkbox(col * 240 + 20, row * 40 + 110, SlickUI.Element.Checkbox.TYPE_CHECKBOX));
            cb.events.onInputUp.add(checkboxCallback(cb, skill), this);
        }

        var cont = skillSelectPanel.add(new SlickUI.Element.Button(skillSelectPanel.width - 140, skillSelectPanel.height - 40, 140, 40));
        cont.add(new SlickUI.Element.Text(0,0, "Continue", 24, 'basic')).center();
        cont.events.onInputUp.add(function () {
            if (selectedSkills.length === 3) {
                utils.setSlickUIElementVisible(skillSelectPanel, false);
                login._displaySkillSlidersMenu(selectedSkills);
            }
        });

        var back = skillSelectPanel.add(new SlickUI.Element.Button(0, skillSelectPanel.height - 40, 140, 40));
        back.add(new SlickUI.Element.Text(0,0, "Back", 24, 'basic')).center();
        back.events.onInputUp.add(function () {
            utils.setSlickUIElementVisible(skillSelectPanel, false);
            utils.setSlickUIElementVisible(skill, true);
        });
    };

    login._displaySkillSlidersMenu = function (selectedSkills) {
        skillSliderPanel = this.slickUI.add(new SlickUI.Element.Panel(20, 20, game.width - 40, game.height - 40));
        skillSliderPanel.add(new SlickUI.Element.Text(0, 0, 'Create a New Character', 36, 'title')).centerHorizontally();
        skillSliderPanel.add(new SlickUI.Element.Text(40, 60, 'Set Starting Skills:', 24, 'basic'));
        var skillInfo = skillSliderPanel.add(new SlickUI.Element.Text(20, 260, '', 18, 'basic', skillSliderPanel.width - 40));

        var skills = {};
        skills[selectedSkills[0]] = 34;
        skills[selectedSkills[1]] = 33;
        skills[selectedSkills[2]] = 33;

        function adjustSkillSlider(slider, statValue) {
            utils.setSliderValue(slider, 325, 505, statValue/50);
        }

        function balanceStatSliders(changed, value) {
            skills[changed] = value*50;
            if (skills[changed] > 50) {
                skills[changed] = 50;
            }
            if (skills[changed] < 0) {
                skills[changed] = 0;
            }
            var skill1, skill2;
            switch (changed) {
                case selectedSkills[0]:
                    skill1 = selectedSkills[1];
                    skill2 = selectedSkills[2];
                    break;
                case selectedSkills[1]:
                    skill1 = selectedSkills[2];
                    skill2 = selectedSkills[0];
                    break;
                case selectedSkills[2]:
                    skill1 = selectedSkills[0];
                    skill2 = selectedSkills[1];
                    break;
            }

            var remainder = 100 - (skills[changed] + skills[skill1] + skills[skill2]);
            var adjust1 = remainder;
            var adjust2 = 0;
            skills[skill1] += adjust1;
            if (skills[skill1] < 0) {
                adjust2 += skills[skill1] - 0;
                skills[skill1] = 0;
            }
            if (skills[skill1] > 50) {
                adjust2 += skills[skill1] - 50;
                skills[skill1] = 50;
            }
            skills[skill2] += adjust2;

            console.log(value, remainder, adjust1, adjust2);

            skills[selectedSkills[0]] = Math.floor(skills[selectedSkills[0]]);
            skills[selectedSkills[1]] = Math.floor(skills[selectedSkills[1]]);
            skills[selectedSkills[2]] = Math.floor(skills[selectedSkills[2]]);

            adjustSkillSlider(skill0Slider, skills[selectedSkills[0]]);
            adjustSkillSlider(skill1Slider, skills[selectedSkills[1]]);
            adjustSkillSlider(skill2Slider, skills[selectedSkills[2]]);

            skill0Text.value = selectedSkills[0]+': '+skills[selectedSkills[0]]+'.0';
            skill1Text.value = selectedSkills[1]+': '+skills[selectedSkills[1]]+'.0';
            skill2Text.value = selectedSkills[2]+': '+skills[selectedSkills[2]]+'.0';
        }

        var skill0Text = skillSliderPanel.add(new SlickUI.Element.Text(40, 140, selectedSkills[0]+': 34.0', 20, 'basic'));
        var skill0Slider = skillSliderPanel.add(new SlickUI.Element.Slider(280, 140, 200, 0.5));
        skill0Slider.onDrag.add(function (value) {
            balanceStatSliders(selectedSkills[0], value);
            skillInfo.value = skillDescriptions[selectedSkills[0]];
        });
        var skill1Text = skillSliderPanel.add(new SlickUI.Element.Text(40, 180, selectedSkills[1]+': 33.0', 20, 'basic'));
        var skill1Slider = skillSliderPanel.add(new SlickUI.Element.Slider(280, 180, 200, 0.5));
        skill1Slider.onDrag.add(function (value) {
            balanceStatSliders(selectedSkills[1], value);
            skillInfo.value = skillDescriptions[selectedSkills[1]];
        });
        var skill2Text = skillSliderPanel.add(new SlickUI.Element.Text(40, 220, selectedSkills[2]+': 33.0', 20, 'basic'));
        var skill2Slider = skillSliderPanel.add(new SlickUI.Element.Slider(280, 220, 200, 0.5));
        skill2Slider.onDrag.add(function (value) {
            balanceStatSliders(selectedSkills[2], value);
            skillInfo.value = skillDescriptions[selectedSkills[2]];
        });

        var cont = skillSliderPanel.add(new SlickUI.Element.Button(skillSliderPanel.width - 140, skillSliderPanel.height - 40, 140, 40));
        cont.add(new SlickUI.Element.Text(0,0, "Continue", 24, 'basic')).center();
        cont.events.onInputUp.add(function () {
            newCharacter.skills = skills;
            utils.setSlickUIElementVisible(skillSliderPanel, false);
            login._diplayPortraitMenu();
        });

        var back = skillSliderPanel.add(new SlickUI.Element.Button(0, skillSliderPanel.height - 40, 140, 40));
        back.add(new SlickUI.Element.Text(0,0, "Back", 24, 'basic')).center();
        back.events.onInputUp.add(function () {
            utils.setSlickUIElementVisible(skillSliderPanel, false);
            utils.setSlickUIElementVisible(skillSelectPanel, true);
        });
    };

    var portraitImage;
    login._diplayPortraitMenu = function () {
        function setPortraitImage() {
            var imagePrefix;
            switch (newCharacter.selectedClass) {
                case "Rogue":
                    imagePrefix = "Rogue";
                    break;
                case "Warrior":
                    imagePrefix = "War";
                    break;
                case "Sorcerer":
                    imagePrefix = "Sorc";
                    break;
            }
            var portraitKey = imagePrefix+(portraitIndex+1);
            if (portraitImage) {
                portraitImage.destroy();
            }
            portraitImage = game.add.sprite(280, 140, portraitKey);
            newCharacter.portraitKey = portraitKey;
        }

        portraitPanel = this.slickUI.add(new SlickUI.Element.Panel(20, 20, game.width - 40, game.height - 40));
        portraitPanel.add(new SlickUI.Element.Text(0, 0, 'Create a New Character', 36, 'title')).centerHorizontally();
        portraitPanel.add(new SlickUI.Element.Text(40, 60, 'Select Portrait:', 24, 'basic'));
        var portraitIndex = 0;
        setPortraitImage();
        var portraitLeftButton =  portraitPanel.add(new SlickUI.Element.Button(180, 180, 40, 40));
        portraitLeftButton.add(new SlickUI.Element.Text(0,0, "<-", 24, 'basic')).center();
        portraitLeftButton.events.onInputUp.add(function () {
            portraitIndex--;
            if (portraitIndex < 0) {
                portraitIndex = 39;
            }
            setPortraitImage()
        });
        var portraitRightButton =  portraitPanel.add(new SlickUI.Element.Button(400, 180, 40, 40));
        portraitRightButton.add(new SlickUI.Element.Text(0,0, "->", 24, 'basic')).center();
        portraitRightButton.events.onInputUp.add(function () {
            portraitIndex++;
            if (portraitIndex > 39) {
                portraitIndex = 0;
            }
            setPortraitImage()
        });


        portraitPanel.add(new SlickUI.Element.Text(40, 320, 'Name:', 24, 'basic'));
        var characterName = game.add.inputField(portraitPanel._x + 160, portraitPanel._y + 320, {
            font: '18px Arial',
            fill: '#212121',
            fontWeight: 'bold',
            width: 150,
            padding: 8,
            borderWidth: 1,
            borderColor: '#000',
            borderRadius: 6,
            placeHolder: 'Name',
            type: PhaserInput.InputType.text
        });

        var errTxt = portraitPanel.add(new SlickUI.Element.Text(240, portraitPanel.height - 60, '', 18, 'basic'));

        var cont = portraitPanel.add(new SlickUI.Element.Button(portraitPanel.width - 140, portraitPanel.height - 40, 140, 40));
        cont.add(new SlickUI.Element.Text(0,0, "Continue", 24, 'basic')).center();
        cont.events.onInputUp.add(function () {
            newCharacter.characterName = characterName.value;
            if (newCharacter.characterName.length > 4 && newCharacter.characterName.length < 20) {
                utils.setSlickUIElementVisible(portraitPanel, false);
                login._displayConfirmMenu();
                portraitImage.destroy();
            } else {
                errTxt.value = 'Invalid name. Must be between 4 and 20 characters long';
            }
        });

        var back = portraitPanel.add(new SlickUI.Element.Button(0, portraitPanel.height - 40, 140, 40));
        back.add(new SlickUI.Element.Text(0,0, "Back", 24, 'basic')).center();
        back.events.onInputUp.add(function () {
            utils.setSlickUIElementVisible(portraitPanel, false);
            utils.setSlickUIElementVisible(skillSliderPanel, true);
            portraitImage.destroy();
        });
    };

    login._displayConfirmMenu = function () {
        confirmationPanel = this.slickUI.add(new SlickUI.Element.Panel(20, 20, game.width - 40, game.height - 40));

        console.log('character: ',newCharacter);

        confirmationPanel.add(new SlickUI.Element.Text(0, 0, 'Create a New Character', 36, 'title')).centerHorizontally();
        confirmationPanel.add(new SlickUI.Element.Text(40, 60, 'Character Summary', 24, 'basic'));
        confirmationPanel.add(new SlickUI.Element.Text(40, 100, 'Name: '+newCharacter.characterName, 20, 'basic'));
        confirmationPanel.add(new SlickUI.Element.Text(40, 140, 'Portrait: ', 20, 'basic'));
        var portraitImg = game.add.sprite(170, 160, newCharacter.portraitKey);

        confirmationPanel.add(new SlickUI.Element.Text(400, 100, 'Class: '+newCharacter.selectedClass, 20, 'basic'));

        confirmationPanel.add(new SlickUI.Element.Text(400, 140, 'Strength: '+ newCharacter.attrs.str, 20, 'basic'));
        confirmationPanel.add(new SlickUI.Element.Text(400, 180, 'Dexterity: '+ newCharacter.attrs.dex, 20, 'basic'));
        confirmationPanel.add(new SlickUI.Element.Text(400, 220, 'Intelligence: '+ newCharacter.attrs.int, 20, 'basic'));

        var count = 0;
        for (var key in newCharacter.skills) {
            if (!newCharacter.skills.hasOwnProperty(key)) {
                continue;
            }
                confirmationPanel.add(new SlickUI.Element.Text(400, 260 + count * 40, key+': '+newCharacter.skills[key]+".0", 20, 'basic'));
            count++;
        }

        var errTxt = confirmationPanel.add(new SlickUI.Element.Text(240, confirmationPanel.height - 60, '', 18, 'basic'));

        function characterCreateRequest(attrs, skills, selectedClass, slot, portraitKey, characterName) {
            var enumSkills = {};
            for (var k in skills) {
                if (!skills.hasOwnProperty(k)) continue;
                var enumKey = enums.SKILLS[k.replace(' ', '_').toUpperCase()];
                console.log('skill ', k, ' is ', skills[k], 'enum key', enumKey);
                enumSkills[enumKey] = skills[k];
            }
            var enumClass = enums.CLASSES[selectedClass.replace(' ', '_').toUpperCase()];
            return {
                attributes: attrs,
                skills: enumSkills,
                selectedClass: enumClass,
                slot: slot,
                portraitKey: portraitKey,
                characterName: characterName
            };
        }

        var req = characterCreateRequest(newCharacter.attrs, newCharacter.skills, newCharacter.selectedClass, newCharacter.slot, newCharacter.portraitKey, newCharacter.characterName);


        var confirm = confirmationPanel.add(new SlickUI.Element.Button(confirmationPanel.width - 140, confirmationPanel.height - 40, 140, 40));
        confirm.add(new SlickUI.Element.Text(0,0, "Confirm", 24, 'basic')).center();
        confirm.events.onInputUp.add(function () {
            socket.emit(enums.EVENTS.SERVER_EVENTS.CREATE_CHARACTER_REQUEST, JSON.stringify(req));
        });

        socket.on(enums.EVENTS.CLIENT_EVENTS.CREATE_CHARACTER_RESPONSE, function (data) {
            var response = JSON.parse(data);
            if (!response) {
                return;
            }
            console.log(data, response);
            if (response.code) {
                errTxt.value = response.msg;
            } else {
                utils.setSlickUIElementVisible(confirmationPanel, false);
                portraitImg.destroy();
                game.state.start('play', true, null, response);
            }
        });

        var back = confirmationPanel.add(new SlickUI.Element.Button(0, confirmationPanel.height - 40, 140, 40));
        back.add(new SlickUI.Element.Text(0,0, "Back", 24, 'basic')).center();
        back.events.onInputUp.add(function () {
            utils.setSlickUIElementVisible(confirmationPanel, false);
            utils.setSlickUIElementVisible(portraitPanel, true);
            portraitImg.destroy();
        });
    };

        return login;
    };