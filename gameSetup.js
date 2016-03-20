function createGameSetup(onDone, onExit, assets) {
	var SettingsStates = {setup: 0, getPlayerNames: 1};
	var currentState = SettingsStates.setup;
	var gameSettings = null;
	var currentPlayerIndex = 0;

	var mainContainer = new createjs.Container();

	var backgroundContainer = createBackground();
    var settingsDialog = createGameSetupSettingsDialog(assets, onSettingsDone, onExit);
    var playerNamesDialog = createPlayerNamesDialog(assets, onPlayerNameDone);

	mainContainer.addChild(backgroundContainer);
	mainContainer.addChild(settingsDialog.container);

	return {
		container: mainContainer,
        onKeyDown: onKeyDown,
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

    function onKeyDown(stage, key) {
    	if (currentState === SettingsStates.getPlayerNames) {
			playerNamesDialog.onKeyDown(stage, key);
		}
		else {
			settingsDialog.onKeyDown(stage, key);
		}
	}

    function onKeyPress(stage, key) {
    	if (currentState === SettingsStates.getPlayerNames) {
			playerNamesDialog.onKeyPress(stage, key);
		}
	}

	function onSettingsDone(settings) {
		gameSettings = settings;
		currentState = SettingsStates.getPlayerNames;
        mainContainer.removeChild(settingsDialog.container);
        mainContainer.addChild(playerNamesDialog.container);
	}

	function onPlayerNameDone(playerName) {
		if (currentPlayerIndex < gameSettings.numPlayers - 1) {
			currentPlayerIndex++;
	        playerNamesDialog.setPlayerIndex(currentPlayerIndex)
	    }
	    else {
	    	onDone();
	    }
	}
}