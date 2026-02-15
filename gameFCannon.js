"use strict";

function fireCannon(weapon, players, currentPlayerIndex, wind, landTop, gameGraphics, fireCannonDone) {
	let States = { FLYING: 0, ROLLING: 1, EXPLODING: 2}; // This is not a per-shot state, as the whole game goes into rolling/exploding when a shot hits ground.
	let currentState = States.FLYING; 

	// Weapons without leaps does not have the leaps value - this fixes that. 
	if (!weapon.leaps) {
		weapon.leaps = 1;
	}

	let fastShot = false; // TODO: Get from config
	let tracers = true; // TODO: get from config
	let traceColorAsTank = true; // TODO: get from config

	// Timing constants
	let milliSecondsBetweenShotMovement = fastShot ? 1 : 4;
	let milliSecondsBetweenExplosionExpansion = 8;
	let milliSecondsBetweenRolling = 15;
	let timeCounter = 0;

	let rgbSky = Palette.getRGBFromColor(GameColors.SKY);
	let rgbDarkGray = Palette.getRGBFromColor(GameColors.DARKGRAY);
	let rgbYellow = Palette.getRGBFromColor(GameColors.YELLOW);

	let currentPlayer = players[currentPlayerIndex];

	let guiBar = (weapon.class === "guiding") ? 50 : 0;
	let divided = (weapon.class === "multishot" || weapon.class === "guiding");
	let shotCount = (weapon.class === "multishot") ? weapon.shots : 1;
	let leapCount = (weapon.class === "leap") ? weapon.leaps : 1;
	let fuel = (weapon.class === "guiding") ? 50 : 0;
	let glevel = (weapon.class === "guiding") ? weapon.shots : 0;
	let exNum = 0; // TODO: Necessary?
	let maxYReached = false;
	let currentLeap = 0;
	let currentShot = 0;
	let shots = [];
	let hole = Array(SCREEN_WIDTH).fill(false); // used to indicate which x coordinates to update when "moving dirt"

	if (weapon.class === "guiding") {
		gameGraphics.showGuidance()
		gameGraphics.updateGuidance(guiBar);
	}

	let lv =  currentPlayer.power / 650;
	let ay = 0.001;
	let ax = (wind / 100000);

	for (let i = 0; i < shotCount; ++i) {
		shots[i] = [];
		let shot = createNewShot();
		shot.px = Math.round(Math.cos(currentPlayer.angle) * 6) + currentPlayer.posX;
		shot.py = -Math.round(Math.sin(currentPlayer.angle) * 6) + currentPlayer.posY - 3;
		shot.vx = Math.cos(currentPlayer.angle) * (lv - i / 25);
		shot.vy = -Math.sin(currentPlayer.angle) * (lv - i / 25);
		shot.lv = lv;

		shots[i][0] = shot; // [shotNum, leapNum]
	}

	if (weapon.class === "nitro") {
		if (weapon.dam * lv > 25) {
			shotCount = 1;
			exNum = 1;
			shots[0][0].dead = true;
			impact(shots[0][0]);
		}
	}

	return {
		onTick: onTick
	};

	function createNewShot() {
		return {
			px: 0,
			py: 0,
			vx: 0.0,
			vy: 0.0,
			lv: 0.0,
			exp: 0,
			rollingDir: 0,
			divided: false,
			dead: false,
			miss: true // TODO: Used?
		};
	}

	function onTick(stage, deltaInSeconds) {
		timeCounter += deltaInSeconds * 1000;
		switch (currentState) {
			case States.FLYING: {
				let shotMovementIterations = Math.floor(timeCounter / milliSecondsBetweenShotMovement);
				timeCounter = timeCounter % milliSecondsBetweenShotMovement;
				let exitIterations = false;
				for (let j = 0; j < shotMovementIterations && !exitIterations; ++j) {
					// cycle through all shots
					for (let i = 0; i < shotCount && !exitIterations; ++i) {
						let shot = shots[currentShot][currentLeap];
						if (!shot.dead) {
							let wasDivided = shot.divided;
							moveShot(shot);
							if (shot.dead) {
								exNum++;
								exitIterations = true
								impact(shot);
								timeCounter = 0;
							}
							else if (shot.divided && !wasDivided) {
								exitIterations = true;
							}
						}
						if (!exitIterations) {
							currentShot++;
							if (currentShot == shotCount) {
								currentShot = 0;
							}
						}
					}
				}
				break;
			}
			case States.ROLLING: {
				let shotRollingIterations = Math.floor(timeCounter / milliSecondsBetweenRolling);
				timeCounter = timeCounter % milliSecondsBetweenRolling;
				let shot = shots[currentShot][currentLeap];
				for (let j = 0; j < shotRollingIterations; ++j) {
					if (moveRoller(shot)) {
						shot.dead = true;
						currentState = States.EXPLODING;
					}
				}
				break;
			}
			case States.EXPLODING: {
				let shotExplosionIterations = Math.floor(timeCounter / milliSecondsBetweenExplosionExpansion);
				timeCounter = timeCounter % milliSecondsBetweenExplosionExpansion;
				let shot = shots[currentShot][currentLeap];
				for (let j = 0; j < shotExplosionIterations; ++j) {
					if (explode(shot)) {
						timeCounter = 0;
						if (currentLeap < leapCount - 1) {
							gameGraphics.drawShot(Math.round(shot.px), Math.round(shot.py), rgbYellow);
						}
						nextShotOrFinishIsShooting(shot)
						currentState = States.FLYING;
						break;
					}
				}
				break;
			}
		}
		gameGraphics.updateGameImage();
	}

	function explode(shot) {
		let x = Math.round(shot.px);
		let y = Math.round(shot.py);

		if (x + shot.exp < GET_MAX_X - 1) {
			hole[x + shot.exp] = true;
		}
		if (x - shot.exp > 1) {
			hole[x - shot.exp] = true;
		}

		// TODO: if SoundOn then sound(random(100));
		gameGraphics.drawExplosionCircle(x, y, shot.exp, ExplosionColors[Math.round((shot.exp / weapon.dam) * ExplosionColors.length)]);

		if (shot.exp < weapon.dam) {
			shot.exp++;
			return false;
		}
		else {
			gameGraphics.clearExplosionCircle(x, y, weapon.dam);
			return true
		}
	}

	function nextShotOrFinishIsShooting(shot) {
		let allDead = true;
		for (let i = 0; i < shotCount; ++i) {
			let shotAtIndex = shots[currentShot][currentLeap];
			if (!shotAtIndex.dead) {
				allDead = false;
				break;
			}
			currentShot++;
			if (currentShot == shotCount) {
				currentShot = 0;
			}
		}
		if (allDead) {
			// next leap, if any
			currentLeap++;
			if (currentLeap === leapCount || weapon.class === "nitro") {
				if (weapon.class === "guiding") {
					gameGraphics.hideGuidance()
				}
				fireCannonDone(hole, shots, weapon);
			}
			else {
				currentShot = 0;
				exNum = 0;
				for (let i = 0; i < shotCount; ++i) {
					let lv = shots[i][currentLeap - 1].lv * 0.85;
					let newShot = createNewShot();
					newShot.px = Math.round(shots[i][currentLeap - 1].px);
					newShot.py = Math.round(shots[i][currentLeap - 1].py);
					newShot.lv = lv;
					newShot.vx = Math.cos(Math.random() * Math.PI) * lv;
					newShot.vy = -Math.sin(Math.random() * Math.PI) * lv;

					shots[i][currentLeap] = newShot;
				}
			}
		}
	}

	function impact(shot) {
		if (weapon.class === "roller") {
			// remove the shot and start rolling
			let roundedX = Math.round(shot.px);
			let roundedY = Math.round(shot.py);
			gameGraphics.drawShot(roundedX, roundedY, rgbSky);
			shot.py = landTop[roundedX] - 1;
			currentState = States.ROLLING;
		}
		else {
			currentState = States.EXPLODING;
		}
	}

	function moveRoller(shot) {
		let roundedX = Math.round(shot.px);
		let roundedY = Math.round(shot.py);

		function checkRightOrLeft(left) {
			let i = 0;
			while (landTop[roundedX + i] - 1 === roundedY && Math.abs(i) < 20) {
				i = i + (left ? -1 : 1);
			}
			if (Math.abs(i) === 20) {
				return 0;
			}
			else if (landTop[roundedX + i] - 1 < roundedY) {
				return -1;
			}
			else {
				return 1;
			}
		}

		gameGraphics.drawShot(roundedX, roundedY, rgbSky);
		let yr = checkRightOrLeft(false);
		let yl = checkRightOrLeft(true);
		let dir = 0;
		if (yr > yl) {
			dir = 1;
		}
		if (yr < yl) {
			dir = -1;
		}
		let flatGround = (yr === yl);
		let directionChanged = (shot.rollingDir !== 0 && dir !== shot.rollingDir);
		let outOfScreen = (shot.px + dir > GET_MAX_X - 2 || shot.px + dir < 2);
		if (!flatGround && !directionChanged && !outOfScreen) {
			for (let i = 0; i < players.length; ++i) {
				let player = players[i];
				if (player.maxPower > 0) {
					if (roundedX < player.posX + 4 && roundedX > player.posX - 4 &&
						roundedY < player.posY + 3 && roundedY > player.posY - 2) {
						return true;
					}
				}
			}
			shot.px += dir;
			roundedX = Math.round(shot.px);
			shot.rollingDir = dir;
			shot.py = landTop[roundedX] - 1;
			roundedY = Math.round(shot.py);
			gameGraphics.drawShot(roundedX, roundedY, rgbYellow);
			return false;
		}
		else {
			return true;
		}
	}

	function moveShot(shot) {
		let roundedX = Math.round(shot.px);
		let roundedY = Math.round(shot.py);
		gameGraphics.drawShot(roundedX, roundedY, tracers ? (traceColorAsTank ? currentPlayer.rgbSecColor : rgbDarkGray) : rgbSky);
		handleGuidance(shot);
		shot.vy += ay;
		shot.vx += ax;
		if (shot.px + shot.vx > GET_MAX_X - 2 || shot.px + shot.vx < 2) {
			if (weapon.class !== "nitro") {
				shot.vx *= -0.9;
				// TODO: MakeSound(250, 2)
			}
			else {
				shot.dead = true;
			}
		}
		shot.px += shot.vx;
		if (shot.py + shot.vy > GET_MAX_Y - 19) {
			if (weapon.class !== "nitro") {
				shot.vy *= -0.5;
				// TODO: MakeSound(250, 2)
			}
			else {
				shot.dead = true;
			}
		}
		if (shot.py + shot.vy < 19) {
			if (weapon.class !== "nitro") {
				shot.vy *= -0.9;
				// TODO: MakeSound(250, 2)
			}
			else {
				shot.dead = true;
			}
		}
		shot.py += shot.vy;
		roundedX = Math.round(shot.px);
		roundedY = Math.round(shot.py);
		let hitGround = gameGraphics.isGround(roundedX, roundedY);
		if (hitGround) {
			shotHitGround(shot);
		}
		gameGraphics.drawShot(roundedX, roundedY, rgbYellow);
		if (weapon.class === "guiding" && guiBar > 0) {
			guiBar = Math.max(0, guiBar - 0.0025); // TODO: Compare to original value in MM
			gameGraphics.updateGuidance(guiBar);
		}
		if (shot.vy > 0) {
			maxYReached = true;
			if (!divided && weapon.shots > 1) { // not shotCount!
				shot.divided = true;
				divideMirv(shot);
			}
		}
		for (let i = 0; i < players.length; ++i) {
			let player = players[i];
			if (player.maxPower > 0) {
				if (player.shield && !(currentPlayerIndex == i && !maxYReached)) {
					bendShot(shot, player.posX, player.posY);
				}
				if (roundedX < player.posX + 5 && roundedX > player.posX - 5 &&
					roundedY < player.posY + 2 && roundedY > player.posY - 3) {
					shot.dead = true;
				}
			}
		}
		if (Math.abs(shot.vy) < 0.08 && shot.py + shot.vy > GET_MAX_Y - 19) {
			shot.dead = true;
		}
	}

	function handleGuidance(shot) {
		if (weapon.class === "guiding" && guiBar > 0) {
			let updateShot = false;
			let angle = 0;
			if (gameEngine.isKeyDown[Keys.LEFT_ARROW]) {
				angle = 0.001 * glevel; // TODO: Compare to original value in MM
				updateShot = true;
			}
			if (gameEngine.isKeyDown[Keys.RIGHT_ARROW]) {
				angle = -0.001 * glevel; // TODO: Compare to original value in MM
				updateShot = true;
			}
			if (updateShot) {
				shot.vx = Math.cos(angle) * shot.vx + Math.sin(angle) * shot.vy;
				shot.vy = -Math.sin(angle) * shot.vx + Math.cos(angle) * shot.vy;
				guiBar = Math.max(0, guiBar - 0.05); // TODO: Compare to original value in MM
				gameGraphics.updateGuidance(guiBar);
			}
		}
	}

	function shotHitGround(shot) {
		hole[Math.round(shot.px)] = true;
		if (!weapon.exponimp) {
			shot.vx *= 0.7;
			shot.vy *= 0.7;
			if (Math.abs(shot.vx) < 0.08 && Math.abs(shot.vy) < 0.08) {
				shot.dead = true;
			}
		}
		else {
			shot.dead = true;
		}
	}

	function divideMirv(shot) {
		shotCount = weapon.shots;
		for (let i = 1; i < shotCount; ++i) {
			shots[i] = [];
			shots[i][currentLeap] = Object.assign({}, shot);
			shots[i][currentLeap].vx *= (i / shotCount);
		}
		divided = true;
	}

	function bendShot(shot, posX, posY) {
		if ((shot.py > posY - 100) && (shot.py < posY) &&
			(shot.px > posX - (posY - shot.py) / 2) && 
			(shot.px < posX + (posY - shot.py) / 2)) {
			shot.vy -= (Math.abs(shot.vy) + Math.abs(shot.vx)) / 500 + 0.001;
		}
	}
}