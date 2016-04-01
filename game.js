"use strict";

function createGame(onExit, assets) {
	// TODO: Get weapons from config
	var weapons = [{name: "Mortar"}]
	var noWind = false; // TODO: Get from config (on/off)
	var wind = 0; // will be set in updateWind()
	var currentPlayerIndex = 0;
	var pList = []; // playerList - it's called PList in pascal

	var gameGraphics = createGameGraphics(assets, weapons);

	return {
		container: gameGraphics.container,
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


	function onTick(stage, deltaInSeconds) {
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
			power: 800,
			maxPower: 1000,
			armour: 0,
			parachutes: 0,
			shield: false,
			angle: Math.PI / 4,
			posX: 0,
			posY: 0,
			color: playerColorTable[playerIndex],
			secColor: playerColorTable[playerIndex + 8],
			weaponList: [{ammo: -1, weaponIndex: 0}],
			currentWep: 0
		};
		/*
		    if LandTop[PosX] = GetMaxY-18 then
      PosY := GetMaxY-19
    else
      PosY := LandTop[PosX]-1;
*/
		return player;
	}

}