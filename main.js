gameEngine.onInit = onInit;
gameEngine.onTick = onTick;

// Global game state
Transitions = {
    fadeIn: "fadeIn",
    showing: "showing",
    fadeOut: "fadeOut"
}

GameStates = {
    menu: "menu",
}

game = {
    menu: null,
    state: GameStates.menu,
    nextState: null,
    currentTransition: Transitions.fadeIn,
    fadingLayer: null
};

function onInit(stage, assets) {
    var wepList = readEncodedFile(assets.getResult("wep", true));
    var itemList = readEncodedFile(assets.getResult("item", true));
    var typeList = readEncodedTypeFile(assets.getResult("type", true));
    var configList = readConfigFile(assets.getResult("config", false));

    game.menu = createMenu(onSelectMainMenuItem, assets);
    stage.addChild(game.menu.container);

    // FadingLayer is just a black layer put on top of the stage content. The alpha channel then controls the fading in/out.
    game.fadingLayer = new createjs.Shape();
    game.fadingLayer.graphics.beginFill(Colors.BLACK).drawRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT).endFill();
    game.fadingLayer.cache(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    stage.addChild(game.fadingLayer);
}

function onTick(stage, deltaInSeconds) {
    var fadingDuration = 0.4;
    switch(game.currentTransition) {
        case Transitions.showing:
            switch(game.state) {
                case GameStates.menu:
                    game.menu.onTick(stage, deltaInSeconds);
                    break;
            }
            break;
        case Transitions.fadeIn:
            var decrement = deltaInSeconds / fadingDuration; 
            if (game.fadingLayer.alpha - decrement > 0) {
                game.fadingLayer.alpha -= decrement;
            }
            else {
                game.fadingLayer.alpha = 0;
                game.currentTransition = Transitions.showing;
            }
            break;
        case Transitions.fadeOut:
            var increment = deltaInSeconds / fadingDuration; 
            if (game.fadingLayer.alpha + increment < 1) {
                game.fadingLayer.alpha += increment;
            }
            else {
                game.fadingLayer.alpha = 1;
                game.currentTransition = Transitions.fadeIn;
                if (game.nextState !== null) {
                    game.state = game.nextState;
                    game.nextState = null;
                }
            }
            break;
    }
}

function onSelectMainMenuItem(menuItemIndex) {
    game.currentTransition = Transitions.fadeOut;
    // TODO: set game.nextState based on selected item
}