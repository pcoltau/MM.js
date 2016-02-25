// Global game engine state and definitions
gameEngine = {
    onInit: null,
    onTick: null,
    keys: {},
    assets: [],
    data: []
};

(function() {
    var stage,
        jqWindow = $(window);

    function onLoad() {
        stage = new createjs.Stage("mm-canvas");
        onResizeCanvas();

        createjs.Ticker.on("tick", tick);
        createjs.Ticker.timingMode = createjs.Ticker.RAF;

        loadAssets();
    }

    function loadAssets() {
        var loader = new createjs.LoadQueue(false);

        loader.addEventListener("complete", function() {
            if (gameEngine.onInit) {
                gameEngine.onInit(stage, loader);
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
        gameEngine.keys[event.which] = true;
    }

    function onKeyUp(event) {
        delete gameEngine.keys[event.which];
    }

    function onResizeCanvas() {
        var canvas = document.getElementById("mm-canvas"),
            canvasAr = 800 / 600,
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
    jqWindow.on("resize", onResizeCanvas);
}());
