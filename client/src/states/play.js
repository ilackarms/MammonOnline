module.exports = function (game, socket) {
    var play = {};

    var updateQueue = [];

    var enums = require('../enums/enums');
    var maps = require('../map/map');
    var utils = require('../utils/utils');

    play.init = function (gameData) {
        // console.log(gameData);
        play.gameData = gameData;
    };

    play.preload = function () {
        console.log("game data:", play.gameData);
        play.playerUid = play.gameData.player_uid;
        var world = JSON.stringify(play.gameData.world);
        play.Mammon = Mammon.New(game, world, play.playerUid);
        play.Mammon.Preload();
    };

    play.create = function () {
        play.Mammon.Create();
        // console.log('playing game');
        // play.map.draw(0, 0);
        // play.animator = playerAnimator(play.player.class);
        // updateQueue.push(function () {
        //     play.animator.playAnimation(play.player.armor, play.player.weapon, 'idle', 's', 30);
        // });
    };

    play.update = function () {
        play.Mammon.Update(game.time.elapsed);

    };

    function playerAnimator(playerClass) {
        var armors = ['light', 'medium', 'heavy'],
            weapons = ['axe', 'mace', 'staff', 'sword', 'weaponless'],
            actions = [
                {name:'idle', loop: true},
                {name:'attack', loop: true},
                {name:'die', loop: false},
                {name:'cast_spell', loop: true},
                {name:'walk', loop: true},
                {name:'get_hit', loop: false}
            ],
            directions = ['s', 'sw', 'w', 'nw', 'n', 'ne', 'e', 'se'];

        var className = '';

        switch(playerClass){
            case enums.CLASSES.WARRIOR:
                weapons.push('shield');
                weapons.push('mace_shield');
                weapons.push('sword_shield');
                className = 'warrior';
                break;
            case enums.CLASSES.ROGUE:
                weapons.push('bow');
                className = 'rogue';
                break;
            case enums.CLASSES.SORCERER:
                className = 'sorcerer';
                break;
        }

        var player = {};
        for (var i = 0; i < armors.length; i++) {
            var armor = armors[i];
            player[armor] = {};
            for (var j = 0; j < weapons.length; j++) {
                var weapon = weapons[j];
                var atlasName = className+'_'+armor+'_'+weapon;
                var frameData = game.cache.getFrameData(atlasName).getFrames();
                var sprite = game.make.sprite(0, 0, atlasName);
                //store sprite, create all animations for it
                for (var k = 0; k < actions.length; k++) {
                    var action = actions[k];
                    for (var l = 0; l < directions.length; l++) {
                        var direction = directions[l];
                        var frames = utils.findAnimations(frameData, action.name+'.'+direction);
                        sprite.animations.add(action.name+'.'+direction, frames, 30, action.loop);
                    }
                }
                player[armor][weapon] = sprite;
            }
        }
        player.playAnimation = function (armor, weapon, action, direction, frameRate) {
            var sprite = this[armor][weapon];
            game.add.sprite(game.camera.centerX, game.camera.centerY);
            sprite.play(action+'.'+direction, frameRate);
        };
        return player;
    }

    function enemyAnimator(enemyName) {
        var actions = [
                {name: 'idle', loop: true},
                {name: 'attack', loop: true},
                {name: 'die', loop: false},
                {name: 'special', loop: true},
                {name: 'walk', loop: true},
                {name: 'get_hit', loop: true}
            ],
            directions = ['s', 'sw', 'w', 'nw', 'n', 'ne', 'e', 'se'];

        var atlasName = enemyName;
        var frameData = game.cache.getFrameData(atlasName).getFrames();
        var sprite = game.make.sprite(0, 0, atlasName);
        //store sprite, create all animations for it
        for (var k = 0; k < actions.length; k++) {
            var action = actions[k];
            for (var l = 0; l < directions.length; l++) {
                var direction = directions[l];
                var frames = utils.findAnimations(frameData, action.name + '.' + direction);
                if (frames.length > 0) {
                    sprite.animations.add(action.name + '.' + direction, frames, 30, action.loop);
                }
            }
        }
        var enemy = {};
        enemy.sprite = sprite;
        enemy.playAnimation = function (armor, weapon, action, direction, frameRate) {
            var sprite = this[armor][weapon];
            sprite.play(action+'.'+direction, frameRate);
        };
        return enemy;
    }

    return play;
};
