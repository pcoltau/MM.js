"use strict";

function createGame(onExit, assets) {
	var dirtColor = GameColors.BROWN;
	var dirtColor2 = GameColors.DARKESTBROWN;
	var mainContainer = new createjs.Container();

	var sky = createSky();
	mainContainer.addChild(sky);

	return {
		container: mainContainer,
		onShow: onShow
	}

	function createSky() {
		var sky = new createjs.Shape();
		sky.graphics.beginFill(GameColors.SKY).drawRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT).endFill();
		return sky;
	}

	function onShow() {
		var landTop = generateLand();
		for (var i = 0; i < landTop.length; ++i) {
			console.log(i + ": " + landTop[i]);
		}
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
		var startY = Math.floor(Math.random() * SCREEN_HEIGHT_CENTER) + Math.floor(SCREEN_HEIGHT / 3) + 10;
		var endX = 0;
		var endY = 0;
		do {
			breaks.push({x: startX, y: startY});
			var smoothness = Math.floor(Math.random() * halfLandSmooth) + halfLandSmooth;
			endX = Math.floor(Math.random() * Math.floor(SCREEN_WIDTH / landComplex)) + startX + 10;
			endY = Math.floor(Math.random() * Math.floor(SCREEN_HEIGHT / smoothness)) - Math.floor(SCREEN_HEIGHT / (smoothness * 2)) + startY;
			endX = Math.min(endX, SCREEN_WIDTH - 2);
			endY = Math.max(Math.min(endY, SCREEN_HEIGHT - 18), 75);
			startX = endX;
			startY = endY;
		} while (endX < SCREEN_WIDTH - 2);
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
		shape.graphics.beginStroke()
		for (var x = 2; x <= SCREEN_WIDTH - 2; ++x) {
			for (var y = landTop[x] + 1; y <= SCREEN_HEIGHT - 18; ++y) {
				var r = (SCREEN_HEIGHT - y + landTop[x]) / 70;
				if (r < 1) {
					r = (1 / r);
				}
				if (Math.round(r) <= 1) {
					r = 2;
				}
				var color = (Math.floor(Math.random() * Math.round(r)) === 0) ? dirtColor2 : dirtColor;
				// TODO: This is _very_ slow! I think it's because we are creating thousands of small lines/strokes. Perhaps if we somehow used a "dashed" stroke, it would be faster? (see http://www.createjs.com/docs/easeljs/classes/Graphics.html#method_setStrokeDash)
				putPixel(shape.graphics, color, x, y);
			}
		}
		for (var x = 2; x <= SCREEN_WIDTH - 2; ++x) {
			// TODO: This create a weird line (more notificiable if the putPixel code above is commented out)
			line(shape.graphics, dirtColor2, x - 1, landTop[x - 1], x, landTop[x]);
		}
		return shape;
	}
}