"use strict";

function createGame(wepList, onExit, assets, context) {
	let noWind = false; // TODO: Get from config (on/off)
	let shouldShufflePlayers = true; // FRoundRandom in MM

	let States = {
		SHOW_ROUND_NUMBER: 0,
		PLAYER_READY: 1, // arrow blinking, waiting for input
		ADJUSTING_CANNON: 2,
		SELECTING_WEAPON: 3,
		CANNON_FIRED: 4
	} 
	let currentState = States.SHOW_ROUND_NUMBER;

	let wind = 0;
	let currentPlayerIndex = 0;
	let pList = []; // playerList - it's called PList in MM
	let currentRound = 1;

	let blinkingArrowSpeed = 0.2; // approximate value - the value in MM (0.1) seems too fast, and is semi CPU dependent
	let blinkingArrowCounter = 0;
	let blinkingArrowVisible = false;

	let firedCannon = null; // the returned object from the fireCannon() function.

	let gameGraphics = createGameGraphics(assets, wepList, context);

	return {
		container: gameGraphics.container,
        onKeyDown: onKeyDown,
		onTick: onTick,
		onShow: onShow,
		setPlayerNames: setPlayerNames
	}

	function onShow() {
		currentPlayerIndex = 0;
		let currentPlayer = pList[currentPlayerIndex];
		gameGraphics.updateOverviewAfterCurrentPlayerChange(currentPlayer);
		let landTop = gameGraphics.generateLand();
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

    function onKeyDown(stage, key) {
		let currentPlayer = pList[currentPlayerIndex];
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
			case States.ADJUSTING_CANNON: {
				handleAdjustingCannon(currentPlayer, key)
				break;
			}
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
			case Keys.SPACE:
				setCurrentTankArrowVisibility(false);
				currentState = States.CANNON_FIRED;
				let currentWeapon = wepList[currentPlayer.weaponList[currentPlayer.currentWep].weaponIndex];
				firedCannon = fireCannon(currentWeapon, pList, currentPlayerIndex, wind, gameGraphics, fireCannonDone);
				break;
		}		
	}

	function switchToNextPlayer() {
		setCurrentTankArrowVisibility(false);
		// TODO: Check for maxPower > 0
		currentPlayerIndex++;
		if (currentPlayerIndex === pList.length) {
			currentPlayerIndex = 0;
		}
		let currentPlayer = pList[currentPlayerIndex];
		gameGraphics.updateOverviewAfterCurrentPlayerChange(currentPlayer);

		if (!noWind) {
			wind += Math.floor(Math.random() * 11) - 5;
			if (wind < -20) {
				wind -= (wind + 20) * 2;
			}
			if (wind > 20) {
				wind -= (wind - 20) * 2;
			}
			gameGraphics.updateWind(wind);
		}

		currentState = States.PLAYER_READY;
	}

	function onTick(stage, deltaInSeconds) {
		switch (currentState) {
			case States.PLAYER_READY:
			    handleBlinkingArrow(deltaInSeconds);
				break;
			case States.CANNON_FIRED:
				firedCannon.onTick(stage, deltaInSeconds);
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
		for (let i = 0; i < playerNames.length; ++i) {
			let player = createNewPlayer(playerNames[i], i);
			pList.push(player);
		}
	}

	function createNewPlayer(playerName, playerIndex) {
		let color = playerColorTable[playerIndex];
		let secColor = playerColorTable[playerIndex + 8];
		let player = {
			name: playerName,
			power: 500,
			maxPower: 1000,
			armour: 0,
			parachutes: 0,
			shield: true,
			angle: Math.PI / 4,
			posX: 0,
			posY: 0,
			color: color,
			secColor: secColor,
			rgbSecColor: Palette.getRGBFromColor(secColor),
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
		let averagePlayerSpace = Math.floor(GET_MAX_X / (players.length * 2));
		let n = 0;
		let ok = false
		do {
			for (let i = 0; i < players.length; ++i) {
				n = 0;
				do {
					ok = true;
					players[i].posX = Math.floor(Math.random() * (GET_MAX_X - 20)) + 10;
					for (let x = 0; x < i; ++x) {
						if (players[i].posX < players[x].posX + averagePlayerSpace && players[i].posX > players[x].posX - averagePlayerSpace) {
							ok = false;
						}
					} 
					n++;
				} while (!ok && n < 100);
			}
		} while (!ok || n === 100);

		for (let i = 0; i < players.length; ++i) {
			let posY = landTop[players[i].posX];
			posY = (posY === GET_MAX_Y - 18) ? posY - 2 : posY - 1;
			players[i].posY = posY;

			gameGraphics.updateTankPosition(players[i].color, players[i].posX, players[i].posY);
		}
	}

	function shufflePlayers(players) {
		for (let i = 0; i < players.length; ++i)	{
			let m = Math.floor(Math.random() * players.length);
			let n;
			do {
				n = Math.floor(Math.random() * players.length);
			} while (n === m);
			let playerMem = players[m];
			players[m] = players[n];
			players[n] = playerMem;
		}
	}

	function showAllTanks() {
		for (let i = 0; i < pList.length; ++i) {
			gameGraphics.setCannonAngle(pList[i]);
			if (pList[i].shield) {
				gameGraphics.setTankShieldVisibility(pList[i].color, true);
			}
			gameGraphics.setTankVisibility(pList[i].color, true);
		}		
	}

	function fireCannonDone() {
		firedCannon = null;
		switchToNextPlayer();
	}

}