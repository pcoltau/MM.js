"use strict";

function createGame(onExit, assets) {
	var dirtColor = GameColors.BROWN;
	var dirtColor2 = GameColors.DARKESTBROWN;
	var mainContainer = new createjs.Container();

	var sky = createSky();
	mainContainer.addChild(sky);

	return {
		container: mainContainer,
		onTick: onTick,
		onShow: onShow
	}

	function createSky() {
		var sky = new createjs.Shape();
		sky.graphics.beginFill(GameColors.SKY).drawRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT).endFill();
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
		var dirtRGB = Palette.getRGBFromColor(dirtColor);
		var dirtRGB2 = Palette.getRGBFromColor(dirtColor2);
		shape.graphics.append({exec:function(ctx, shape) {
        	var imageData = ctx.getImageData(0,0,SCREEN_WIDTH, SCREEN_HEIGHT);
        	var data = imageData.data;
			for (var x = 2; x <= SCREEN_WIDTH - 2; ++x) {
				for (var y = landTop[x] + 1; y <= SCREEN_HEIGHT - 18; ++y) {
					var r = (SCREEN_HEIGHT - y + landTop[x]) / 70;
					if (r < 1) {
						r = (1 / r);
					}
					var rr = Math.round(r);
					if (rr <= 1) {
						rr = 2;
					}
					var rgb = (Math.floor(Math.random() * rr) === 0) ? dirtRGB2 : dirtRGB;
					var index = (x + y * SCREEN_WIDTH) * 4;
					data[index + 0] = rgb.r;
					data[index + 1] = rgb.g;
					data[index + 2] = rgb.b;
					data[index + 3] = 0xFF; 
				}
			}
			ctx.putImageData(imageData, 0, 0);
    	}});
		for (var x = 2; x <= SCREEN_WIDTH - 2; ++x) {
			line(shape.graphics, dirtColor2, x - 1, landTop[x - 1], x, landTop[x]);
		}
		shape.cache(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
		shape.graphics.store();
		return shape;
	}

	function onTick(stage, deltaInSeconds) {
	}

}