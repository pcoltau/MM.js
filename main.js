gameEngine.onInit = onInit;
gameEngine.onTick = onTick;
gameEngine.onKeyDown = onKeyDown;
gameEngine.onKeyUp = onKeyUp;
gameEngine.onKeyPress = onKeyPress;

Transitions = {
    fadeIn: "fadeIn",
    showing: "showing",
    fadeOut: "fadeOut"
}

game = {
    menuObj: null,
    aboutObj: null,
    currentState: null, // This is expected to be an object on the form (* are optional): { container, onTick*, onKeyDown*, onKeyUp*, onKeyPress* } 
    nextState: null,
    currentTransition: Transitions.fadeIn,
    fadingLayer: null
};

function onInit(stage, assets) {
    var wepList = readEncodedFile(assets.getResult("wep", true));
    var itemList = readEncodedFile(assets.getResult("item", true));
    var typeList = readEncodedTypeFile(assets.getResult("type", true));
    var configList = readConfigFile(assets.getResult("config", false));

    game.menuObj = createMenu(onSelectMainMenuItem, assets);
    game.aboutObj = createAbout(onExitAbout, assets);

    game.currentState = game.menuObj;
    stage.addChild(game.menuObj.container);

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
            if (game.currentState.onTick) {
                game.currentState.onTick(stage, deltaInSeconds);
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
                    game.currentState = game.nextState;
                    game.nextState = null;
                }
            }
            break;
    }
}

function onKeyDown(stage, key) {
    if (game.currentState.onKeyDown) {
        game.currentState.onKeyDown(stage, key);
    }
}

function onKeyUp(stage, key) {
    if (game.currentState.onKeyUp) {
        game.currentState.onKeyUp(stage, key);
    }
}

function onKeyPress(stage, key) {
    if (game.currentState.onKeyPress) {
        game.currentState.onKeyPress(stage, key);
    }
}

function onSelectMainMenuItem(stage, menuItemIndex) {
    switch (menuItemIndex) {
        case 0: // Start Game
            game.currentTransition = Transitions.fadeOut;
            // TODO: set game.nextState based on selected item
            break;
        case 1: // Options
            game.currentTransition = Transitions.fadeOut;
            // TODO: set game.nextState based on selected item
            break;
        case 2: // About
            game.currentState = game.aboutObj;
            stage.addChild(game.aboutObj.container);   
            break;
        case 3: // Exit
            game.currentTransition = Transitions.fadeOut;
            // TODO: Figure out what to do when exiting
            break;
    }
}

function onExitAbout(stage) {
    stage.removeChild(game.aboutObj.container);
    game.currentState = game.menuObj;
}