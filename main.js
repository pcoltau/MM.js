gameEngine.onInit = onInit;
gameEngine.onTick = onTick;

// Global game state
game = {
    state: "playing"
};

function onInit(stage, assets) {
    var wepList = readEncodedFile(assets.getResult("wep", true));
    var itemList = readEncodedFile(assets.getResult("item", true));
    var typeList = readEncodedTypeFile(assets.getResult("type", true));
    var configList = readConfigFile(assets.getResult("config", false));
}


function onTick(stage, deltaInSeconds) {
    if (game.state === "playing") {
    }
}