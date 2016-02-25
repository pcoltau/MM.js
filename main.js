gameEngine.onInit = onInit;
gameEngine.onTick = onTick;

// Global game state
game = {
    state: "playing"
};

function onInit(stage, assets) {
    // readWepFile(assets.getResult("wep", true))
    readWepFile(assets.getResult("type", true))
    // readWepFile(assets.getResult("item", true))
}


function onTick(stage, deltaInSeconds) {
    if (game.state === "playing") {
    }
}