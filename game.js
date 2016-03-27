"use strict";

function createGame(onExit, assets) {
	var dirtColor = GameColors.BROWN;
	var dirtColor2 = GameColors.DARKESTBROWN;
	var noWind = false; // TODO: Get from config (on/off)
	var wind = 0; // will be set in updateWind()
	// TODO: Move to a player array:
	var armour = 0;
	var parachutes = 0;
	var shield = true;
	var name = "p";
	var playerColor = GameColors.BLUE;
	var power = 800;
	var maxPower = 1000;
	var angle = 45;

	var windShape = null;
	var armourText = null;
	var parachutesText = null;
	var shieldText = null;
	var nameText = null;
	var powerText = null;
	var angleText = null;
	var mainContainer = new createjs.Container();

	var sky = createSky();
	mainContainer.addChild(sky);

	var topMenu = createTopMenu();
	mainContainer.addChild(topMenu);

	var bottomMenu = createBottomMenu();
	mainContainer.addChild(bottomMenu);

	return {
		container: mainContainer,
		onTick: onTick,
		onShow: onShow
	}

	function createSky() {
		var sky = new createjs.Shape();
		sky.graphics.beginFill(GameColors.SKY).drawRect(0, 0, GET_MAX_X, GET_MAX_Y).endFill();
		return sky;
	}

	function onShow() {
		var landTop = generateLand();
		var shape = drawLand(landTop);
		mainContainer.addChild(shape);
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

	function drawLand(landTop) {
  		var shape = new createjs.Shape();
		var dirtRGB = Palette.getRGBFromColor(dirtColor);
		var dirtRGB2 = Palette.getRGBFromColor(dirtColor2);
		shape.graphics.append({exec:function(ctx, shape) {
        	var imageData = ctx.getImageData(0,0,GET_MAX_X, GET_MAX_Y);
        	var data = imageData.data;
			for (var x = 2; x <= GET_MAX_X - 2; ++x) {
				for (var y = landTop[x] + 1; y <= GET_MAX_Y - 18; ++y) {
					var r = (GET_MAX_Y - y + landTop[x]) / 70;
					if (r < 1) {
						r = (1 / r);
					}
					var rr = Math.round(r);
					if (rr <= 1) {
						rr = 2;
					}
					var rgb = (Math.floor(Math.random() * rr) === 0) ? dirtRGB2 : dirtRGB;
					var index = (x + y * GET_MAX_X) * 4;
					data[index + 0] = rgb.r;
					data[index + 1] = rgb.g;
					data[index + 2] = rgb.b;
					data[index + 3] = 0xFF; 
				}
			}
			ctx.putImageData(imageData, 0, 0);
    	}});
		for (var x = 2; x <= GET_MAX_X - 2; ++x) {
			line(shape.graphics, dirtColor2, x - 1, landTop[x - 1], x, landTop[x]);
		}
		shape.cache(0, 0, GET_MAX_X, GET_MAX_Y);
		shape.graphics.store();
		return shape;
	}

	function createTopMenu() {
		var container = createMenuBars(0);
	    drawFrame(container, GameColors, 57, 3, 130, 13);
	    drawFrame(container, GameColors, 188, 3, 222, 13);
	    drawFrame(container, GameColors, GET_MAX_X - 26, 3, GET_MAX_X - 8, 13);
	    drawFrame(container, GameColors, GET_MAX_X - 192, 3, GET_MAX_X - 30, 13);

		outTextXY(container, GameColors.DARKGRAY, "Power:", 8, 5);
		outTextXY(container, GameColors.DARKGRAY, "Angle:", 140, 5);
		outTextXY(container, GameColors.DARKGRAY, "Weapon:", GET_MAX_X - 248, 5);

		nameText = outTextXYAsText(playerColor, name, SCREEN_WIDTH_CENTER, 4, "center");
		nameText.shadow = new createjs.Shadow(getPlayerNameShadow(playerColor), 1, 1, 0);
		container.addChild(nameText);

		powerText = outTextXYAsText(GameColors.WHITE, power + "/" + maxPower, 58 + 8 * 9 /*"MakeSpaces" Calculation*/, 5, "right");
		container.addChild(powerText);

		// TODO:
		//angleText = outTextXYAsText(GameColors.WHITE, angle, 58 + 8 * 9 /*"MakeSpaces" Calculation*/, 5, "right");
		//container.addChild(powerText);

		return container;
	}

	function getPlayerNameShadow(playerColor) {
		/*
	    if (C <> Gray) and (C <> DarkMagenta) and (C <> DarkGreen) and
	       (C <> DarkBrown) and (C <> Blue) and (C <> Red) and (C <> Magenta) then
			SetColor(Gray)
		else
			SetColor(DarkGray);
*/
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
		var container = createMenuBars(GET_MAX_Y - 16);
	    drawFrame(container, GameColors, 64, GET_MAX_Y - 13, 98, GET_MAX_Y - 3);
	    drawFrame(container, GameColors, 200, GET_MAX_Y - 13, 210, GET_MAX_Y - 3);
	    drawFrame(container, GameColors, 312, GET_MAX_Y - 13, 340, GET_MAX_Y - 3);

		outTextXY(container, GameColors.DARKGRAY, "Armour:", 8, GET_MAX_Y - 11);
		outTextXY(container, GameColors.DARKGRAY, "Parachutes:", 112, GET_MAX_Y - 11);
		outTextXY(container, GameColors.DARKGRAY, "Mag.Shield:", 224, GET_MAX_Y - 11);

		armourText = outTextXYAsText(GameColors.WHITE, armour, 66 + 8 * 4 /*"MakeSpaces" Calculation*/, GET_MAX_Y - 11, "right");
		container.addChild(armourText);

		parachutesText = outTextXYAsText(GameColors.WHITE, parachutes, 202, GET_MAX_Y - 11);
		container.addChild(parachutesText);

		shieldText = outTextXYAsText(shield ? GameColors.WHITE : GameColors.LIGHTGRAY, shield ? "On" : "Off", 314, GET_MAX_Y - 11);
		container.addChild(shieldText);

		var wind = createWind();
		container.addChild(wind);
		return container;
	}


	function createMenuBars(y) {
		var container = new createjs.Container();
        showPCX(assets, container, "bar.pcx", 0, y, GET_MAX_X, 16);
        var shape = new createjs.Shape();
	    line(shape.graphics, GameColors.WHITE, 0, y, GET_MAX_X, y);
	    line(shape.graphics, GameColors.WHITE, 0, y, 0, y + 16);
	    line(shape.graphics, GameColors.GRAY, 0, y + 16, GET_MAX_X, y + 16);
	    line(shape.graphics, GameColors.GRAY, GET_MAX_X, y + 16, GET_MAX_X, y);
	    container.addChild(shape);
	    return container;
	}

	function createWind() {
		var container = new createjs.Container();
		var x = GET_MAX_X - 90;
		var y = GET_MAX_Y - 11;
		outTextXY(container, GameColors.DARKGRAY, "Wind:", x - 42, y);
		drawFrame(container, GameColors, x - 1, y, x + 82, y + 7);

		windShape = new createjs.Shape();
		updateWind(windShape);
		container.addChild(windShape);
		return container;
	}

	function updateWind(windShape) {
		wind = noWind ? 0 : Math.floor(Math.random() * 41) - 20;

		var doubleWind = wind * 2;
		var x = GET_MAX_X - 90;
		var y = GET_MAX_Y - 11;
		bar(windShape.graphics, GameColors.BLUE, x + 41 + doubleWind, y + 2, x + 41, y + 5);
		line(windShape.graphics, GameColors.MEDBLUE, x + 41 + doubleWind, y + 5, x + 41, y + 5);
		var color = doubleWind < 0 ? GameColors.BRIGHTBLUE : GameColors.MEDBLUE;
		line(windShape.graphics, color, x + 41 + doubleWind, y + 2, x + 41 + doubleWind, y + 5);
		line(windShape.graphics, GameColors.BRIGHTBLUE, x + 41 + doubleWind, y + 2, x + 41, y + 2);
		line(windShape.graphics, GameColors.WHITE, x + 41, y + 1, x + 41, y + 6);
	}

	function onTick(stage, deltaInSeconds) {
	}

}