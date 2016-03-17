gameEngine.onInit = onInit;
gameEngine.onTick = onTick;
gameEngine.onKeyDown = onKeyDown;
gameEngine.onKeyUp = onKeyUp;
gameEngine.onKeyPress = onKeyPress;

Transitions = {
    fadeIn: "fadeIn",
    showing: "showing",
    fadeOut: "fadeOut",
    showDialog: "showDialog",
    hideDialog: "hideDialog"
}

game = {
    menuObj: null, // These objects are expected to be on the form (* are optional): { container, onTick*, onKeyDown*, onKeyUp*, onKeyPress* } 
    aboutObj: null,
    gameSetupObj: null,
    currentState: "menuObj", // A reference to the *Obj variables above (it is a reference so we can recreate the *Obj in a different resolution if needed)
    nextState: null,
    currentTransition: Transitions.fadeIn,
    fadingLayer: null
};

function onInit(stage, assets) {
    var wepList = readEncodedFile(assets.getResult("wep", true));
    var itemList = readEncodedFile(assets.getResult("item", true));
    var typeList = readEncodedTypeFile(assets.getResult("type", true));
    var configList = readConfigFile(assets.getResult("config", false));

    createGameObjects(assets);

    if (game.currentState) {
        var currentObj = game[game.currentState];
        stage.addChild(currentObj.container);
    }

    // FadingLayer is just a black layer put on top of the stage content. The alpha channel then controls the fading in/out.
    game.fadingLayer = new createjs.Shape();
    game.fadingLayer.graphics.beginFill(Colors.BLACK).drawRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT).endFill();
    game.fadingLayer.cache(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    stage.addChild(game.fadingLayer);
}

function createGameObjects(assets) {
    game.menuObj = createMenu(onSelectMainMenuItem, assets);
    game.aboutObj = createAbout(onExitAbout, assets);
    game.gameSetupObj = createGameSetup(onExitGameSetup, assets);
}

function onTick(stage, deltaInSeconds) {
    var fadingDuration = 0.4;
    switch(game.currentTransition) {
        case Transitions.showing:
            if (game.currentState) {
                var currentObj = game[game.currentState];
                if (currentObj.onTick) {
                    currentObj.onTick(stage, deltaInSeconds);
                }
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
                changeToNextState(stage)
                game.currentTransition = Transitions.fadeIn;
            }
            break;
        case Transitions.showDialog:
        case Transitions.hideDialog:
            changeToNextState(stage)
            game.currentTransition = Transitions.showing;
            break;
    }
}

function changeToNextState(stage) {
    if (game.nextState) {
        // remove the current container, unless we are showing a dialog
        if (game.currentTransition !== Transitions.showDialog) {
            var currentObj = game[game.currentState];
            stage.removeChild(currentObj.container);
        }
        // add the new container, unless we are hiding a dialog
        if (game.currentTransition !== Transitions.hideDialog) {
            var nextObj = game[game.nextState];
            var lastIndex = stage.numChildren - 1;
            stage.addChildAt(nextObj.container, lastIndex); // adds the container "under" the fadingLayer 
        }
        game.currentState = game.nextState;
        game.nextState = null;
    }
}

function onKeyDown(stage, key) {
    if (game.currentState) {
        var currentObj = game[game.currentState];
        if (currentObj.onKeyDown) {
            currentObj.onKeyDown(stage, key);
        }
    }
}

function onKeyUp(stage, key) {
    if (game.currentState) {
        var currentObj = game[game.currentState];
        if (currentObj.onKeyUp) {
            currentObj.onKeyUp(stage, key);
        }
    }
}

function onKeyPress(stage, key) {
    if (game.currentState) {
        var currentObj = game[game.currentState];
        if (currentObj.onKeyPress) {
            currentObj.onKeyPress(stage, key);
        }
    }
}

function onSelectMainMenuItem(menuItemIndex) {
    switch (menuItemIndex) {
        case 0: // Start Game
            game.currentTransition = Transitions.fadeOut;
            game.nextState = "gameSetupObj";
            break;
        case 1: // Options
            game.currentTransition = Transitions.fadeOut;
            // TODO: set game.nextState based on selected item
            break;
        case 2: // About
            game.currentTransition = Transitions.showDialog;
            game.nextState = "aboutObj";
            break;
        case 3: // Exit
            game.currentTransition = Transitions.fadeOut;
            // TODO: Figure out what to do when exiting
            break;
    }
}

function onExitAbout() {
    game.currentTransition = Transitions.hideDialog;
    game.nextState = "menuObj";
}

function onExitGameSetup() {
    game.currentTransition = Transitions.fadeOut;
    game.nextState = "menuObj";
}