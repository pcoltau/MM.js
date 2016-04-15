"use strict";

// Global game engine state and definitions
let gameEngine = {
    onInit: null,
    onTick: null,
    onKeyDown: null,
    onKeyUp: null,
    // will only trigger for printable characters
    onKeyPress: null,
    isKeyDown: {},
    assets: [],
    data: []
};

(function() {
    let stage,
        jqWindow = $(window);

    function onLoad() {
        stage = new createjs.Stage("mm-canvas");
        // Hack: http://stackoverflow.com/questions/6672870/easeljs-line-fuzzine
        stage.regX = -0.5;
        stage.regY = -0.5;
        let canvas = document.getElementById("mm-canvas");
        canvas.width = SCREEN_WIDTH;
        canvas.height = SCREEN_HEIGHT;
        //onResizeCanvas();

        createjs.Ticker.on("tick", tick);
        createjs.Ticker.timingMode = createjs.Ticker.RAF;

        let context = canvas.getContext("2d");

        loadAssets(context);
    }

    function loadAssets(context) {
        let loader = new createjs.LoadQueue(false);

        loader.addEventListener("complete", function() {
            if (gameEngine.onInit) {
                gameEngine.onInit(stage, loader, context);
            } else {
                console.error("You have not defined an init function on 'gameEngine'!");
            }
        });
        loader.loadManifest(gameEngine.assets, true);
    }

    function tick(event) {
        if (gameEngine.onInit) {
            gameEngine.onTick(stage, event.delta / 1000);
        } else {
            console.error("No onTick function registered on 'gameEngine'");
        }

        stage.update(event); // important!!
    }

    function onKeyDown(event) {
        gameEngine.isKeyDown[event.which] = true;
        if (gameEngine.onKeyDown) {
            gameEngine.onKeyDown(stage, event.which);
        }
        if (event.which === Keys.BACKSPACE) {
            // disable "back" in the browser. HOWEVER, it also prevents onKeyPress to be fired! 
            event.preventDefault();
        }
    }

    function onKeyUp(event) {
        delete gameEngine.isKeyDown[event.which];
        if (gameEngine.onKeyUp) {
            gameEngine.onKeyUp(stage, event.which);
        }
    }

    function onKeyPress(event) {
        if (gameEngine.onKeyPress) {
            gameEngine.onKeyPress(stage, event.which);
        }
    }

    function onResizeCanvas() {
        let canvas = document.getElementById("mm-canvas"),
            canvasAr = SCREEN_WIDTH / SCREEN_HEIGHT,
            docWidth = document.body.clientWidth,
            docHeight = document.body.clientHeight,
            documentAr = docWidth / docHeight;

        if (documentAr > canvasAr) {
            canvas.style.height = docHeight + "px";
            canvas.style.width = docHeight * canvasAr + "px";
        } else {
            canvas.style.width = docWidth;
            canvas.style.height = docWidth / canvasAr + "px";
        }
    }

    window.onload = onLoad;
    jqWindow.on("keydown", onKeyDown);
    jqWindow.on("keyup", onKeyUp);
    jqWindow.on("keypress", onKeyPress);
    jqWindow.on("resize", onResizeCanvas);
}());
