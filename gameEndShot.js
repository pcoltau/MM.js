"use strict";

function endShot(gameGraphics, landTop, currentPlayerIndex, pList, livePlayers, shots, wind, wepList, endingShotDone) {
	let States = {FALLING: 0, EXPLODING: 1, SHOWING_COMMENT: 2};
	let currentState = States.FALLING; 

	let milliSecondsBetweenFallMovement = 8;
	let milliSecondsBetweenExplosionMovement = 10;
	let timeCounter = 0;

	let tankIsFalling = false;
	let tankVx = 0;
	let tankVy = 0;
	let tankAy = 0;

	let explosionDotObj = null;

	let playerWeapon = pList[currentPlayerIndex].weaponList[pList[currentPlayerIndex].currentWep];
	let weaponInfo = wepList[playerWeapon.weaponIndex];

	let currentOtherPlayerIndex = 0;
	let rank = 0;  
	let killed = []; // players killed by this shot

	// TODO: calc and decrease all damage before changing to any state. Perhaps split damage calc and cycle players. Don't calculate damage in exploding state. 


	//calculateDamageAndCyclePlayers();
	let lossObjs = calculateAllDamage();
	cyclePlayersOrEnd();

	return {
		onTick: onTick
	}

	function onTick(stage, deltaInSeconds) {
		timeCounter += deltaInSeconds * 1000;
		switch (currentState) {
			case States.FALLING:
				if (!tankIsFalling) {
					if (lossObjs[currentOtherPlayerIndex].deployParachute) {
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
					tankIsFalling = true;
				}
				let shotMovementIterations = Math.floor(timeCounter / milliSecondsBetweenFallMovement);
				timeCounter = timeCounter % milliSecondsBetweenFallMovement;
				for (let i = 0; i < shotMovementIterations; ++i) {
					if (moveTank()) {
						timeCounter = 0;
						break;
					}
				}
				break;
			case States.EXPLODING:
				let currentPlayer = pList[currentOtherPlayerIndex];
				if (explosionDotObj === null) {
					gameGraphics.setTankVisibility(currentPlayer.color, false);
					explosionDotObj = createExplosionDots(currentPlayer)
				}
				let explosionMovementIterations = Math.floor(timeCounter / milliSecondsBetweenExplosionMovement);
				timeCounter = timeCounter % milliSecondsBetweenExplosionMovement;
				for (let i = 0; i < explosionMovementIterations; ++i) {
					moveExplodingDots();
					if (explosionDotObj.stoppedCount === explosionDotObj.dots.length) {
						gameGraphics.clearExplodingTankContainer();
						explosionDotObj = null;
						currentState = States.SHOWING_COMMENT;		
						timeCounter = 0;
						break;
					}
				}	
				break;
			case States.SHOWING_COMMENT:
				if (lossObjs[currentOtherPlayerIndex].wasHit)
				{
					// TODO: Wait and then remove comment
				}

				// Continue to the (potential) next player
				cyclePlayersOrEnd();
				break;
		}
		gameGraphics.updateGameImage();
	}

	function cyclePlayersOrEnd()
	{
		let shouldEndShot = false;
		let continueAnimations = false;
		do {
			currentOtherPlayerIndex++;
			shouldEndShot = currentOtherPlayerIndex == pList.length;
			if (!shouldEndShot) {
				continueAnimations = lossObjs[currentOtherPlayerIndex].shouldFall || killed[currentOtherPlayerIndex];
			}
		} while (!shouldEndShot && !continueAnimations);
		if (shouldEndShot) {
			afterFallUpdateOfStats();
			checkNoAmmo();
			endingShotDone(livePlayers);		
		}
		else {
			if (lossObjs[currentOtherPlayerIndex].shouldFall) {
				currentState = States.FALLING;
			} else {
				currentState = States.EXPLODING;
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
		if (currentPlayer.posX + tankVx > 6 && currentState.posX + tankVx < GET_MAX_X - 6) {
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
			tankIsFalling = false;
			shouldEnd = true;
		}
		gameGraphics.updateTankPosition(currentPlayer.color, currentPlayer.posX, currentPlayer.posY);
		return shouldEnd;
	}

	function calculateAllDamage()
	{
		var lossObjs = [];
		for (var i = 0; i < pList.length; i++)
		{
			let lossObj = beforeFallLossCalc(i);
			lossObjs.push(lossObj);
		}
		return lossObjs;
}

	function calculateDamageAndCyclePlayers() {
		currentState = States.FALLING;
		let lossObj = null;
		let shouldStopCycle = true;
		do {
			lossObj = beforeFallLossCalc();
			shouldStopCycle = lossObj.shouldFall;
			if (!shouldStopCycle) {
				if (killed[currentOtherPlayerIndex]) {
					shouldStopCycle = true;
					currentState = States.EXPLODING;
				}
				currentOtherPlayerIndex++;
			}
		} while (!shouldStopCycle && currentOtherPlayerIndex < pList.length);
		if (!shouldStopCycle) {
			afterFallUpdateOfStats();
			checkNoAmmo();
			endingShotDone(livePlayers);
		}
		else {
			if (lossObj.deployParachute) {
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

	function beforeFallLossCalc(otherPlayerIndex) {
		killed[otherPlayerIndex] = false;
		var shouldFall = false;
		var deployParachute = false;
		var wasHit = false;
		let player = pList[otherPlayerIndex];
		if (player.maxPower > 0) {
			let statDam1 = 0;
			let statDam2 = 0;
			let lossexpall = 0;
			let headshots = 0;
			for (let j = 0; j < weaponInfo.leaps; ++j) {
				for (let i = 0; i < shots.length; ++i) {
					let shot = shots[i][j];
					let lossexp = calcTankDam(player, shot);
					if (lossexp === -1) {
						if (otherPlayerIndex != currentPlayerIndex) {
							headshots++;
						}
						lossexpall += calcHeadshot();
					}
					else {
						lossexpall += lossexp;
					}
					if (otherPlayerIndex != currentPlayerIndex && lossexp != 0) {
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
			decreasePower(otherPlayerIndex, lossexpall, lossfallall, headshots);
			if (lossexpall + lossfallall > 0 || headshots > 0) {
				wasHit = true;
			}
		 	pList[currentPlayerIndex].roundStats.headshots += headshots;
			if (player.maxPower < 1) {
				if (rank < livePlayers + 1) {
					rank = livePlayers + 1;
				}
				killed[otherPlayerIndex] = true;
			}
			statDam1 += lossexpall;
			statDam2 += lossfallall;
			if (otherPlayerIndex != currentPlayerIndex) {
				pList[currentPlayerIndex].roundStats.damage += (statDam1 + statDam2);
			}
		}
		return { shouldFall: shouldFall, deployParachute: deployParachute, wasHit: wasHit};
	}

	function afterFallUpdateOfStats() {
		// TODO: Consider moving this to calculateAllDamage()
		let currentPlayer = pList[currentPlayerIndex];
		for (let j = 0; j < weaponInfo.leaps; ++j) {
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
		let dx = shot.px - player.posX;
		let dy = shot.py - player.posY;
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

	function decreasePower(playerIndex, lossexpall, lossfallall) {
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
			// TODO: We should wait with updating the visiblity until after the fall animation has played
			gameGraphics.setTankShieldVisibility(player.color, false);
		}
	 	player.maxPower -= loss;
	 	if (player.maxPower < player.power) {
	 		player.power = player.maxPower;
	 	}
	 	if (player.maxPower < 1) {
	 		if (playerIndex != currentPlayerIndex) {
	 			player.roundStats.kills++;
	 		}
	 		else {
	 			player.roundStats.kills--;
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
				let bounce = false;
				if (dot.x + dot.vx > GET_MAX_X - 2 || dot.x + dot.vx < 2) {
					dot.vx *= -0.5;
					bounce = true;
				}
				if (dot.y + dot.vy > GET_MAX_Y - 19 || dot.y + dot.vy < 18) {
					dot.vy *= -0.5
					bounce = true;
				}
				if (landTop[Math.round(dot.x + dot.vx)] - 1 < Math.round(dot.y + dot.vy) && dot.bounce < 2) {
					dot.vy *= -0.5
					bounce = true;
				}
				if (bounce) {
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