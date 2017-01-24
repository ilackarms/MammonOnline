module.exports = function (game, socket, fps) {
    var play = {};

    var enums = require('../enums/enums');
    var maps = require('../map/map');
    var utils = require('../utils/utils');

    play.init = function (gameData) {
        console.log(gameData);
        play.gameData = gameData;
    };

    play.preload = function () {
        play.map = new maps.Map(game, play.gameData.map, false, true);
        play.player = {};
        play.player.class = play.gameData.class;
        play.player.armor = null;
        play.player.weapon = null;
        play.player.animation = 'idle';
    };

    play.create = function () {
        console.log('playing game');
        play.map.draw(0, 0);
    };

    function initPlayerAnimations(playerClass) {
        var armors = ['light', 'medium', 'heavy'],
            weapons = ['axe', 'mace', 'staff', 'sword', 'weaponless'],
            actions = [
                {name:'idle', loop: true},
                {name:'attack', loop: true},
                {name:'die', loop: true},
                {name:'cast_spell', loop: true},
                {name: 'die', loop: true},
                {name:'walk', loop: true},
                {name:'get_hit', loop: true}
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

        var playerSprites = {};
        for (var i = 0; i < armors.length; i++) {
            var armor = armors[i];
            playerSprites[armor] = {};
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
                        sprite.animations.add(action.name+'.'+direction, frames, fps, action.loop);
                    }
                }
                playerSprites[armor][weapon] = sprite;
            }
        }
        playerSprites.playAnimation = function (armor, weapon, action, direction) {
            var sprite = this[armor][weapon];
            sprite.play(action+'.'+direction);
        }
    }

    return play;
};
