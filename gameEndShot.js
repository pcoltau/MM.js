"use strict";

function endShot(gameGraphics, landTop, currentPlayerIndex, pList, livePlayers, shots, wind, wepList, endingShotDone) {
	let States = {FALLING: 0, EXPLODING: 1, SHOWING_COMMENT: 2};
	let currentState = States.FALLING; 

	let milliSecondsBetweenFallMovement = 8;
	let milliSecondsBetweenExplosionMovement = 10;
	let timeCounter = 0;

	let tankVx = 0;
	let tankVy = 0;
	let tankAy = 0;

	let explosionDotObj = null;

	let playerWeapon = pList[currentPlayerIndex].weaponList[pList[currentPlayerIndex].currentWep];
	let weaponInfo = wepList[playerWeapon.weaponIndex];
	let leapCount = weaponInfo.leaps ? weaponInfo.leaps : 1;

	let currentOtherPlayerIndex = 0;
	let rank = 0;  
	let killed = []; // players killed by this shot
	let commentQueue = [];
	let activeComment = null;
	let commentDurationMs = 2000;
	let commentGenerated = [];

	calculateDamageAndCyclePlayers();

	return {
		onTick: onTick
	}

	function onTick(stage, deltaInSeconds) {
		timeCounter += deltaInSeconds * 1000;
		switch (currentState) {
			case States.FALLING:
				tickFalling();
				break;
			case States.EXPLODING:
				tickExploding();
				break;
			case States.SHOWING_COMMENT:
				tickShowingComment();
				break;
		}
		gameGraphics.updateGameImage();
	}

	function tickFalling() {
		consumeTime(milliSecondsBetweenFallMovement, moveTank);
	}

	function tickExploding() {
		let currentPlayer = pList[currentOtherPlayerIndex];
		if (explosionDotObj === null) {
			gameGraphics.setTankVisibility(currentPlayer.color, false);
			explosionDotObj = createExplosionDots(currentPlayer);
		}
		consumeTime(milliSecondsBetweenExplosionMovement, function () {
			moveExplodingDots();
			if (explosionDotObj.stoppedCount === explosionDotObj.dots.length) {
				gameGraphics.clearExplodingTankContainer();
				explosionDotObj = null;
				currentOtherPlayerIndex++;
				currentState = States.SHOWING_COMMENT;
				return true;
			}
			return false;
		});
	}

	function tickShowingComment() {
		if (!activeComment) {
			if (commentQueue.length === 0) {
				calculateDamageAndCyclePlayers();
				return;
			}
			activeComment = commentQueue.shift();
			timeCounter = 0;
			gameGraphics.showComment(activeComment);
			return;
		}
		if (timeCounter >= commentDurationMs) {
			timeCounter = 0;
			activeComment = null;
			gameGraphics.hideComment();
			if (commentQueue.length === 0) {
				calculateDamageAndCyclePlayers();
			}
		}
	}

	function consumeTime(stepMs, shouldStopStep) {
		let iterations = Math.floor(timeCounter / stepMs);
		timeCounter = timeCounter % stepMs;
		for (let i = 0; i < iterations; ++i) {
			// Returning true stops the remaining iterations for this tick.
			if (shouldStopStep()) {
				timeCounter = 0;
				break;
			}
		}
	}

	function checkNoAmmo() {
		if (playerWeapon.ammo > 0) {
			playerWeapon.ammo--;
		}
		if (playerWeapon.ammo === 0) { 
			pList[currentPlayerIndex].weaponList.splice(pList[currentPlayerIndex].currentWep, 1);
			pList[currentPlayerIndex].currentWep--;
			playerWeapon = null;
			weaponInfo = null;
		}
	}

	function moveTank() {
		let shouldEnd = false;
		let currentPlayer = pList[currentOtherPlayerIndex];
		tankVy += tankAy;
		if (currentPlayer.posX + tankVx > 6 && currentPlayer.posX + tankVx < GET_MAX_X - 6) {
			currentPlayer.posX += tankVx;
		} 
		currentPlayer.posY += tankVy;
		if (currentPlayer.posY >= landTop[Math.round(currentPlayer.posX)] - 2) {
			currentPlayer.posX = Math.round(currentPlayer.posX);
			currentPlayer.posY = Math.round(currentPlayer.posY);
			// TODO: MakeSound(150,5);
			if (killed[currentOtherPlayerIndex]) {
				currentState = States.EXPLODING;
			}
			else {
				currentState = States.SHOWING_COMMENT;
			}
			gameGraphics.setTankParachuteVisibility(currentPlayer.color, false);
			updateLandTopAround(currentPlayer.posX);
			if (!killed[currentOtherPlayerIndex]) {
				currentOtherPlayerIndex++;
			}
			shouldEnd = true;
		}
		gameGraphics.updateTankPosition(currentPlayer.color, currentPlayer.posX, currentPlayer.posY);
		return shouldEnd;
	}

	function updateLandTopAround(centerX) {
		let roundedX = Math.round(centerX);
		for (let x = roundedX - 7; x <= roundedX + 7; ++x) {
			updateLandTopAt(x);
		}
	}

	function updateLandTopAt(x) {
		if (x < 0 || x >= landTop.length) {
			return;
		}
		let yTop = GET_MAX_Y - 18;
		let pixels = 0;
		let startY = landTop[x];
		for (let y = yTop; y >= startY; --y) {
			if (gameGraphics.isGround(x, y)) {
				pixels++;
			}
		}
		landTop[x] = yTop - pixels + 1;
	}

	function calculateDamageAndCyclePlayers() {
		currentState = States.FALLING;
		if (currentOtherPlayerIndex >= pList.length) {
			finishShot();
			return;
		}
		let playerResult = null;
		let shouldStopCycle = true;
		do {
			playerResult = processPlayerForShot(currentOtherPlayerIndex);
			shouldStopCycle = playerResult.shouldFall;
			if (!shouldStopCycle) {
				if (killed[currentOtherPlayerIndex]) {
					shouldStopCycle = true;
					currentState = States.EXPLODING;
				}
				else {
					currentOtherPlayerIndex++;
				}
			}
		} while (!shouldStopCycle && currentOtherPlayerIndex < pList.length);
		if (!shouldStopCycle) {
			finishShot();
		}
		else {
			if (playerResult.deployParachute) {
				gameGraphics.setTankParachuteVisibility(pList[currentOtherPlayerIndex].color, true);
				tankVx = wind/200;
				tankVy = 0.2;
				tankAy = 0;
			}
			else {
				tankVx = 0;
				tankVy = 0;
				tankAy = 0.01;
			}
		}
	}

	function finishShot() {
		afterFallUpdateOfStats();
		checkNoAmmo();
		endingShotDone(livePlayers);
	}

	function processPlayerForShot(playerIndex) {
		killed[playerIndex] = false;
		let shouldFall = false;
		let deployParachute = false;
		let player = pList[playerIndex];
		if (player.maxPower > 0) {
			let statDam1 = 0;
			let statDam2 = 0;
			let lossexpall = 0;
			let headshots = 0;
			for (let j = 0; j < leapCount; ++j) {
				for (let i = 0; i < shots.length; ++i) {
					let shot = shots[i][j];
					let lossexp = calcTankDam(player, shot);
					if (lossexp === -1) {
						if (playerIndex != currentPlayerIndex) {
							headshots++;
						}
						lossexpall += calcHeadshot();
					}
					else {
						lossexpall += lossexp;
					}
					if (playerIndex != currentPlayerIndex && lossexp != 0) {
						shot.miss = false;
					}
				}
			}
			let lossfallall = 0;
			let landTopY = landTop[Math.round(player.posX)];
			if (player.posY < landTopY - 2) {
				shouldFall = true;
				if (player.parachutes === 0 || player.maxPower + player.armour - lossexpall <= 0) {
					lossfallall = ((landTopY - 2) - player.posY) * 5;
				} 
				else {
					player.parachutes--;
					deployParachute = true;
				}
			}
			decreasePower(playerIndex, lossexpall, lossfallall, headshots);
		 	pList[currentPlayerIndex].roundStats.headshots += headshots;
			queueCommentIfNeeded(playerIndex, lossexpall, lossfallall, headshots);
			if (player.maxPower < 1) {
				if (rank < livePlayers + 1) {
					rank = livePlayers + 1;
				}
				killed[playerIndex] = true;
			}
			statDam1 += lossexpall;
			statDam2 += lossfallall;
			if (playerIndex != currentPlayerIndex) {
				pList[currentPlayerIndex].roundStats.damage += (statDam1 + statDam2);
			}
		}
		return {
			shouldFall: shouldFall,
			deployParachute: deployParachute
		};
	}

	function queueCommentIfNeeded(playerIndex, lossexpall, lossfallall, headshots) {
		if (commentGenerated[playerIndex]) {
			return;
		}
		let comment = buildComment(playerIndex, lossexpall, lossfallall, headshots);
		if (comment) {
			commentQueue.push(comment);
			commentGenerated[playerIndex] = true;
		}
	}

	function buildComment(playerIndex, lossexpall, lossfallall, headshots) {
		let str1 = "";
		let str2 = "";
		let total = lossexpall + lossfallall;
		if (lossexpall > 0) {
			if (total > 100) { str1 = "scratched "; str2 = "."; }
			if (total > 150) { str1 = "bruised "; str2 = "."; }
			if (total > 200) { str1 = "injured "; str2 = "."; }
			if (total > 250) { str1 = "wounded "; str2 = "."; }
			if (total > 300) { str1 = "cracked "; str2 = "."; }
			if (total > 400) { str1 = "fractured "; str2 = "."; }
			if (total > 450) { str1 = "fractured "; str2 = getRandomCommentSuffix(); }
			if (total > 500) { str1 = "shredded "; str2 = "."; }
			if (total > 550) { str1 = "shredded "; str2 = getRandomCommentSuffix(); }
			if (total > 600) { str1 = "smashed "; str2 = "."; }
			if (total > 700) { str1 = "smashed "; str2 = getRandomCommentSuffix(); }
			if (total > 800) { str1 = "slaughtered "; str2 = "."; }
			if (total > 900) { str1 = "slaughtered "; str2 = getRandomCommentSuffix(); }
			if (total > 1000) { str1 = "butchered "; str2 = "."; }
			if (total > 1100) { str1 = "butchered "; str2 = getRandomCommentSuffix(); }
			if (total > 1200) { str1 = "massacred "; str2 = "."; }
			if (total > 1300) { str1 = "massacred "; str2 = getRandomCommentSuffix(); }
			if (total > 1400) { str1 = "obliterated "; str2 = "."; }
			if (total > 1500) { str1 = "obliterated "; str2 = getRandomCommentSuffix(); }
			if (total > 1600) { str1 = "annihilated "; str2 = "."; }
			if (total > 1700) { str1 = "annihilated "; str2 = getRandomCommentSuffix(); }
			if (total > 1800) { str1 = "atomized "; str2 = "."; }
			if (total > 1900) { str1 = "atomized "; str2 = getRandomCommentSuffix(); }
			if (total > 2000) { str1 = "vaporized "; str2 = "."; }
			if (total > 2250) { str1 = "vaporized "; str2 = " into dust."; }
			if (total > 2500) { str1 = "vaporized "; str2 = " into oblivion."; }
			if (total > 3000) { str1 = "vaporized "; str2 = " into pure nothing."; }
			if (total <= 100) { str1 = "dented "; str2 = "."; }
			if (total <= 75) { str1 = "almost scared "; str2 = "."; }
			if (total <= 50) { str1 = "barely touched "; str2 = "."; }
		}
		else {
			if (lossfallall <= 100) { str1 = "made the dust collapse under "; str2 = "."; }
			if (lossfallall <= 50) { str1 = "made "; str2 = " float gently like a feather."; }
			if (lossfallall > 100) { str1 = "made "; str2 = " land hard."; }
			if (lossfallall > 200) { str1 = "made "; str2 = " dive like a stone."; }
			if (lossfallall > 300) { str1 = "made "; str2 = " stumble down the rocks."; }
			if (lossfallall > 400) { str1 = "made "; str2 = " tumble down irretrievably."; }
			if (lossfallall > 500) { str1 = "made "; str2 = " lunge towards hell."; }
			if (lossfallall > 600) { str1 = "made "; str2 = " go supersonic."; }
			if (lossfallall > 700) { str1 = "made "; str2 = " go warp 2."; }
			if (lossfallall > 800) { str1 = "made "; str2 = " go warp 5."; }
			if (lossfallall > 900) { str1 = "made "; str2 = " go warp 9."; }
			if (lossfallall > 1000) { str1 = "made "; str2 = " plunge towards The Grim Reaper."; }
		}
		if (total === 0) {
			str1 = "";
			str2 = "";
		}
		if (headshots === 1) { str1 = "made a HEADSHOT on "; str2 = "."; }
		if (headshots === 2) { str1 = "made a double HEADSHOT on "; str2 = "."; }
		if (headshots === 3) { str1 = "made a triple HEADSHOT on "; str2 = "."; }
		if (headshots === 4) { str1 = "made a quadruple HEADSHOT on "; str2 = "."; }
		if (headshots === 5) { str1 = "made a quintuple HEADSHOT on "; str2 = "."; }
		if (headshots >= 6) { str1 = "made incomprehensible many HEADSHOT on "; str2 = "."; }
		if (!str1) {
			return null;
		}

		let target = pList[playerIndex];
		let shooter = pList[currentPlayerIndex];
		let isSuicide = playerIndex === currentPlayerIndex && shooter.maxPower < 1;
		let personName = (playerIndex === currentPlayerIndex) ? "itself" : target.name;
		return {
			text: isSuicide ? (shooter.name + " suicided!") : (shooter.name + " " + str1 + personName + str2),
			isSuicide: isSuicide,
			shooterName: shooter.name,
			shooterColor: shooter.color,
			personName: personName,
			personColor: target.color,
			str1: str1,
			str2: str2
		};
	}

	function getRandomCommentSuffix() {
		let r = Math.floor(Math.random() * 15);
		if (r === 0) return " badly.";
		if (r === 1) return " to pieces.";
		if (r === 2) return " as oil starts to flow.";
		if (r === 3) return " removing tons of metal.";
		if (r === 4) return " making it unreconizable.";
		if (r === 5) return " like a silly bug.";
		if (r === 6) return " making sparks fly.";
		if (r === 7) return " shattering delicate machinery.";
		if (r === 8) return " crumbling the bodywork.";
		if (r === 9) return " almost tipping it over.";
		if (r === 10) return " messing up its paintjob.";
		if (r === 11) return " wrecking its camouflage.";
		if (r === 12) return " almost breaking its cannon.";
		if (r === 13) return " making it really pissed off.";
		return " fragments flying everywhere.";
	}

	function afterFallUpdateOfStats() {
		let currentPlayer = pList[currentPlayerIndex];
		for (let j = 0; j < leapCount; ++j) {
			for (let i = 0; i < shots.length; ++i) {
				let shot = shots[i][j];
				if (shot.miss) {
					currentPlayer.roundStats.misses++;
				}
				currentPlayer.roundStats.shots++;
			}
		}
		for (let h = 0; h < pList.length; ++h) {
			if (killed[h]) {
				pList[h].roundStats.place = rank;
			}
		}		
	}

	function calcTankDam(player, shot) {
		let shotX = Math.round(shot.px);
		let shotY = Math.round(shot.py);
		let playerX = Math.round(player.posX);
		let playerY = Math.round(player.posY);
		let dx = shotX - playerX;
		let dy = shotY - playerY;
		let d = dx * dx + dy * dy;
		let dam = weaponInfo.dam * weaponInfo.dam;
		let l = 0;
		if (d < 8) {
			l = -1;
		}
		else if (d < dam) {
			let x = weaponInfo.dam;
			l = Math.round((x/(x + 30) * 2000) * ((dam - d)/(dam)));
		}
		return l;
	}

	function calcHeadshot() {
		return 1000 + weaponInfo.dam * 10;
	}	

	function decreasePower(playerIndex, lossexpall, lossfallall, headshots) {
		let player = pList[playerIndex];
		let loss = lossexpall;
		if (weaponInfo.class === "piercing") {
		 	player.maxPower -= loss;
			loss = 0;
		}
		if (loss + lossfallall > player.armour) {
			loss += (lossfallall - player.armour);
			player.armour = 0;
			player.armourment = ArmourTypes.NoArmour;
		}
		else {
			player.armour -= (loss + lossfallall);
			loss = 0;
		}
		if (player.armour === 0) {
			player.shield = false;
			gameGraphics.setTankShieldVisibility(player.color, false);
		}
	 	player.maxPower -= loss;
	 	if (player.maxPower < player.power) {
	 		player.power = player.maxPower;
	 	}
	 	if (player.maxPower < 1) {
	 		if (playerIndex != currentPlayerIndex) {
				pList[currentPlayerIndex].roundStats.kills++;
	 		}
	 		else {
				pList[currentPlayerIndex].roundStats.kills--;
	 		}
	 		livePlayers--;
	 	}
	}

	function createExplosionDots(player) {
		let dotObj = {
			dots: [],
			stoppedCount: 0
		}
		for (let i = 0; i < 100; ++i) {
			let dot = {
				shape: new createjs.Shape(),
				bounce: 0,
				stopped: false,
				x: player.posX + Math.floor(Math.random() * 7) - 3,
				y: player.posY + Math.floor(Math.random() * 3) - 1,
				vx: Math.cos((Math.floor(Math.random() * Math.round(0.5 * Math.PI * 100)) + Math.round(0.25 * Math.PI * 100)) / 100),
				vy: -Math.sin((Math.floor(Math.random() * 150) + 2) / 100)
			}	
			putPixel(dot.shape.graphics, player.color, 0, 0);
			updateDotPosition(dot);
			gameGraphics.addExplosionDotToExplodingTankContainer(dot.shape);
			dotObj.dots.push(dot)		
		}
		return dotObj;
	}

	function moveExplodingDots() {
		for (let i = 0; i < explosionDotObj.dots.length; ++i) {
			let dot = explosionDotObj.dots[i];
			if (!dot.stopped) {
				dot.vx += wind / 10000;
				dot.vy += 0.01;
				let bounced = false;
				if (dot.x + dot.vx > GET_MAX_X - 2 || dot.x + dot.vx < 2) {
					dot.vx *= -0.5;
					bounced = true;
					if (dot.bounce < 1) {
						// TODO: MakeSound(200, 1)
					}
					dot.bounce++;
				}
				if (dot.y + dot.vy > GET_MAX_Y - 19 || dot.y + dot.vy < 18) {
					dot.vy *= -0.5;
					bounced = true;
					if (dot.bounce < 1) {
						// TODO: MakeSound(200, 1)
					}
					dot.bounce++;
				}
				while (landTop[Math.round(dot.x + dot.vx)] - 1 < Math.round(dot.y + dot.vy) && dot.bounce < 2) {
					dot.vy *= -0.5;
					bounced = true;
					if (dot.bounce < 1) {
						// TODO: MakeSound(200, 1)
					}
					dot.bounce++;
				}
				if (dot.bounce > 1) {
					dot.stopped = true;
					dot.shape.visible = false;
					explosionDotObj.stoppedCount++;
				}
				else {
					dot.x += dot.vx;
					dot.y += dot.vy;
					updateDotPosition(dot);
				}
			}
		}
	}

	function updateDotPosition(dot) {
		dot.shape.x = Math.round(dot.x);
		dot.shape.y = Math.round(dot.y);
	}
}