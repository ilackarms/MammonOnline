module.exports = function () {
    var utils = {};

    //delete SlickUI Element, recursing over all children
    utils.deleteSlickUIElement = function(element){
        if (element instanceof SlickUI.Element.Text) {
            element.text.destroy();
            return; //for some reason text contains itself as a child forever??
        } else if (element instanceof SlickUI.Element.Button) {
            element.sprite.destroy();
            element.spriteOff.destroy();
            element.spriteOn.destroy();
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

    return utils;
};