function createGameSetup(onExit, assets) {
	var mainContainer = new createjs.Container();

	var backgroundContainer = createBackground();
    var gameSetupFrame = createGameSetupFrame();

	mainContainer.addChild(backgroundContainer);
	mainContainer.addChild(gameSetupFrame);

	return {
		onTick: onTick,
		container: mainContainer
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

	function createGameSetupFrame() {
        var gameSetupContainer = new createjs.Container();

		x1 = SCREEN_WIDTH_CENTER - 180;
		y1 = SCREEN_HEIGHT_CENTER - 55;
		x2 = x1 + 360;
		y2 = y1 + 110;

		drawBox(assets, gameSetupContainer, x1, y1, x2, y2);

		drawBox(assets, gameSetupContainer, x1, y2 + 5, x2, y2 + 21, true);

        outTextXY(gameSetupContainer, Colors.DARKGRAY, "Press Enter to start game or Esc to cancel.", SCREEN_WIDTH_CENTER, y2 + 9, true); 

		drawFrame(gameSetupContainer, x1 + 8, y1 + 18, x2 - 8, y2 - 8);		

        outTextXY(gameSetupContainer, Colors.DARKGRAY, "G A M E   S E T U P", SCREEN_WIDTH_CENTER, y1 + 6, true); 

		return gameSetupContainer;
	}

	function onTick(stage, deltaInSeconds) {
		// ESC is not triggered in onKeyPress, so we trigger it here
		if (gameEngine.isKeyDown[Keys.ESCAPE]) {
			onExit();
		}
	}
}