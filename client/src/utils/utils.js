module.exports = function () {
    var utils = {};

    //delete SlickUI Element, recursing over all children
    utils.deleteSlickUIElement = function(element){
        console.log(element);
        if (element instanceof SlickUI.Element.Text) {
            element.text.destroy();
            return; //for some reason text contains itself as a child forever??
        } else if (element instanceof SlickUI.Element.Slider) {
            element.sprite_handle.destroy();
            return; //samae thing as text
        } else if (element instanceof SlickUI.Element.Button) {
            element.sprite.destroy();
            element.spriteOff.destroy();
            element.spriteOn.destroy();
        } else if (element instanceof SlickUI.Element.DisplayObject) {
            element.displayObject.destroy();
            element.sprite.destroy();
        }
        else {
            element._sprite.destroy();
        }
        for (var i = 0; i < element.container.children.length; i++) {
            if (element.container.children[i] === element) {
                continue;
            }
            this.deleteSlickUIElement(element.container.children[i]);
        }
    };

    //set SlickUI Slider Value
    //currently only works for horizontal
    utils.setSliderValue = function(slider, startX, endX, value){
        slider.sprite_handle.x = (endX - startX) * value + startX;
    };

    return utils;
};