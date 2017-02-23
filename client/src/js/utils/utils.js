module.exports = function () {
    var utils = {};

    //hide/unhide SlickUI Element, recursing over all children
    utils.setSlickUIElementVisible = function(element, visible){
        console.log(element, element.container.children);
        var elementType;
        if (element instanceof SlickUI.Element.Text) {
            // elementType = SlickUI.Element.Text;
            element.text.visible = visible;
            return;
        } else if (element instanceof SlickUI.Element.Slider) {
            elementType = SlickUI.Element.Slider;
            element.sprite_handle.visible = visible;
        } else if (element instanceof SlickUI.Element.Checkbox) {
            elementType = SlickUI.Element.Checkbox;
            element._spriteOff.visible = visible;
            element._spriteOn.visible = visible;
            element.sprite.visible = visible;
            return;
        } else if (element instanceof SlickUI.Element.Button) {
            elementType = SlickUI.Element.Checkbox;
            element.sprite.visible = visible;
            element.spriteOff.visible = visible;
            element.spriteOn.visible = visible;
        } else if (element instanceof SlickUI.Element.DisplayObject) {
            elementType = SlickUI.Element.DisplayObject;
            element.displayObject.visible = visible;
            element.sprite.visible = visible;
        } else if (element instanceof SlickUI.Element.Panel) {
            elementType = SlickUI.Element.Panel;
            element._sprite.visible = visible;
        } else {
            // throw new Error("unknown element type "+element.toString());
            return;
        }
        for (var i = 0; i < element.container.children.length; i++) {
            if (element.container.children[i] === element ||
                element.container.children[i] instanceof elementType) {
                continue;
            }
            this.setSlickUIElementVisible(element.container.children[i], visible);
        }
    };

    //set SlickUI Slider Value
    //currently only works for horizontal
    utils.setSliderValue = function(slider, startX, endX, value){
        slider.sprite_handle.x = (endX - startX) * value + startX;
    };

    //find animations by regex (in texture atlas/spritesheet)
    utils.findAnimations = function (frames, prefix) {
        var animations = [];
        var regexp = new RegExp(prefix+'.[0-9]+');
        for (var i =0; i < frames.length; i++) {
            var frame = frames[i];
            if (frame.name.match(regexp)) {
                animations.push(frame.name)
            }
        }
        return animations;
    };

    return utils;
};