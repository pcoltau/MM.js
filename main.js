gameEngine.onInit = onInit;
gameEngine.onTick = onTick;

// Global game state
game = {
    menu: null,
    state: "menu"
};

function onInit(stage, assets) {
    var wepList = readEncodedFile(assets.getResult("wep", true));
    var itemList = readEncodedFile(assets.getResult("item", true));
    var typeList = readEncodedTypeFile(assets.getResult("type", true));
    var configList = readConfigFile(assets.getResult("config", false));
    game.menu = createMenu(stage, assets);
}


function onTick(stage, deltaInSeconds) {
    if (game.state === "menu") {
        game.menu.onTick(stage, deltaInSeconds);

    }
}