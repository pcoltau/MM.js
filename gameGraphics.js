"use strict";

function createGameGraphics(assets, weapons, context) {
	let dirtColor = GameColors.BROWN;
	let dirtColor2 = GameColors.DARKESTBROWN;
	let dirtRGB = Palette.getRGBFromColor(dirtColor);
	let dirtRGB2 = Palette.getRGBFromColor(dirtColor2);

	let windShape = null;
	let armourText = null;
	let parachutesText = null;
	let shieldText = null;
	let nameText = null;
	let powerText = null;
	let angleText = null;
	let weaponNameText = null;
	let weaponAmmoText = null;
	let guidanceContainer = null;
	let guidanceShape = null;
	let tracersShape = null;
	let roundNumberText = null;
	let tanks = {}; // all 8 tanks, {color:{container, cannonShape, shieldShape, arrowShape} 

	let skyRGB = Palette.getRGBFromColor(GameColors.SKY);
	// The gameImageData is used to draw the land, tracers and explosions.
	let gameImageData = context.createImageData(SCREEN_WIDTH, SCREEN_HEIGHT);
	fillGameImageDataWithSky();

	let mainContainer = new createjs.Container();

	let gameShape = new createjs.Shape();
	mainContainer.addChild(gameShape);

	let tanksContainer = createTanks();
	mainContainer.addChild(tanksContainer);

	let explosionsShape = new createjs.Shape();
	mainContainer.addChild(explosionsShape);

	let topMenu = createTopMenu();
	mainContainer.addChild(topMenu);

	let bottomMenu = createBottomMenu();
	mainContainer.addChild(bottomMenu);

	let screenEdges = createScreenEdges();
	mainContainer.addChild(screenEdges);

	let roundSign = createRoundSign();
	mainContainer.addChild(roundSign)

	return {
		container: mainContainer,
		updateOverviewAfterCurrentPlayerChange: updateOverviewAfterCurrentPlayerChange,
		updateWind: updateWind,
		generateLand: generateLand,
		drawLand: drawLand,
		drawShot: drawShot,
		drawExplosionCircle: drawExplosionCircle,
		clearExplosionCircle: clearExplosionCircle,
		updateGameImage: updateGameImage,
		isGround: isGround,
		updateTankPosition: updateTankPosition,
		updateCannonAngleAndText: updateCannonAngleAndText,
		setCannonAngle: setCannonAngle,
		updatePowerText: updatePowerText,
		updateWeaponNameAndAmmoText: updateWeaponNameAndAmmoText,
		setTankVisibility: setTankVisibility,
		setTankShieldVisibility: setTankShieldVisibility,
		setTankArrowVisibility: setTankArrowVisibility,
		showRoundSign: showRoundSign,
		hideRoundSign: hideRoundSign,
		showGuidance: showGuidance,
		hideGuidance: hideGuidance,
		updateGuidance: updateGuidance
	};

	function fillGameImageDataWithSky() {
		let data = gameImageData.data;
		for (let i = 0; i < data.length; i += 4) {
			data[i + 0] = skyRGB.r;
			data[i + 1] = skyRGB.g;
			data[i + 2] = skyRGB.b;
			data[i + 3] = 0xFF;
		}
	}

	function generateLand() {
		let landSmooth = 12; // TODO: Take from config
		let landComplex = 35; // TODO: Take from config
		let halfLandSmooth = Math.floor(landSmooth / 2);
		let landTop = [];
		
		let breaks = [];
		let startX = 0;
		let startY = Math.floor(Math.random() * SCREEN_HEIGHT_CENTER) + Math.floor(GET_MAX_Y / 3) + 10;
		let endX = 0;
		let endY = 0;
		do {
			breaks.push({x: startX, y: startY});
			let smoothness = Math.floor(Math.random() * halfLandSmooth) + halfLandSmooth;
			endX = Math.floor(Math.random() * Math.floor(GET_MAX_X / landComplex)) + startX + 10;
			endY = Math.floor(Math.random() * Math.floor(GET_MAX_Y / smoothness)) - Math.floor(GET_MAX_Y / (smoothness * 2)) + startY;
			endX = Math.min(endX, GET_MAX_X - 2);
			endY = Math.max(Math.min(endY, GET_MAX_Y - 18), 75);
			startX = endX;
			startY = endY;
		} while (endX < GET_MAX_X - 2);
		breaks.push({x: endX, y: endY})
		for (let i = 0; i < breaks.length - 1; ++i) {
			landTop[breaks[i].x] = breaks[i].y;
			for (let j = breaks[i].x; j <= breaks[i + 1].x; ++j) {
				landTop[j] = breaks[i].y + Math.round((breaks[i + 1].y - breaks[i].y) * (j - breaks[i].x) / (breaks[i + 1].x - breaks[i].x));
			}		
		}
		return landTop;
	}

	function drawLand(landTop) {
  		// magic to compensate for the snapToPixel magic we do on the stage in gameEngine.js
  		gameShape.regX = 0.5; 
  		gameShape.regY = 0.5;

    	let data = gameImageData.data;
		for (let x = 2; x <= GET_MAX_X - 2; ++x) {
			for (let y = landTop[x] + 1; y <= GET_MAX_Y - 18; ++y) {
				let r = (GET_MAX_Y - y + landTop[x]) / 70;
				if (r < 1) {
					r = (1 / r);
				}
				let rr = Math.round(r);
				if (rr <= 1) {
					rr = 2;
				}
				let rgb = (Math.floor(Math.random() * rr) === 0) ? dirtRGB2 : dirtRGB;
				let index = (x + y * gameImageData.width) * 4;
				data[index + 0] = rgb.r;
				data[index + 1] = rgb.g;
				data[index + 2] = rgb.b;
				data[index + 3] = 0xFF; 
			}
		}

		// add the imageData draw function
		addDrawGameImageDataFunction();
		// Draw landTop
		for (let x = 3; x <= GET_MAX_X - 2; ++x) {
			// reversing the magic from above in order to have the correct lines by adding 0.5.
			line(gameShape.graphics, dirtColor2, x - 0.5, landTop[x - 1] + 0.5, x + 0.5, landTop[x] + 0.5);
		}
		// update the gameImageData with the landTop
		addUpdateGameImageDataFunction()
    	// trigger a draw and a caching of the resulting image
		gameShape.cache(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
		// clear all graphics functions
		gameShape.graphics.clear();
		// re-add the imageData draw function, so it is ready for the next drawing/updateCache.
		addDrawGameImageDataFunction();
	}

	function addDrawGameImageDataFunction() {
		gameShape.graphics.append({exec:function(ctx, shape) {
			ctx.putImageData(gameImageData, 0, 0);
    	}});
	}

	function addUpdateGameImageDataFunction() {
		gameShape.graphics.append({exec:function(ctx, shape) {
			gameImageData = ctx.getImageData(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    	}});
	}

	function drawShot(x, y, rgbColor) {
    	let data = gameImageData.data;
		let index = (x + y * gameImageData.width) * 4;
		data[index + 0] = rgbColor.r;
		data[index + 1] = rgbColor.g;
		data[index + 2] = rgbColor.b;
		data[index + 3] = 0xFF; 
	}

	function drawExplosionCircle(x, y, r, color) {
		circle(explosionsShape.graphics, color, x, y, r);
	}

	function clearExplosionCircle(x, y, r) {
		explosionsShape.graphics.clear();
		circle(gameShape.graphics, GameColors.SKY, x, y, r, GameColors.SKY);
		// update the gameImageData with the cleared explosion
		addUpdateGameImageDataFunction()
		// trigger a redraw
		gameShape.updateCache();
		// clear all graphics functions
		gameShape.graphics.clear();
		// re-add the imageData draw function, so it is ready for the next drawing/updateCache.
		addDrawGameImageDataFunction();
	}

	function updateGameImage() {
		gameShape.updateCache();
	}

	function isGround(x, y) {
    	let data = gameImageData.data;
		let index = (x + y * gameImageData.width) * 4;
		let dataIndex0 = data[index];
		let dataIndex1 = data[index + 1];
		let dataIndex2 = data[index + 2];
		let dataIndex3 = data[index + 3];
		return ((dataIndex0 === dirtRGB.r && dataIndex1 === dirtRGB.g && dataIndex2 === dirtRGB.b && dataIndex3 === 255) ||
			    (dataIndex0 === dirtRGB2.r && dataIndex1 === dirtRGB2.g && dataIndex2 === dirtRGB2.b && dataIndex3 === 255));
	}

	function updateOverviewAfterCurrentPlayerChange(newPlayer) {
		updatePlayerNameText(newPlayer);
		updateAngleText(newPlayer);
		updatePowerText(newPlayer);
		updateWeaponNameAndAmmoText(newPlayer);
		updateArmourText(newPlayer);
		updateParachutesText(newPlayer);
		updateShieldText(newPlayer);
	}

	function createTopMenu() {
		let container = createMenuBars(0);
	    drawFrame(container, GameColors, 57, 3, 130, 13);
	    drawFrame(container, GameColors, 188, 3, 222, 13);
	    drawFrame(container, GameColors, GET_MAX_X - 26, 3, GET_MAX_X - 8, 13);
	    drawFrame(container, GameColors, GET_MAX_X - 192, 3, GET_MAX_X - 30, 13);

		outTextXY(container, GameColors.DARKGRAY, "Power:", 8, 5);
		outTextXY(container, GameColors.DARKGRAY, "Angle:", 140, 5);
		outTextXY(container, GameColors.DARKGRAY, "Weapon:", GET_MAX_X - 248, 5);

		nameText = outTextXYAsText(GameColors.WHITE, "", SCREEN_WIDTH_CENTER, 4, "center");
		nameText.shadow = new createjs.Shadow(GameColors.BLACK, 1, 1, 0);
		container.addChild(nameText);

		powerText = outTextXYAsText(GameColors.WHITE, "", 58 + 8 * 9 /*"MakeSpaces" Calculation*/, 5, "right");
		container.addChild(powerText);

		angleText = outTextXYAsText(GameColors.WHITE, "", 190 + 8 * 4 /*"MakeSpaces" Calculation*/, 5, "right");
		container.addChild(angleText);

		weaponNameText = outTextXYAsText(GameColors.WHITE, "", GET_MAX_X - 190, 5);
		container.addChild(weaponNameText);

		weaponAmmoText = outTextXYAsText(GameColors.WHITE, "", GET_MAX_X - 24 + 8 * 2 /*"MakeSpaces" Calculation*/, 5, "right");
		container.addChild(weaponAmmoText);

		return container;
	}

	function updateAngleText(player) {
		let angle = player.angle
		if (angle > Math.PI / 2) {
			angleText.text = Math.round((Math.PI - angle) * (180 / Math.PI)) + " L";
		}
		else {
			angleText.text = Math.round(angle * (180 / Math.PI)) + " R";
		}
	}

	function updateWeaponAmmoText(player) {
		let ammo = player.weaponList[player.currentWep].ammo;
		weaponAmmoText.text = (ammo == -1 ? 99 : ammo);
	}

	function updateWeaponNameAndAmmoText(player) {
		let weaponName = weapons[player.weaponList[player.currentWep].weaponIndex].name;
		weaponNameText.text = weaponName;
		updateWeaponAmmoText(player);
	}

	function updatePlayerNameText(player) {
		nameText.text = player.name;
		nameText.color = player.color;
		nameText.shadow.color = getPlayerNameShadow(player.color);
	}

	function updatePowerText(player) {
		powerText.text = player.power + "/" + player.maxPower; 
	}

	function getPlayerNameShadow(playerColor) {
		if (playerColor !== GameColors.GRAY &&
			playerColor !== GameColors.DARKMAGENTA && 
			playerColor !== GameColors.DARKGREEN && 
			playerColor !== GameColors.DARKBROWN && 
			playerColor !== GameColors.BLUE && 
			playerColor !== GameColors.RED &&
			playerColor !== GameColors.MAGENTA) {
			return GameColors.GRAY;
		} 
		else {
			return GameColors.DARKGRAY;
		}
	}

	function createBottomMenu() {
		let container = createMenuBars(GET_MAX_Y - 16);
	    drawFrame(container, GameColors, 64, GET_MAX_Y - 13, 98, GET_MAX_Y - 3);
	    drawFrame(container, GameColors, 200, GET_MAX_Y - 13, 210, GET_MAX_Y - 3);
	    drawFrame(container, GameColors, 312, GET_MAX_Y - 13, 340, GET_MAX_Y - 3);

		outTextXY(container, GameColors.DARKGRAY, "Armour:", 8, GET_MAX_Y - 11);
		outTextXY(container, GameColors.DARKGRAY, "Parachutes:", 112, GET_MAX_Y - 11);
		outTextXY(container, GameColors.DARKGRAY, "Mag.Shield:", 224, GET_MAX_Y - 11);

		armourText = outTextXYAsText(GameColors.WHITE, "", 66 + 8 * 4 /*"MakeSpaces" Calculation*/, GET_MAX_Y - 11, "right");
		container.addChild(armourText);

		parachutesText = outTextXYAsText(GameColors.WHITE, "", 202, GET_MAX_Y - 11);
		container.addChild(parachutesText);

		shieldText = outTextXYAsText(GameColors.WHITE, "", 314, GET_MAX_Y - 11);
		container.addChild(shieldText);

		let wind = createWind();
		container.addChild(wind);

		guidanceContainer = createGuidance();
		container.addChild(guidanceContainer);

		return container;
	}

	function createMenuBars(y) {
		let container = new createjs.Container();
        showPCX(assets, container, "bar.pcx", 0, y, GET_MAX_X, 16);
        let shape = new createjs.Shape();
	    line(shape.graphics, GameColors.WHITE, 0, y, GET_MAX_X, y);
	    line(shape.graphics, GameColors.WHITE, 0, y, 0, y + 16);
	    line(shape.graphics, GameColors.GRAY, 0, y + 16, GET_MAX_X, y + 16);
	    line(shape.graphics, GameColors.GRAY, GET_MAX_X, y + 16, GET_MAX_X, y);
	    container.addChild(shape);
	    return container;
	}

	function createWind() {
		let container = new createjs.Container();
		let x = GET_MAX_X - 90;
		let y = GET_MAX_Y - 11;
		outTextXY(container, GameColors.DARKGRAY, "Wind:", x - 42, y);
		drawFrame(container, GameColors, x - 1, y, x + 82, y + 7);

		windShape = new createjs.Shape();
		updateWind(windShape);
		container.addChild(windShape);
		return container;
	}

	function updateWind(wind) {
		windShape.graphics.clear();

		let doubleWind = wind * 2;
		let x = GET_MAX_X - 90;
		let y = GET_MAX_Y - 11;
		bar(windShape.graphics, GameColors.BLUE, x + 41 + doubleWind, y + 2, x + 41, y + 5);
		line(windShape.graphics, GameColors.MEDBLUE, x + 41 + doubleWind, y + 5, x + 41, y + 5);
		let color = doubleWind < 0 ? GameColors.BRIGHTBLUE : GameColors.MEDBLUE;
		line(windShape.graphics, color, x + 41 + doubleWind, y + 2, x + 41 + doubleWind, y + 5);
		line(windShape.graphics, GameColors.BRIGHTBLUE, x + 41 + doubleWind, y + 2, x + 41, y + 2);
		line(windShape.graphics, GameColors.WHITE, x + 41, y + 1, x + 41, y + 6);
	}

	function createGuidance() {
		let container = new createjs.Container();
		outTextXY(container, GameColors.DARKGRAY, "Guid. Fuel:", 354, GET_MAX_Y - 11);
		drawFrame(container, GameColors, 442, GET_MAX_Y - 11, 495, GET_MAX_Y - 4);

		guidanceShape = new createjs.Shape();
		container.addChild(guidanceShape);

		container.visible = false;
		return container;
	}

	function showGuidance() {
		guidanceContainer.visible = true;
	}

	function hideGuidance() {
		guidanceContainer.visible = false;
	}

	function updateGuidance(guidanceFuel) {
		guidanceShape.graphics.clear();

		bar(guidanceShape.graphics, GameColors.RED, 443, GET_MAX_Y - 9, 443 + guidanceFuel, GET_MAX_Y - 6);
		line(guidanceShape.graphics, GameColors.DARKRED, 443, GET_MAX_Y - 6, 443 + guidanceFuel, GET_MAX_Y - 6);
		line(guidanceShape.graphics, GameColors.DARKRED, 443 + guidanceFuel, GET_MAX_Y - 9, 443 + guidanceFuel, GET_MAX_Y - 6);
		line(guidanceShape.graphics, GameColors.LIGHTRED, 443, GET_MAX_Y - 9, 443 + guidanceFuel, GET_MAX_Y - 9);
	}

	function updateArmourText(player) {
		armourText.text = player.armour;
	}

	function updateParachutesText(player) {
		parachutesText.text = player.parachutes;
	}

	function updateShieldText(player) {
		shieldText.text = player.shield ? "On" : "Off";
		shieldText.color = player.shield ? GameColors.WHITE : GameColors.LIGHTGRAY;
	}

	function createScreenEdges() {
		let shape = new createjs.Shape();
		rectangle(shape.graphics, GameColors.MAGENTA, 0, 17, GET_MAX_X, GET_MAX_Y - 17);
		rectangle(shape.graphics, GameColors.DARKMAGENTA, 1, 18, GET_MAX_X - 1, GET_MAX_Y - 18);
		return shape;
	}

	function createTanks() {
		let tanksContainer = new createjs.Container();
		for (let i = 0; i < 8; ++i) {
			let tankContainer = new createjs.Container();
			let tankShape = new createjs.Shape();
			let color = playerColorTable[i];
			let secColor = playerColorTable[i+8];
			// in this way, the tankContainer.x and y can be places precisely at the tank position
			tankShape.regX = 3;
			tankShape.regY = 2;

			bar(tankShape.graphics, color, 0, 0, 6, 3);
			putPixel(tankShape.graphics, secColor, 0, 0);
			putPixel(tankShape.graphics, secColor, 6, 0);
			tankContainer.addChild(tankShape);

			let cannonShape = new createjs.Shape();
			 // in this way, the tankContainer.x and y can be places precisely at the tank position
			cannonShape.regX = 0;
			cannonShape.regY = 3;
			tankContainer.addChild(cannonShape);

			let shieldShape = new createjs.Shape();
			 // in this way, the tankContainer.x and y can be places precisely at the tank position
			shieldShape.regX = 0;
			shieldShape.regY = 12;

			line(shieldShape.graphics, GameColors.LIGHTGRAY, -2, 0, 2, 0);
			line(shieldShape.graphics, GameColors.LIGHTGRAY, -2, 0, -5, 2);
			line(shieldShape.graphics, GameColors.LIGHTGRAY, 2, 0, 5, 2);
			line(shieldShape.graphics, GameColors.GRAY, -1, 2, 1, 2);
			line(shieldShape.graphics, GameColors.GRAY, -1, 2, -4, 3);
			line(shieldShape.graphics, GameColors.GRAY, 1, 2, 4, 3);
			shieldShape.visible = false;
			tankContainer.addChild(shieldShape);

			let arrowShape = new createjs.Shape();
			 // in this way, the tankContainer.x and y can be places precisely at the tank position
			arrowShape.regX = 0;
			arrowShape.regY = 16;

			line(arrowShape.graphics, color, -2, 0, 2, 0);
			line(arrowShape.graphics, color, -1, 1, 1, 1);
			putPixel(arrowShape.graphics, color, 0, 2);
			arrowShape.visible = false;
			tankContainer.addChild(arrowShape);

			tankContainer.visible = false;
			tanksContainer.addChild(tankContainer);

			let tankObj = {
				container: tankContainer,
				cannonShape: cannonShape,
				shieldShape: shieldShape,
				arrowShape: arrowShape
			}

			tanks[color] = tankObj;
		}
		return tanksContainer;
	}

	function createRoundSign() {
		let roundContainer = new createjs.Container();

		let x1 = SCREEN_WIDTH_CENTER - 57;
		let y1 = SCREEN_HEIGHT_CENTER - 8;
		let x2 = x1 + 114;
		let y2 = y1 + 14;

		drawBox(assets, roundContainer, GameColors, x1, y1, x2, y2);

		roundNumberText = outTextXYAsText(GameColors.WHITE, "", x1 + 6, y1 + 4);
		roundNumberText.shadow = new createjs.Shadow(GameColors.DARKGRAY, 1, 1, 0);
		roundContainer.addChild(roundNumberText);

		roundContainer.visible = false;
		return roundContainer;
	}

	function showRoundSign(roundNumber) {
		roundNumberText.text = "R O U N D  " + roundNumber;
		roundSign.visible = true;
	}

	function hideRoundSign() {
		roundSign.visible = false;
	}

	function updateTankPosition(tankColor, x, y) {
		let tankContainer = tanks[tankColor].container;
		tankContainer.x = x;
		tankContainer.y = y; 
	}

	function updateCannonAngleAndText(player) {
		setCannonAngle(player);
		updateAngleText(player);
	}

	function setCannonAngle(player) {
		let cannonShape = tanks[player.color].cannonShape;
		cannonShape.graphics.clear();
		line(cannonShape.graphics, GameColors.WHITE, 0, 0, Math.round(Math.cos(player.angle) * 5), -Math.round(Math.sin(player.angle) * 5));
	}

	function setTankVisibility(tankColor, visible) {
		let tankContainer = tanks[tankColor].container;
		tankContainer.visible = visible;
	}

	function setTankShieldVisibility(tankColor, visible) {
		let shieldShape = tanks[tankColor].shieldShape;
		shieldShape.visible = visible;
	}

	function setTankArrowVisibility(tankColor, visible) {
		let arrowShape = tanks[tankColor].arrowShape;
		arrowShape.visible = visible;
	}

}