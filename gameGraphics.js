"use strict";

function createGameGraphics(assets, weapons) {
	var dirtColor = GameColors.BROWN;
	var dirtColor2 = GameColors.DARKESTBROWN;

	var windShape = null;
	var armourText = null;
	var parachutesText = null;
	var shieldText = null;
	var nameText = null;
	var powerText = null;
	var angleText = null;
	var weaponNameText = null;
	var weaponAmmoText = null;
	var guidanceContainer = null;
	var guidanceShape = null;
	var landContainer = null;
	var tanks = {}; // all 8 tanks, {color:{container, cannonShape, shieldShape} 

	var mainContainer = new createjs.Container();

	var sky = createSky();
	mainContainer.addChild(sky);

	// the container for the land that will be generated later	(in onShow or whenever a new round is started)
	var landContainer = new createjs.Container();
	mainContainer.addChild(landContainer);

	var topMenu = createTopMenu();
	mainContainer.addChild(topMenu);

	var bottomMenu = createBottomMenu();
	mainContainer.addChild(bottomMenu);

	var screenEdges = createScreenEdges();
	mainContainer.addChild(screenEdges);

	var tanksContainer = createTanks();
	mainContainer.addChild(tanksContainer);

	return {
		container: mainContainer,
		updateOverviewAfterCurrentPlayerChange: updateOverviewAfterCurrentPlayerChange,
		updateWind: updateWind,
		drawLand: drawLand,
		updateTankPosition: updateTankPosition,
		updateCannonAngle: updateCannonAngle,
		showTank: showTank,
		hideTank: hideTank
		//showGuidance:	
	};

	function drawLand(landTop) {
  		var landShape = new createjs.Shape();
  		// magic to compensate for the snapToPixel magic we do on the stage in gameEngine.js
  		landShape.regX = 0.5; 
  		landShape.regY = 0.5;
		var dirtRGB = Palette.getRGBFromColor(dirtColor);
		var dirtRGB2 = Palette.getRGBFromColor(dirtColor2);
		landShape.graphics.append({exec:function(ctx, shape) {
        	var imageData = ctx.createImageData(GET_MAX_X, GET_MAX_Y);
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
		landShape.cache(0, 0, GET_MAX_X, GET_MAX_Y);
		landShape.graphics.store();
		landContainer.addChild(landShape);
  		var landTopShape = new createjs.Shape();
		for (var x = 3; x <= GET_MAX_X - 2; ++x) {
			line(landTopShape.graphics, dirtColor2, x - 1, landTop[x - 1], x, landTop[x]);
		}
		landContainer.addChild(landTopShape);
	}

	function updateOverviewAfterCurrentPlayerChange(newPlayer) {
		updatePlayerNameText(newPlayer);
		updateAngleText(newPlayer);
		updatePowerText(newPlayer);
		updateWeaponNameText(newPlayer);
		updateWeaponAmmoText(newPlayer);
		updateArmourText(newPlayer);
		updateParachutesText(newPlayer);
		updateShieldText(newPlayer);
	}

	function createSky() {
		var sky = new createjs.Shape();
		sky.graphics.beginFill(GameColors.SKY).drawRect(0, 0, GET_MAX_X, GET_MAX_Y).endFill();
		return sky;
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
		var angle = player.angle
		angleText.text = Math.round(angle * (180 / Math.PI)) + " " + ((angle > Math.PI / 2) ? "L" : "R");
	}

	function updateWeaponAmmoText(player) {
		var ammo = player.weaponList[player.currentWep].ammo;
		weaponAmmoText.text = (ammo == -1 ? 99 : ammo);
	}

	function updateWeaponNameText(player) {
		var weaponName = weapons[player.weaponList[player.currentWep].weaponIndex].name;
		weaponNameText.text = weaponName;
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

		armourText = outTextXYAsText(GameColors.WHITE, "", 66 + 8 * 4 /*"MakeSpaces" Calculation*/, GET_MAX_Y - 11, "right");
		container.addChild(armourText);

		parachutesText = outTextXYAsText(GameColors.WHITE, "", 202, GET_MAX_Y - 11);
		container.addChild(parachutesText);

		shieldText = outTextXYAsText(GameColors.WHITE, "", 314, GET_MAX_Y - 11);
		container.addChild(shieldText);

		var wind = createWind();
		container.addChild(wind);

		// we don't add the guidance yet
		guidanceContainer = createGuidance();
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

	function updateWind(wind) {
		windShape.graphics.clear();

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

	function createGuidance() {
		var container = new createjs.Container();
		outTextXY(container, GameColors.DARKGRAY, "Guid. Fuel:", 354, GET_MAX_Y - 11);
		drawFrame(container, GameColors, 442, GET_MAX_Y - 11, 495, GET_MAX_Y - 4);

		guidanceShape = new createjs.Shape();
		container.addChild(guidanceShape);
		return container;
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
		var shape = new createjs.Shape();
		rectangle(shape.graphics, GameColors.MAGENTA, 0, 17, GET_MAX_X, GET_MAX_Y - 17);
		rectangle(shape.graphics, GameColors.DARKMAGENTA, 1, 18, GET_MAX_X - 1, GET_MAX_Y - 18);
		return shape;
	}

	function createTanks() {
		var tanksContainer = new createjs.Container();
		for (var i = 0; i < 8; ++i) {
			var tankContainer = new createjs.Container();
			var tankShape = new createjs.Shape();
			var color = playerColorTable[i];
			var secColor = playerColorTable[i+8];
			// in this way, the tankContainer.x and y can be places precisely at the tank position
			tankShape.regX = 3;
			tankShape.regY = 2;

			bar(tankShape.graphics, color, 0, 0, 6, 3);
			putPixel(tankShape.graphics, secColor, 0, 0);
			putPixel(tankShape.graphics, secColor, 6, 0);
			tankContainer.addChild(tankShape);

			var cannonShape = new createjs.Shape();
			 // in this way, the tankContainer.x and y can be places precisely at the tank position
			cannonShape.regX = 0;
			cannonShape.regY = 3;
			tankContainer.addChild(cannonShape);

			tankContainer.visible = false;
			tanksContainer.addChild(tankContainer);

			var tankObj = {
				container: tankContainer,
				cannonShape: cannonShape,
				shieldShape: null // TODO
			}

			tanks[color] = tankObj;
		}
		return tanksContainer;
	}

	function updateTankPosition(tankColor, x, y) {
		var tankContainer = tanks[tankColor].container;
		tankContainer.x = x;
		tankContainer.y = y; 

		var shape = new createjs.Shape();
		putPixel(shape.graphics, GameColors.WHITE, x, y);
		mainContainer.addChild(shape);
	}

	function updateCannonAngle(player) {
		var cannonShape = tanks[player.color].cannonShape;
/*
  px := PList[P].PosX;
  py := PList[P].PosY;
  if C = Black then C := Sky;
  SetColor(C);
  Line(px,
       py-3,
       round(Cos(PList[P].Angle)*5)+px,
       -round(Sin(PList[P].Angle)*5)+py-3);
  if (PList[P].Shield) then
  begin
    if (C <> Sky) then SetColor(LightGray) else SetColor(Sky);
    line(px-2,py-12,px+2,py-12);
    line(px-2,py-12,px-5,py-10);
    line(px+2,py-12,px+5,py-10);
    if (C <> Sky) then SetColor(Gray);
    line(px-1,py-10,px+1,py-10);
    line(px-1,py-10,px-4,py-9);
    line(px+1,py-10,px+4,py-9);
  end;
*/
		cannonShape.graphics.clear();
		line(cannonShape.graphics, GameColors.WHITE, 0, 0, Math.round(Math.cos(player.angle) * 5), -Math.round(Math.sin(player.angle) * 5));
	}

	function showTank(tankColor) {
		var tankContainer = tanks[tankColor].container;
		tankContainer.visible = true;
	}

	function hideTank(tankColor) {
		var tankContainer = tanks[tankColor].container;
		tankContainer.visible = false;
	}
}