"use strict";

function fireCannon(weapon, players, currentPlayerIndex, wind, gameGraphics, fireCannonDone) {
	let States = { FLYING: 0, ROLLING: 1, EXPLODING: 2}; // This is not a per-shot state, as the whole game goes into rolling/exploding when a shot hits ground.
	let currentState = States.FLYING; 

	let fastShot = true; // TODO: Get from config
	let tracers = true; // TODO: get from config
	let traceColorAsTank = true; // TODO: get from config

	let milliSecondsBetweenShotMovement = fastShot ? 1 : 4;
	let milliSecondsBetweenExplosionExpansion = 5;
	let timeCounter = 0;

	let rgbTransparent = Palette.getRGBFromColor(GameColors.TRANSPARENT);
	let rgbDarkGray = Palette.getRGBFromColor(GameColors.DARKGRAY);
	let rgbYellow = Palette.getRGBFromColor(GameColors.YELLOW);

	let currentPlayer = players[currentPlayerIndex];

	let guiBar = (weapon.class === "guiding") ? 50 : 0;
	let divided = (weapon.class === "multishot");
	let shotCount = weapon.shots;
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
		gameGraphics.updateGuidance(guiBar);
	}

	let lv =  currentPlayer.power / 650;
	let ay = 0.001;
	let ax = (wind / 100000);

	for (let i = 0; i < shotCount; ++i) {
		let shot = {
			px: Math.round(Math.cos(currentPlayer.angle) * 6) + currentPlayer.posX,
			py: -Math.round(Math.sin(currentPlayer.angle) * 6) + currentPlayer.posY - 3,
			vx: Math.cos(currentPlayer.angle) * (lv - i / 25),
			vy: -Math.sin(currentPlayer.angle) * (lv - i / 25),
			exp: 0,
			dead: false,
			miss: true
		};
		shots[i, 0] = shot; // [shotNum, leapNum]
	}

	if (weapon.class === "nitro") {
		if (weapon.dam * lv > 25) {
			shotCount = 1;
			exNum = 1;
			shots[0, 0].dead = true;
			impact(shots[0, 0]);
		}
	}

	return {
		onTick: onTick
	};

	function onTick(stage, deltaInSeconds) {
		timeCounter += deltaInSeconds * 1000;
		switch (currentState) {
			case States.FLYING:
				let shotMovementIterations = Math.floor(timeCounter / milliSecondsBetweenShotMovement);
				timeCounter = timeCounter % milliSecondsBetweenShotMovement;
				let shotImpact = false;
				for (let j = 0; j < shotMovementIterations && !shotImpact; ++j) {
					// cycle through all shots
					for (let i = 0; i < shotCount && !shotImpact; ++i) {
						let shot = shots[currentShot, currentLeap];
						if (!shot.dead) {
							moveShot(shot);
							if (shot.dead) {
								exNum++;
								shotImpact = true
								impact(shot);
								timeCounter = 0;
							}
						}
						if (!shotImpact) {
							currentShot++;
							if (currentShot == shotCount) {
								currentShot = 0;
							}
						}
					}
				}
				break;
			case States.ROLLING:
				break;
			case States.EXPLODING:
				let shotExplosionIterations = Math.floor(timeCounter / milliSecondsBetweenExplosionExpansion);
				timeCounter = timeCounter % milliSecondsBetweenExplosionExpansion;
				let shot = shots[currentShot, currentLeap];
				for (let j = 0; j < shotExplosionIterations; ++j) {
					if (explode(shot)) {
						break;
					}
				}
				break;
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

			if (!nextShotOrFinishIsShooting()) {
				gameGraphics.drawShot(x, y, rgbYellow);
			}
			return true
		}
	}

	function nextShotOrFinishIsShooting() {
		let allDead = true;
		for (let i = 0; i < shotCount; ++i) {
			let shotAtIndex = shots[currentShot, currentLeap];
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
			currentShot = 0;
			currentLeap++;
			if (currentLeap === leapCount || weapon.class === "nitro") {
				// TODO: MoveDirt
				// TODO: DecDamFromShot
				// TODO: DrawLandTop
				// TODO: CheckNoAmmo
				fireCannonDone();
				return true;
			}
			else {
				exNum = 0;
				for (let i = 0; i < shotCount; ++i) {
					shots[i, currentLeap].dead = false;
				}
			}
		}
		return false;
	}

	function impact(shot) {
		if (weapon.class === "roller") {
			currentState = States.ROLLING;
		}
		else {
			currentState = States.EXPLODING;
		}
	}

	function moveRoller(shot) {
		let roundedX = Math.round(shot.px);
		let roundedY = Math.round(shot.py);
		gameGraphics.drawShot(roundedX, roundedY, rgbTransparent);
	}

	function moveShot(shot) {
		let roundedX = Math.round(shot.px);
		let roundedY = Math.round(shot.py);
		gameGraphics.drawShot(roundedX, roundedY, tracers ? (traceColorAsTank ? currentPlayer.rgbSecColor : rgbDarkGray) : rgbTransparent);
		handleGuidance();
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
			guiBar -= 0.025;
			gameGraphics.updateGuidance(guiBar);
		}
		if (shot.vy > 0) {
			maxYReached = true;
			if (!divided && shotCount > 1) {
				divideMirv();
			}
		}
		for (let i = 0; i < players.length; ++i) {
			let player = players[i];
			if (currentPlayerIndex !== i && player.shield && player.maxPower > 0 && !maxYReached) {
				bendShot(shot, player.posX, player.posY);
			}
			if (roundedX < player.posX + 5 && roundedX > player.posX - 5 &&
				roundedY < player.posY + 2 && roundedY > player.posY - 3) {
				shot.dead = true;
			}
		}
		if (Math.abs(shot.vy) < 0.08 && shot.py + shot.vy > GET_MAX_Y - 19) {
			shot.dead = true;
		}
	}

	function handleGuidance() {
		if (weapon.class === "guidance" && guiBar > 0) {
			let updateShot = false;
			let angle = 0;
			if (gameEngine.isKeyDown[Keys.LEFT_ARROW]) {
				angle = 0.01 * glevel;
				updateShot = true;
			}
			if (gameEngine.isKeyDown[Keys.RIGHT_ARROW]) {
				angle = -0.01 * glevel;
				updateShot = true;
			}
			if (updateShot) {
				shot.vx = Math.cos(angle) * shot.vx + Math.sin(angle) * shot.vy;
				shot.vy = -Math.sin(angle) * shot.vx + Math.cos(angle) * shot.vy;
				guiBar -= 0.5;
				gameGraphics.updateGuidance(guiBar);
			}
		}
	}

	function shotHitGround(shot) {
		hole[Math.round(shot.px)] = true;
		if (!weapon.expOnImp) {
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

	function divideMirv() {
		for (let i = 1; i < shotCount; ++i) {
			shots[i, currentLeap] = jQuery.extend({}, shots[0, currentLeap]); // shallow clone
			shots[i, currentLeap].vx *= (i / shotCount);
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