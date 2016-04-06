"use strict";

function createGame(wepList, onExit, assets) {
	var noWind = false; // TODO: Get from config (on/off)
	var shouldShufflePlayers = true; // FRoundRandom in MM

	var States = {
		SHOW_ROUND_NUMBER: 0,
		PLAYER_READY: 1, // arrow blinking, waiting for input
		ADJUSTING_CANNON: 2,
		SELECTING_WEAPON: 3
	} 
	var currentState = States.SHOW_ROUND_NUMBER;

	var wind = 0; // will be set in updateWind()
	var currentPlayerIndex = 0;
	var pList = []; // playerList - it's called PList in MM
	var currentRound = 1;

	var blinkingArrowSpeed = 0.2; // approximate value - the value in MM (0.1) seems too fast, and is semi CPU dependent
	var blinkingArrowCounter = 0;
	var blinkingArrowVisible = false;

	var gameGraphics = createGameGraphics(assets, wepList);

	return {
		container: gameGraphics.container,
        onKeyDown: onKeyDown,
		onTick: onTick,
		onShow: onShow,
		setPlayerNames: setPlayerNames
	}

	function onShow() {
		currentPlayerIndex = 0;
		var currentPlayer = pList[currentPlayerIndex];
		gameGraphics.updateOverviewAfterCurrentPlayerChange(currentPlayer);
		var landTop = generateLand();
		gameGraphics.drawLand(landTop);
		wind = noWind ? 0 : Math.floor(Math.random() * 41) - 20;
		gameGraphics.updateWind(wind);

		setRandomPlayerPositions(pList, landTop);
		if (shouldShufflePlayers) {
			shufflePlayers(pList);
		}
		showAllTanks();
		gameGraphics.showRoundSign(currentRound)
	}

	function generateLand() {
		var landSmooth = 12; // TODO: Take from config
		var landComplex = 35; // TODO: Take from config
		var halfLandSmooth = Math.floor(landSmooth / 2);
		var landTop = [];
		
		var breaks = [];
		var startX = 0;
		var startY = Math.floor(Math.random() * SCREEN_HEIGHT_CENTER) + Math.floor(GET_MAX_Y / 3) + 10;
		var endX = 0;
		var endY = 0;
		do {
			breaks.push({x: startX, y: startY});
			var smoothness = Math.floor(Math.random() * halfLandSmooth) + halfLandSmooth;
			endX = Math.floor(Math.random() * Math.floor(GET_MAX_X / landComplex)) + startX + 10;
			endY = Math.floor(Math.random() * Math.floor(GET_MAX_Y / smoothness)) - Math.floor(GET_MAX_Y / (smoothness * 2)) + startY;
			endX = Math.min(endX, GET_MAX_X - 2);
			endY = Math.max(Math.min(endY, GET_MAX_Y - 18), 75);
			startX = endX;
			startY = endY;
		} while (endX < GET_MAX_X - 2);
		breaks.push({x: endX, y: endY})
		for (var i = 0; i < breaks.length - 1; ++i) {
			landTop[breaks[i].x] = breaks[i].y;
			for (var j = breaks[i].x; j <= breaks[i + 1].x; ++j) {
				landTop[j] = breaks[i].y + Math.round((breaks[i + 1].y - breaks[i].y) * (j - breaks[i].x) / (breaks[i + 1].x - breaks[i].x));
			}		
		}
		return landTop;
	}

    function onKeyDown(stage, key) {
		var currentPlayer = pList[currentPlayerIndex];
		switch (currentState) {
			case States.SHOW_ROUND_NUMBER:
				gameGraphics.hideRoundSign();
				currentState = States.PLAYER_READY;
				break;
			case States.PLAYER_READY:
				blinkingArrowCounter = 0;
				setCurrentTankArrowVisibility(true);
				currentState = States.ADJUSTING_CANNON;
				// no break - we want to handle the key
			case States.ADJUSTING_CANNON:
				handleAdjustingCannon(currentPlayer, key)
				break;
		}
	}

	function handleAdjustingCannon(currentPlayer, key) {
		switch (key) {
			case Keys.LEFT_ARROW:
			case Keys.NUMPAD_4:
				currentPlayer.angle += (gameEngine.isKeyDown[Keys.SHIFT] || key === Keys.NUMPAD_4) ? Math.PI/180 : Math.PI/45;
				if (currentPlayer.angle > Math.PI) {
					currentPlayer.angle = 0;
				}
				gameGraphics.updateCannonAngleAndText(currentPlayer);
				break;
			case Keys.RIGHT_ARROW:
			case Keys.NUMPAD_6:
				currentPlayer.angle -= (gameEngine.isKeyDown[Keys.SHIFT] || key === Keys.NUMPAD_6) ? Math.PI/180 : Math.PI/45;
				if (currentPlayer.angle < 0) {
					currentPlayer.angle = Math.PI;
				}
				gameGraphics.updateCannonAngleAndText(currentPlayer);
				break;
			case Keys.UP_ARROW:
			case Keys.NUMPAD_8:
				currentPlayer.power += (gameEngine.isKeyDown[Keys.SHIFT] || key === Keys.NUMPAD_8) ? 1 : 25;
				if (currentPlayer.power > currentPlayer.maxPower) {
					currentPlayer.power = currentPlayer.maxPower;
				}
				gameGraphics.updatePowerText(currentPlayer);
				break;
			case Keys.DOWN_ARROW:
			case Keys.NUMPAD_2:
				currentPlayer.power -= (gameEngine.isKeyDown[Keys.SHIFT] || key === Keys.NUMPAD_2) ? 1 : 25;
				if (currentPlayer.power < 0) {
					currentPlayer.power = 0;
				}
				gameGraphics.updatePowerText(currentPlayer);
				break;
			case Keys.HOME:
				currentPlayer.power = currentPlayer.maxPower;
				gameGraphics.updatePowerText(currentPlayer);
				break;
			case Keys.END:
				currentPlayer.power = 0;
				gameGraphics.updatePowerText(currentPlayer);
				break;
			case Keys.TAB:
				// TODO: Switch state and show weapon list
				break;
			case Keys.KEY_P:
				switchToNextPlayer();
				break;
			case Keys.PAGE_UP:
				currentPlayer.currentWep--;
				if (currentPlayer.currentWep < 0) {
					currentPlayer.currentWep = currentPlayer.weaponList.length - 1;
				}
				gameGraphics.updateWeaponNameAndAmmoText(currentPlayer);
				break;
			case Keys.PAGE_DOWN:
				currentPlayer.currentWep++;
				if (currentPlayer.currentWep === currentPlayer.weaponList.length) {
					currentPlayer.currentWep = 0;
				}
				gameGraphics.updateWeaponNameAndAmmoText(currentPlayer);
				break;
		}		
	}

	function switchToNextPlayer() {
		setCurrentTankArrowVisibility(false);
		currentPlayerIndex++;
		if (currentPlayerIndex === pList.length) {
			currentPlayerIndex = 0;
		}
		currentState = States.PLAYER_READY;
	}

	function onTick(stage, deltaInSeconds) {
		switch (currentState) {
			case States.PLAYER_READY:
			    handleBlinkingArrow(deltaInSeconds);
				break;
		}
	}

	function handleBlinkingArrow(deltaInSeconds) {
		blinkingArrowCounter += deltaInSeconds;
		if (blinkingArrowVisible) {
			if (blinkingArrowCounter >= blinkingArrowSpeed) {
				blinkingArrowCounter = 0;
				setCurrentTankArrowVisibility(false);
			}
		}
		else {
			if (blinkingArrowCounter >= blinkingArrowSpeed / 2) {
				blinkingArrowCounter = 0;
				setCurrentTankArrowVisibility(true);
			}
		}
	}

	function setCurrentTankArrowVisibility(visible) {
		blinkingArrowVisible = visible;
		gameGraphics.setTankArrowVisibility(pList[currentPlayerIndex].color, blinkingArrowVisible);
	}

	function setPlayerNames(playerNames) {
		pList = [];
		for (var i = 0; i < playerNames.length; ++i) {
			var player = createNewPlayer(playerNames[i], i);
			pList.push(player);
		}
	}

	function createNewPlayer(playerName, playerIndex) {
		var player = {
			name: playerName,
			power: 500,
			maxPower: 1000,
			armour: 0,
			parachutes: 0,
			shield: false,
			angle: Math.PI / 4,
			posX: 0,
			posY: 0,
			color: playerColorTable[playerIndex],
			secColor: playerColorTable[playerIndex + 8],
			weaponList: [
				{ammo: -1, weaponIndex: 0},
				{ammo: 5, weaponIndex: 1},
				{ammo: 1, weaponIndex: 2}],
			currentWep: 0,
			stats: {
				shots: 0,
				headshots: 0,
				misses: 0,
				damage: 0,
				kills: 0,
				profit: 0,
				points: 0,
				place: 1
			}
		};
		return player;
	}

	function setRandomPlayerPositions(players, landTop) {
		var averagePlayerSpace = Math.floor(GET_MAX_X / (players.length * 2));
		var n = 0;
		var ok = false
		do {
			for (var i = 0; i < players.length; ++i) {
				n = 0;
				do {
					ok = true;
					players[i].posX = Math.floor(Math.random() * (GET_MAX_X - 20)) + 10;
					for (var x = 0; x < i; ++x) {
						if (players[i].posX < players[x].posX + averagePlayerSpace && players[i].posX > players[x].posX - averagePlayerSpace) {
							ok = false;
						}
					} 
					n++;
				} while (!ok && n < 100);
			}
		} while (!ok || n === 100);

		for (var i = 0; i < players.length; ++i) {
			var posY = landTop[players[i].posX];
			posY = (posY === GET_MAX_Y - 18) ? posY - 2 : posY - 1;
			players[i].posY = posY;

			gameGraphics.updateTankPosition(players[i].color, players[i].posX, players[i].posY);
		}
	}

	function shufflePlayers(players) {
		for (var i = 0; i < players.length; ++i)	{
			var m = Math.floor(Math.random() * players.length);
			var n;
			do {
				n = Math.floor(Math.random() * players.length);
			} while (n === m);
			var playerMem = players[m];
			players[m] = players[n];
			players[n] = playerMem;
		}
	}

	function showAllTanks() {
		for (var i = 0; i < pList.length; ++i) {
			gameGraphics.setCannonAngle(pList[i]);
			if (pList[i].shield) {
				gameGraphics.setTankShieldVisibility(pList[i].color, true);
			}
			gameGraphics.setTankVisibility(pList[i].color, true);
		}		
	}

}