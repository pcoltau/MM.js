"use strict";

let Transitions = {
    fadeIn: "fadeIn",
    running: "running",
    fadeOut: "fadeOut",
    showDialog: "showDialog",
    hideDialog: "hideDialog",
    preFadeIn: "preFadeIn", // a one-tick transition before fading in (likely after a fadeOut)
    preRunning: "preRunning" // a one-tick transition before running (likely after a showDialog)
}

let game = {
     // These objects are expected to be on the form (* are optional): { container, onTick*, onKeyDown*, onKeyUp*, onKeyPress*, onShow* } 
    menuObj: null,
    aboutObj: null,
    gameSetupObj: null,
    gameObj: null,
    currentState: "menuObj", // A reference to the *Obj letiables above (it is a reference so we can recreate the *Obj in a different resolution if needed)
    nextState: null,
    currentTransition: Transitions.preFadeIn,
    fadingLayer: null
};

gameEngine.onInit = function onInit(stage, assets, context) {
    let wepList = readEncodedFile(assets.getResult("wep", true));
    let itemList = readEncodedFile(assets.getResult("item", true));
    let typeList = readEncodedTypeFile(assets.getResult("type", true));
    let configList = readConfigFile(assets.getResult("config", false));

    createGameObjects(assets);

    if (game.currentState) {
        // <begin> FOR TESTING:
        if (game.currentState === "gameObj") {
            game.gameObj.initGame(["test1", "test2", "test3", "test4"], null);
        }
        // <end> FOR TESTING
        let currentObj = game[game.currentState];
        stage.addChild(currentObj.container);
        if (currentObj.onShow) {
            currentObj.onShow();
        }
    }

    // FadingLayer is just a black layer put on top of the stage content. The alpha channel then controls the fading in/out.
    game.fadingLayer = new createjs.Shape();
    game.fadingLayer.graphics.beginFill("black").drawRect(0, 0, GET_MAX_X, GET_MAX_Y).endFill();
    game.fadingLayer.cache(0, 0, GET_MAX_X, GET_MAX_Y);
    stage.addChild(game.fadingLayer);
    
    function createGameObjects(assets) {
        game.menuObj = createMenu(onSelectMainMenuItem, assets);
        game.aboutObj = createAbout(onExitAbout, assets);
        game.gameSetupObj = createGameSetup(onGameSetupDone, onExitGameSetup, assets);
        game.gameObj = createGame(wepList, onExitGame, assets, context, configList);

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

        function onGameSetupDone(playerNames) {
            game.currentTransition = Transitions.fadeOut;
            game.nextState = "gameObj";
            game.gameObj.initGame(playerNames, game.gameSetupObj.getSettings());
        }

        function onExitGame() {
            game.currentTransition = Transitions.fadeOut;
            game.nextState = "menuObj";
        }
    }
}

gameEngine.onTick = function onTick(stage, deltaInSeconds) {
    let fadingDuration = 0.4;
    switch(game.currentTransition) {
        case Transitions.running:
            if (game.currentState) {
                let currentObj = game[game.currentState];
                if (currentObj.onTick) {
                    currentObj.onTick(stage, deltaInSeconds);
                }
            }
            break;
        case Transitions.fadeIn:
            let decrement = deltaInSeconds / fadingDuration; 
            if (game.fadingLayer.alpha - decrement > 0) {
                game.fadingLayer.alpha -= decrement;
            }
            else {
                game.fadingLayer.alpha = 0;
                game.currentTransition = Transitions.running;
            }
            break;
        case Transitions.fadeOut:
            let increment = deltaInSeconds / fadingDuration; 
            if (game.fadingLayer.alpha + increment < 1) {
                game.fadingLayer.alpha += increment;
            }
            else {
                game.fadingLayer.alpha = 1;
                if (changeToNextState(stage)) {
                    game.currentTransition = Transitions.preFadeIn;
                }
                else {
                    game.currentTransition = Transitions.fadeIn;
                }
            }
            break;
        case Transitions.showDialog:
        case Transitions.hideDialog:
            if (changeToNextState(stage)) {
                game.currentTransition = Transitions.preRunning;
            }
            else {
                game.currentTransition = Transitions.running;
            }
            break;
        case Transitions.preFadeIn:
            game.currentTransition = Transitions.fadeIn;
            break;
        case Transitions.preRunning:
            game.currentTransition = Transitions.running;
            break;
    }

    function changeToNextState(stage) {
        let onShowCalled = false;
        if (game.nextState) {
            // remove the current container, unless we are showing a dialog
            if (game.currentTransition !== Transitions.showDialog) {
                let currentObj = game[game.currentState];
                stage.removeChild(currentObj.container);
            }
            // add the new container, unless we are hiding a dialog
            if (game.currentTransition !== Transitions.hideDialog) {
                let nextObj = game[game.nextState];
                let lastIndex = stage.numChildren - 1;
                stage.addChildAt(nextObj.container, lastIndex); // adds the container "under" the fadingLayer 
                //  trigger onShow(), if available
                if (nextObj.onShow) {
                    nextObj.onShow();
                    onShowCalled = true;
                }
            }
            game.currentState = game.nextState;
            game.nextState = null;
        }
        return onShowCalled;
    }
}

gameEngine.onKeyDown = function onKeyDown(stage, key) {
    if (game.currentState) {
        let currentObj = game[game.currentState];
        if (currentObj.onKeyDown) {
            currentObj.onKeyDown(stage, key);
        }
    }
}

gameEngine.onKeyUp = function onKeyUp(stage, key) {
    if (game.currentState) {
        let currentObj = game[game.currentState];
        if (currentObj.onKeyUp) {
            currentObj.onKeyUp(stage, key);
        }
    }
}

gameEngine.onKeyPress = function onKeyPress(stage, key) {
    if (game.currentState) {
        let currentObj = game[game.currentState];
        if (currentObj.onKeyPress) {
            currentObj.onKeyPress(stage, key);
        }
    }
}