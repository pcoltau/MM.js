"use strict";

function createPlayerNamesDialog(assets, onDone) {
	var playerIndex = 0;
	var playerName = "";
	var playerHeadlineText = null;
	var playerNameText = null;
	var playerNamesDialog = createPlayerNamesDialog();

	return {
		container: playerNamesDialog,
		setPlayerIndex: setPlayerIndex,
        onKeyPress: onKeyPress,
        onKeyDown: onKeyDown,
	};

	function createPlayerNamesDialog() {
        var dialogContainer = new createjs.Container();

		var x1 = SCREEN_WIDTH_CENTER - 91;
		var y1 = SCREEN_HEIGHT_CENTER - 16;
		var x2 = x1 + 182;
		var y2 = y1 + 32;

		drawBox(assets, dialogContainer, GameColors, x1, y1, x2, y2);

		playerHeadlineText = outTextXYAsText(GameColors.WHITE, "", x1 + 3, y1 + 3);
	    playerHeadlineText.shadow = new createjs.Shadow(GameColors.DARKGRAY, 1, 1, 0);
		setCurrentPlayerHeadlineText();
		dialogContainer.addChild(playerHeadlineText);

//      DrawFrame(x[1]+4,y[1]+14,x[2]-4,y[2]-4);
		drawFrame(dialogContainer, GameColors, x1 + 4, y1 + 14, x2 - 4, y2 - 4, GameColors.DARKGRAY);

/*
    SetFillStyle(SolidFill,DarkGray);
    bar(x[1]+5,y[1]+15,x[2]-5,y[2]-5);
*/

//		OutTextXY(x[1]+7,y[1]+17,str+'_');
		playerNameText = outTextXYAsText(GameColors.WHITE, "", x1 + 7, y1 + 17, false, GameColors.BLACK);
	    playerNameText.shadow = new createjs.Shadow(GameColors.BLACK, 1, 1, 0);
		updatePlayerNameText();
		dialogContainer.addChild(playerNameText);

		return dialogContainer;
	}

	function setCurrentPlayerHeadlineText() {
		playerHeadlineText.text = "Name for Player " + (playerIndex + 1);
		playerHeadlineText.color = playerColorTable[playerIndex];
	}

	function updatePlayerNameText() {
		playerNameText.text = playerName + "_";
	}

	function setPlayerIndex(index) {
		playerIndex = index;
		playerName = "";
		updatePlayerNameText();
		setCurrentPlayerHeadlineText();
	}

    function onKeyDown(stage, key) {
    	// BACKSPACE is not triggered by onKeyPress, because we "preventDefault" in the GameEngine to suppress the Browser's "back" functionality.
    	if (key === Keys.BACKSPACE) {
    		if (playerName.length > 0) {
    			playerName = playerName.substring(0, playerName.length - 1);
	    		updatePlayerNameText();
    		}
    	}
    }

    function onKeyPress(stage, key) {
    	if (playerName.length < 18) {
    		// Note: Pressed keys do not always translate to the values defined in "Keys", so we use Strings and chatCodeAt instead.
	    	if ((key >= "a".charCodeAt(0) && key <= "z".charCodeAt(0)) ||
	    		(key >= "A".charCodeAt(0) && key <= "Z".charCodeAt(0)) ||
	    		(key >= "0".charCodeAt(0) && key <= "9".charCodeAt(0)) ||
	    		key === " ".charCodeAt(0) || 
	    		key === ".".charCodeAt(0) || 
	    		key === "-".charCodeAt(0)) {
	    		var chr = String.fromCharCode(key);
	    		playerName += chr;
	    		updatePlayerNameText();
			}
    	}
        if (key === Keys.ENTER && playerName.length > 0) {
        	onDone(playerName);
        }
	}
}