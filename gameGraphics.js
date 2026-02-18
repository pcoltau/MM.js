"use strict";

function createGameGraphics(assets, weapons, context, options) {
	let dirtColor = GameColors.BROWN;
	let dirtColor2 = GameColors.DARKESTBROWN;
	let rgbDirt = Palette.getRGBFromColor(dirtColor);
	let rgbDirt2 = Palette.getRGBFromColor(dirtColor2);
	let rgbSky = Palette.getRGBFromColor(GameColors.SKY);

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
	let tanks = {}; // all 8 tanks, {color:{container, cannonShape, shieldShape, arrowShape, parachuteShape} 
	let commentContainer = new createjs.Container();

	let skyRGB = Palette.getRGBFromColor(GameColors.SKY);

	let mainContainer = new createjs.Container();

	let gameImageData = null;
	let gameShape = createGameShape();
	mainContainer.addChild(gameShape);

	let tanksContainer = createTanks();
	mainContainer.addChild(tanksContainer);

	let explosionsShape = new createjs.Shape();
	mainContainer.addChild(explosionsShape);

	let explodingTankContainer = new createjs.Container();
	mainContainer.addChild(explodingTankContainer);

	let topMenu = createTopMenu();
	mainContainer.addChild(topMenu);

	let bottomMenu = createBottomMenu();
	mainContainer.addChild(bottomMenu);

	let screenEdges = createScreenEdges();
	mainContainer.addChild(screenEdges);

	let roundSign = createRoundSign();
	mainContainer.addChild(roundSign)

	commentContainer.visible = false;
	mainContainer.addChild(commentContainer);

	let weaponsListContentContainer;
	let weaponsDescriptionContentContainer;
	let weaponsContainer = new createjs.Container();
	hideWeaponsContainer();
	mainContainer.addChild(weaponsContainer);

	let roundStatsContainer = new createjs.Container();
	roundStatsContainer.visible = false;
	mainContainer.addChild(roundStatsContainer);

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
		moveDirt: moveDirt,
		clearGameImage: clearGameImage,
		updateTankPosition: updateTankPosition,
		updateCannonAngleAndText: updateCannonAngleAndText,
		setCannonAngle: setCannonAngle,
		updatePowerText: updatePowerText,
		updateWeaponNameAndAmmoText: updateWeaponNameAndAmmoText,
		setTankVisibility: setTankVisibility,
		setTankShieldVisibility: setTankShieldVisibility,
		setTankArrowVisibility: setTankArrowVisibility,
		setTankParachuteVisibility: setTankParachuteVisibility,
		showComment: showComment,
		hideComment: hideComment,
		showRoundSign: showRoundSign,
		hideRoundSign: hideRoundSign,
		showGuidance: showGuidance,
		hideGuidance: hideGuidance,
		updateGuidance: updateGuidance,
		addExplosionDotToExplodingTankContainer: addExplosionDotToExplodingTankContainer,
		clearExplodingTankContainer: clearExplodingTankContainer,
		showWeaponsContainer: showWeaponsContainer,
		updateWeaponsContainer: updateWeaponsContainer,
		hideWeaponsContainer: hideWeaponsContainer,
		showRoundStatsPrimary: showRoundStatsPrimary,
		showRoundStatsSecondary: showRoundStatsSecondary,
		hideRoundStats: hideRoundStats
	};

	function showComment(comment) {
		commentContainer.removeAllChildren();
		commentContainer.visible = true;
		let charWidth = 8;
		let textY = 24;
		let boxTop = 22;
		let boxBottom = 34;
		let text = comment.text;
		let textWidth = text.length * charWidth;
		let startX = Math.round(GET_MAX_X / 2 - textWidth / 2);
		let boxLeft = startX - 8;
		let boxRight = startX + textWidth + 8;

		let boxShape = new createjs.Shape();
		bar(boxShape.graphics, GameColors.DARKGRAY, boxLeft, boxTop, boxRight, boxBottom);
		rectangle(boxShape.graphics, GameColors.GRAY, boxLeft, boxTop, boxRight, boxBottom);
		commentContainer.addChild(boxShape);

		let x = startX;
		if (comment.isSuicide) {
			drawPlayerName(commentContainer, comment.shooterName, x, textY, comment.shooterColor);
			x += comment.shooterName.length * charWidth;
			drawText(commentContainer, " suicided!", x, textY, GameColors.WHITE);
			return;
		}

		drawPlayerName(commentContainer, comment.shooterName, x, textY, comment.shooterColor);
		x += comment.shooterName.length * charWidth + charWidth;
		drawText(commentContainer, comment.str1, x, textY, GameColors.WHITE);
		x += comment.str1.length * charWidth;
		drawPlayerName(commentContainer, comment.personName, x, textY, comment.personColor);
		x += comment.personName.length * charWidth;
		drawText(commentContainer, comment.str2, x, textY, GameColors.WHITE);
	}

	function hideComment() {
		commentContainer.removeAllChildren();
		commentContainer.visible = false;
	}

	function drawText(container, text, x, y, color) {
		let textObj = outTextXYAsText(color, text, x, y);
		container.addChild(textObj);
	}

	function drawPlayerName(container, name, x, y, color) {
		let shadowColor = getNameShadowColor(color);
		let shadowText = outTextXYAsText(shadowColor, name, x + 1, y + 1);
		let textObj = outTextXYAsText(color, name, x, y);
		container.addChild(shadowText);
		container.addChild(textObj);
	}

	function getNameShadowColor(color) {
		if (color !== GameColors.GRAY && color !== GameColors.DARKMAGENTA &&
			color !== GameColors.DARKGREEN && color !== GameColors.DARKBROWN &&
			color !== GameColors.BLUE && color !== GameColors.RED &&
			color !== GameColors.MAGENTA) {
			return GameColors.GRAY;
		}
		return GameColors.BLACK;
	}

	function createGameShape() {
		let gameShape = new createjs.Shape();
		// magic to compensate for the snapToPixel magic we do on the stage in gameEngine.js
		gameShape.regX = 0.5; 
		gameShape.regY = 0.5;
		// The gameImageData is used to draw the land and tracers.
		gameImageData = context.createImageData(SCREEN_WIDTH, SCREEN_HEIGHT);
		gameShape.graphics.append({exec:function(ctx, shape) {
			ctx.putImageData(gameImageData, 0, 0);
		}});
		gameShape.cache(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
		return gameShape;
	}

	function clearGameImage() {
		// Fill the data with sky.
		let data = gameImageData.data;
		for (let i = 0; i < data.length; i += 4) {
			data[i + 0] = skyRGB.r;
			data[i + 1] = skyRGB.g;
			data[i + 2] = skyRGB.b;
			data[i + 3] = 0xFF;
		}
	}

	function generateLand() {
		let landSmooth = options && options.landSmooth ? options.landSmooth : 12;
		let landComplex = options && options.landComplex ? options.landComplex : 35;
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
				let rgb = (Math.floor(Math.random() * rr) === 0) ? rgbDirt2 : rgbDirt;
				let index = (x + y * gameImageData.width) * 4;
				data[index + 0] = rgb.r;
				data[index + 1] = rgb.g;
				data[index + 2] = rgb.b;
				data[index + 3] = 0xFF; 
			}
		}
		// Draw landTop
		drawLandTop(landTop);
		updateGameImage();
	}

	function drawLandTop(landTop) {
		for (let x = 3; x <= GET_MAX_X - 2; ++x) {
			drawLine(x, landTop[x - 1], x, landTop[x], rgbDirt2);
		}
	}

	function drawLine(x1, y1, x2, y2, rgbColor) {
		let xx1 = Math.min(x1, x2);
		let xx2 = Math.max(x1, x2);
		let yy1 = Math.min(y1, y2);
		let yy2 = Math.max(y1, y2);
		let xlen = xx2 - xx1;
		let ylen = yy2 - yy1;
		if (xlen > ylen) {
			let yinc = ylen/xlen;
			for (let x = xx1; x != xx2; ++x) {
				let y = Math.round((x - xx1) * yinc + yy1)
				setLandColor(x, y, rgbColor)
			}
		}
		else {
			let xinc = xlen/ylen;
			for (let y = yy1; y != yy2; ++y) {
				let x = Math.round((y - yy1) * xinc + xx1)
				setLandColor(x, y, rgbColor)
			}
		}
		setLandColor(xx2, yy2, rgbColor)
	}

	function drawCircle(x, y, r, rgbColor) {
		for (let xi = -r; xi < r; ++xi) {
			let height = Math.round(Math.sqrt(r * r - xi * xi)) - 1;
			for (let yi = -height; yi <= height; ++yi) {
				setLandColor(xi + x, yi + y, rgbColor);
			}
		}
	}

	function moveDirt(landTop, hole) {
		for (let x = 2; x <= GET_MAX_X - 2; ++x) {
			if (hole[x]) {
				let memLine = [];
				let yTop = GET_MAX_Y - 18;
				let scanTop = 18;
				let pixCount = 0;
				let yMem = yTop;
				while (yMem >= scanTop) {
					let c = getLandColor(x, yMem);
					if (Palette.compareColors(c, rgbDirt) || Palette.compareColors(c, rgbDirt2)) {
						pixCount++;
						setLandColor(x, yMem, rgbSky);
						memLine[pixCount] = c;
					}
					yMem--;
				}
				if (pixCount > 0) {
					for (let i = yTop - 1; i >= yTop - pixCount; --i) {
						setLandColor(x, i + 1, memLine[yTop - i]);
					}
				}
				if (yTop !== landTop[x]) {
					landTop[x] = yTop - pixCount + 1;
				}
			}
		}
		drawLandTop(landTop);
		updateGameImage()
	}

	function drawShot(x, y, rgbColor) {
		setLandColor(x, y, rgbColor);
	}

	function drawExplosionCircle(x, y, r, color) {
		circle(explosionsShape.graphics, color, x, y, r);
	}

	function clearExplosionCircle(x, y, r) {
		explosionsShape.graphics.clear();
		drawCircle(x, y, r, rgbSky);
	}

	function updateGameImage() {
		gameShape.updateCache();
	}

	function isGround(x, y) {
		let color = getLandColor(x, y);
		return (Palette.compareColors(color, rgbDirt) || Palette.compareColors(color, rgbDirt2));
	}

	function getLandColor(x, y) {
		if (x >= 0 && y >= 0 && x < gameImageData.width && y < gameImageData.height) {
	    	let data = gameImageData.data;
			let index = (x + y * gameImageData.width) * 4;
			return { r: data[index], g: data[index + 1], b: data[index + 2], a: data[index + 3]};
		}
	}

	function setLandColor(x, y, rgbColor) {
		if (x >= 0 && y >= 0 && x < gameImageData.width && y < gameImageData.height) {
	    	let data = gameImageData.data;
			let index = (x + y * gameImageData.width) * 4;
			data[index + 0] = rgbColor.r;
			data[index + 1] = rgbColor.g;
			data[index + 2] = rgbColor.b;
			data[index + 3] = rgbColor.a; 
		}
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
		drawBevel(shape, GameColors, 0, y, GET_MAX_X, y + 16);
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

			let parachuteShape = createParachuteShape();
			parachuteShape.visible = false;
			tankContainer.addChild(parachuteShape);

			tankContainer.visible = false;
			tanksContainer.addChild(tankContainer);

			let tankObj = {
				container: tankContainer,
				cannonShape: cannonShape,
				shieldShape: shieldShape,
				arrowShape: arrowShape,
				parachuteShape: parachuteShape
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

	function createParachuteShape() {
		let shape = new createjs.Shape();
/*
PX := PList[P].PosX;
      PY := PList[P].PosY;
      SetColor(C);
      Line(PX-2,PY-14,PX+2,PY-14);
      Line(PX-3,PY-12,PX-3,PY-13);
      Line(PX+3,PY-12,PX+3,PY-13);
      PutPixel(PX-2,PY-13,C);
      PutPixel(PX+2,PY-13,C);
      PutPixel(PX,PY-15,C);
      if C = White then SetColor(Gray);
      Line(PX-3,PY-11,PX-2,PY-3);
      Line(PX+3,PY-11,PX+2,PY-3);
*/		
		line(shape.graphics, GameColors.WHITE, -2, -14, 2, -14);
		line(shape.graphics, GameColors.WHITE, -3, -12, -3, -13);
		line(shape.graphics, GameColors.WHITE, 3, -12, 3, -13);
		putPixel(shape.graphics, GameColors.WHITE, -2, -13);
		putPixel(shape.graphics, GameColors.WHITE, 2, -13);
		putPixel(shape.graphics, GameColors.WHITE, 0, -15);
		line(shape.graphics, GameColors.GRAY, -3, -11, -2, -3);
		line(shape.graphics, GameColors.GRAY, 3, -11, 2, -3);
		return shape;
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

	function setTankParachuteVisibility(tankColor, visible) {
		let parachuteShape = tanks[tankColor].parachuteShape;
		parachuteShape.visible = visible;
	}

	function addExplosionDotToExplodingTankContainer(shape) {
		explodingTankContainer.addChild(shape);
	}

	function clearExplodingTankContainer() {
		explodingTankContainer.removeAllChildren();
	}

	function showWeaponsContainer(player, wepList) {
		weaponsContainer.removeAllChildren();

		// Weapons list
		let weaponsListContainer = new createjs.Container();

		let itemCount = Math.min(player.weaponList.length, 5);
		
		let x1 = GET_MAX_X - 360;
		let y1 = 20;
		let x2 = GET_MAX_X - 4;
		let y2 = y1 + 27 + itemCount * 10;

		weaponsListContainer.x = x1;
		weaponsListContainer.y = y1;
		showPCX(assets, weaponsListContainer, "weplist.pcx", 0, 0, x2 - x1, y2 - y1);
        
		let listBevelShape = new createjs.Shape();
		drawBevel(listBevelShape, GameColors, 0, 0, x2 - x1, y2 - y1);
	    weaponsListContainer.addChild(listBevelShape);

		outTextXY(weaponsListContainer, GameColors.DARKGRAY, "Weapon list:", 3, 4);
		drawFrame(weaponsListContainer, GameColors, 8, 18, x2 - x1 - 8, 19 + (itemCount * 10));

		weaponsListContentContainer = new createjs.Container();
		
		weaponsListContainer.addChild(weaponsListContentContainer);
		weaponsContainer.addChild(weaponsListContainer);

		// Description
		let weaponsDescriptionContainer = new createjs.Container();
		let x3 = x1;
		let y3 = y2 + 4;
		let x4 = x2;
		let y4 = y3 + 77;

		weaponsDescriptionContainer.x = x3;
		weaponsDescriptionContainer.y = y3;
		showPCX(assets, weaponsDescriptionContainer, "weplist.pcx", 0, 0, x4 - x3, y4 - y3);
		
		let descriptionBevelShape = new createjs.Shape();
		drawBevel(descriptionBevelShape, GameColors, 0, 0, x4 - x3, y4 - y3);
	    weaponsDescriptionContainer.addChild(descriptionBevelShape);

		outTextXY(weaponsDescriptionContainer, GameColors.DARKGRAY, "Description:", 3, 4);
		drawFrame(weaponsDescriptionContainer, GameColors, 8, 18, x2 - x1 - 66, y2 - y1 - 8);
		drawFrame(weaponsDescriptionContainer, GameColors, x2 - x1 - 60, 18, x2 - x1 - 8, y2 - y1 - 8);

		weaponsDescriptionContentContainer = new createjs.Container();
		
		weaponsDescriptionContainer.addChild(weaponsDescriptionContentContainer);
		weaponsContainer.addChild(weaponsDescriptionContainer);

		weaponsContainer.visible = true;
	}

	function updateWeaponsContainer(player, wepList, topIndex, bottomIndex, selectedIndex) {
		weaponsListContentContainer.removeAllChildren();
		for (var i = topIndex; i <= bottomIndex; i++)
		{
			let n = i - topIndex + 1;
			if (i == selectedIndex)
			{
				// bar(x[1]+9,y[1]+9+(10*N),x[2]-9,y[1]+18+(10*N));
				let selectionBar = new createjs.Shape();
				bar(selectionBar.graphics, GameColors.DARKESTGREEN, 9, 9 + (10 * n), 347, 18 + (10 * n));
				weaponsListContentContainer.addChild(selectionBar);
			}
			let weapon = wepList[player.weaponList[i].weaponIndex];
			let name = weapon.lname ?? weapon.name;
			let y = 10 + (10 * n);
			outTextXY(weaponsListContentContainer, GameColors.WHITE, name, 10, y);
			let ammo = player.weaponList[i].ammo;
			let amount = ammo == -1 ? 99 : ammo;
			outTextXY(weaponsListContentContainer, GameColors.WHITE, amount, 321 + (amount < 10 ? 8 : 0), y);
		}
		if (topIndex > 0)
		{
			outTextXY(weaponsListContentContainer, GameColors.WHITE, "▲", 338, 20);
		}
		if (bottomIndex < player.weaponList.length - 1)
		{
			outTextXY(weaponsListContentContainer, GameColors.WHITE, "▼", 338, 60);
		}
		let weapon = wepList[player.weaponList[selectedIndex].weaponIndex];
		updateWeaponsDescription(weapon);
	}

	function updateWeaponsDescription(weapon) {
		weaponsDescriptionContentContainer.removeAllChildren();
		let description = weapon.info1;
		let words = description.split(' ');
		var lines = [""];
		for (var i = 0; i < words.length; i++)
		{
			if (lines[lines.length - 1].length + words[i].length > 35)
			{
				lines.push("");
			}
			lines[lines.length - 1] += words[i] + ' ';
		}
		for (var i = 0; i < lines.length; i++)
		{
			outTextXY(weaponsDescriptionContentContainer, GameColors.WHITE, lines[i], 10, 20 + (10 * i));
		}
		showPCX(assets, weaponsDescriptionContentContainer, weapon.img, 297, 19, 50, 50);
	}

	function showRoundStatsPrimary(viewModel) {
		drawRoundStats(viewModel, false);
	}

	function showRoundStatsSecondary(viewModel) {
		drawRoundStats(viewModel, true);
	}

	function hideRoundStats() {
		roundStatsContainer.visible = false;
		roundStatsContainer.removeAllChildren();
	}

	function drawRoundStats(viewModel, isSecondary) {
		roundStatsContainer.removeAllChildren();
		roundStatsContainer.visible = true;
		let layout = drawRoundStatsBase(viewModel);
		if (isSecondary) {
			drawSecondaryStatsBox(layout.topBox, viewModel.roundRows, true);
			drawSecondaryStatsBox(layout.bottomBox, viewModel.overallRows, false);
		}
		else {
			drawPrimaryStatsBox(layout.topBox, viewModel.roundRows, true);
			drawPrimaryStatsBox(layout.bottomBox, viewModel.overallRows, false);
		}
		drawRoundStatsHint(viewModel.hintText, layout.bottomBox.y2);
	}

	function drawRoundStatsBase(viewModel) {
		let xa1 = Math.floor(GET_MAX_X / 2) - 312;
		let ya1 = Math.floor(GET_MAX_Y / 2) - 216;
		let xa2 = xa1 + 624;
		let ya2 = ya1 + 210;
		let xb1 = xa1;
		let yb1 = Math.floor(GET_MAX_Y / 2) + 6;
		let xb2 = xb1 + 624;
		let yb2 = yb1 + 210;

		drawBox(assets, roundStatsContainer, GameColors, xa1, ya1, xa2, ya2);
		drawBox(assets, roundStatsContainer, GameColors, xb1, yb1, xb2, yb2);

		let shadow = new createjs.Shape();
		line(shadow.graphics, GameColors.DARKGRAY, xa1 + 2, ya2 + 1, xa2 + 2, ya2 + 1);
		line(shadow.graphics, GameColors.DARKGRAY, xa1 + 2, ya2 + 2, xa2 + 2, ya2 + 2);
		line(shadow.graphics, GameColors.DARKGRAY, xa2 + 1, ya1 + 2, xa2 + 1, ya2 + 2);
		line(shadow.graphics, GameColors.DARKGRAY, xa2 + 2, ya1 + 2, xa2 + 2, ya2 + 2);
		line(shadow.graphics, GameColors.DARKGRAY, xb1 + 2, yb2 + 1, xb2 + 2, yb2 + 1);
		line(shadow.graphics, GameColors.DARKGRAY, xb1 + 2, yb2 + 2, xb2 + 2, yb2 + 2);
		line(shadow.graphics, GameColors.DARKGRAY, xb2 + 1, yb1 + 2, xb2 + 1, yb2 + 2);
		line(shadow.graphics, GameColors.DARKGRAY, xb2 + 2, yb1 + 2, xb2 + 2, yb2 + 2);
		roundStatsContainer.addChild(shadow);

		drawFrame(roundStatsContainer, GameColors, xa1 + 10, ya1 + 20, xa2 - 10, ya2 - 10);
		drawFrame(roundStatsContainer, GameColors, xb1 + 10, yb1 + 20, xb2 - 10, yb2 - 10);

		outTextXY(roundStatsContainer, GameColors.DARKGRAY, viewModel.roundTitle, Math.floor(GET_MAX_X / 2), ya1 + 6, "center");
		outTextXY(roundStatsContainer, GameColors.DARKGRAY, viewModel.overallTitle, Math.floor(GET_MAX_X / 2), yb1 + 6, "center");

		return {
			topBox: { x1: xa1, y1: ya1, x2: xa2, y2: ya2 },
			bottomBox: { x1: xb1, y1: yb1, x2: xb2, y2: yb2 }
		};
	}

	function drawPrimaryStatsBox(box, rows, isRound) {
		let headerText = isRound
			? "Rank                         Points   Income   Shots  Hits  Misses  Frags"
			: "Rank                         Points   Balance  Shots  Hits  Misses  Frags";

		let headerShape = new createjs.Shape();
		bar(headerShape.graphics, GameColors.DARKBLUE, box.x1 + 11, box.y1 + 21, box.x2 - 11, box.y1 + 33);
		roundStatsContainer.addChild(headerShape);
		outTextXY(roundStatsContainer, GameColors.WHITE, headerText, box.x1 + 13, box.y1 + 24);
		outTextXY(roundStatsContainer, GameColors.WHITE, "Name", box.x1 + 56, box.y1 + 24);

		for (let i = 1; i <= 8; ++i) {
			let rowShape = new createjs.Shape();
			bar(rowShape.graphics, GameColors.DARKGRAY, box.x1 + 11, box.y1 + 20 + 20 * i, box.x2 - 11, box.y1 + 32 + 20 * i);
			roundStatsContainer.addChild(rowShape);
		}

		for (let i = 0; i < rows.length; ++i) {
			let row = rows[i];
			let rowY = box.y1 + 23 + 20 * (i + 1);
			outTextXY(roundStatsContainer, GameColors.WHITE, row.rank + ".", box.x1 + 23, rowY, "left", GameColors.BLACK);
			outTextXY(roundStatsContainer, row.color, row.name, box.x1 + 56, rowY, "left", GameColors.BLACK);
			outTextXY(roundStatsContainer, GameColors.WHITE, row.statsText, box.x1 + 253, rowY, "left", GameColors.BLACK);
		}
	}

	function drawSecondaryStatsBox(box, rows) {
		let headerShape = new createjs.Shape();
		bar(headerShape.graphics, GameColors.DARKBLUE, box.x1 + 11, box.y1 + 21, box.x2 - 11, box.y1 + 33);
		roundStatsContainer.addChild(headerShape);
		outTextXY(roundStatsContainer, GameColors.WHITE, "Rank                    Dam. given (of total)  Damage  Dam/shot  Headshots", box.x1 + 13, box.y1 + 24);
		outTextXY(roundStatsContainer, GameColors.WHITE, "Name", box.x1 + 56, box.y1 + 24);

		for (let i = 1; i <= 8; ++i) {
			let rowShape = new createjs.Shape();
			bar(rowShape.graphics, GameColors.DARKGRAY, box.x1 + 11, box.y1 + 20 + 20 * i, box.x2 - 11, box.y1 + 32 + 20 * i);
			roundStatsContainer.addChild(rowShape);
		}

		for (let i = 0; i < rows.length; ++i) {
			let row = rows[i];
			let rowY = box.y1 + 23 + 20 * (i + 1);
			outTextXY(roundStatsContainer, GameColors.WHITE, row.rank + ".", box.x1 + 23, rowY, "left", GameColors.BLACK);
			outTextXY(roundStatsContainer, row.color, row.name, box.x1 + 56, rowY, "left", GameColors.BLACK);
			drawDamageBar(box.x1 + 207, box.y1 + 24 + 20 * (i + 1), row.barLength, row.color, row.secColor);
			outTextXY(roundStatsContainer, GameColors.WHITE, row.percentText, box.x1 + 214 + row.barLength, rowY, "left");
			outTextXY(roundStatsContainer, GameColors.WHITE, row.damageText, box.x1 + 380, rowY);
			outTextXY(roundStatsContainer, GameColors.WHITE, row.damPerShotText, box.x1 + 452, rowY);
			outTextXY(roundStatsContainer, GameColors.WHITE, row.headshotsText, box.x1 + 532, rowY);
		}
	}

	function drawDamageBar(x, y, length, color, secColor) {
		let shape = new createjs.Shape();
		bar(shape.graphics, color, x, y, x + length, y + 5);
		if (length > 0) {
			line(shape.graphics, GameColors.BRIGHTGRAY, x, y, x + length, y);
			line(shape.graphics, secColor, x, y + 5, x + length, y + 5);
			line(shape.graphics, secColor, x + length, y, x + length, y + 5);
		}
		roundStatsContainer.addChild(shape);
	}

	function drawRoundStatsHint(text, yBase) {
		let x1 = Math.floor(GET_MAX_X / 2) - 250;
		let y1 = yBase + 4;
		let x2 = x1 + 500;
		let y2 = y1 + 16;
		let shadow = new createjs.Shape();
		bar(shadow.graphics, GameColors.DARKGRAY, x1 + 2, y1 + 2, x2 + 2, y2 + 2);
		roundStatsContainer.addChild(shadow);
		drawBox(assets, roundStatsContainer, GameColors, x1, y1, x2, y2);
		outTextXY(roundStatsContainer, GameColors.DARKGRAY, text, Math.floor(GET_MAX_X / 2), y1 + 4, "center");
	}

	function hideWeaponsContainer() {
		weaponsContainer.visible = false;
	}
}