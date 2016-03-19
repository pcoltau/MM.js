function createGameSetup(onExit, assets) {
	var mainContainer = new createjs.Container();

	var colorTable = [Colors.BLUE, Colors.LIGHTRED, Colors.GREEN, Colors.YELLOW, Colors.MAGENTA, Colors.CYAN, Colors.WHITE, Colors.LIGHTGRAY];

	var backgroundContainer = createBackground();
    var settingsDialog = createGameSetupSettingsDialog(assets, onSettingsDone, onExit);

	mainContainer.addChild(backgroundContainer);
	mainContainer.addChild(settingsDialog.container);

	return {
		container: mainContainer,
        onTick: onTick,
        onKeyUp: onKeyUp,
        onKeyPress: onKeyPress
	};

	function createBackground() {
	/*
	    Show_PCX('Gfx\frame.pcx',GetMaxX div 2 -318,GetMaxY div 2 - 235,636,235);
		Show_PCX('Gfx\frame.pcx',GetMaxX div 2 -318,GetMaxY div 2,636,235);
	*/
        var backgroundContainer = new createjs.Container();

        showPCX(assets, backgroundContainer, "frame.pcx", SCREEN_WIDTH_CENTER - 318, SCREEN_HEIGHT_CENTER - 235, 636, 235);
        showPCX(assets, backgroundContainer, "frame.pcx", SCREEN_WIDTH_CENTER - 318, SCREEN_HEIGHT_CENTER, 636, 235);
        return backgroundContainer;
	}

    function onTick(stage, deltaInSeconds) {
    	settingsDialog.onTick(stage, deltaInSeconds);
	}

    function onKeyUp(stage, key) {
		settingsDialog.onKeyUp(stage, key);
	}

    function onKeyPress(stage, key) {
		settingsDialog.onKeyPress(stage, key);
	}

	function onSettingsDone(gameSettings) {
        mainContainer.removeChild(settingsDialog.container);
	}
}