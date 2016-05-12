"use strict";

function endShot(gameGraphics, landTop, currentPlayerIndex, pList, livePlayers, shots, wind, endingShotDone) {
	let States = {FALLING: 0, EXPLODING: 1, SHOWING_COMMENT: 2};
	let currentState = States.FALLING; 

	let milliSecondsBetweenFallMovement = 8;
	let timeCounter = 0;

	let tankVx = 0;
	let tankVy = 0;
	let tankAy = 0;

	let weapon = pList[currentPlayerIndex].weaponList[pList[currentPlayerIndex].currentWep];

	let currentOtherPlayerIndex = 0;
	let rank = 0;  
	let killed = []; // players killed by this shot

	calculateDamageAndCyclePlayers();

	return {
		onTick: onTick
	}

	function onTick(stage, deltaInSeconds) {
		timeCounter += deltaInSeconds * 1000;
		switch (currentState) {
			case States.FALLING:
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
				gameGraphics.setTankVisibility(currentPlayer.color, false);
				// TODO: Explode
				currentState = States.SHOWING_COMMENT;
				break;
			case States.SHOWING_COMMENT:
				// TODO: Wait and then remove comment
				calculateDamageAndCyclePlayers(); // Continue to the (potential) next player
				break;
		}
		gameGraphics.updateGameImage();
	}

	function checkNoAmmo() {
		if (weapon.ammo > 0) {
			weapon.ammo--;
		}
		if (weapon.ammo === 0) { 
			pList[currentPlayerIndex].weaponList.splice(pList[currentPlayerIndex].currentWep, 1);
			pList[currentPlayerIndex].currentWep--;
			weapon = null;
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
			// TODO: Update landTop
			shouldEnd = true;
		}
		gameGraphics.updateTankPosition(currentPlayer.color, currentPlayer.posX, currentPlayer.posY);
		return shouldEnd;
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

	function beforeFallLossCalc() {
		killed[currentOtherPlayerIndex] = false;
		let shouldFall = false;
		let deployParachute = false;
		let player = pList[currentOtherPlayerIndex];
		if (player.maxPower > 0) {
			let statDam1 = 0;
			let statDam2 = 0;
			let lossexpall = 0;
			let headshots = 0;
			for (let j = 0; j < weapon.leaps; ++j) {
				for (let i = 0; i < shots.length; ++i) {
					let shot = shots[i][j];
					let lossexp = calcTankDam(player, shot, weapon);
					if (lossexp === -1) {
						if (currentOtherPlayerIndex != currentPlayerIndex) {
							headshots++;
						}
						lossexpall += calcHeadshot(weapon);
					}
					else {
						lossexpall += lossexp;
					}
					if (currentOtherPlayerIndex != currentPlayerIndex && lossexp != 0) {
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
			decreasePower(currentOtherPlayerIndex, lossexpall, lossfallall, headshots);
		 	pList[currentPlayerIndex].roundStats.headshots += headshots;
			if (player.maxPower < 1) {
				if (rank < livePlayers + 1) {
					rank = livePlayers + 1;
				}
				killed[currentOtherPlayerIndex] = true;
			}
			statDam1 += lossexpall;
			statDam2 += lossfallall;
			if (currentOtherPlayerIndex != currentPlayerIndex) {
				pList[currentPlayerIndex].roundStats.damage += (statDam1 + statDam2);
			}
		}
		return { shouldFall: shouldFall, deployParachute: deployParachute};
	}

	function afterFallUpdateOfStats() {
		let currentPlayer = pList[currentPlayerIndex];
		for (let j = 0; j < weapon.leaps; ++j) {
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

	function calcTankDam(player, shot, weapon) {
		let dx = shot.px - player.posX;
		let dy = shot.py - player.posY;
		let d = dx * dx + dy * dy;
		let dam = weapon.dam * weapon.dam;
		let l = 0;
		if (d < 8) {
			l = -1;
		}
		else if (d < dam) {
			let x = weapon.dam;
			l = Math.round((x/(x + 30) * 2000) * ((dam - d)/(dam)));
		}
		return l;
	}

	function calcHeadshot(weapon) {
		return 1000 + weapon.dam * 10;
	}	

	function decreasePower(playerIndex, lossexpall, lossfallall, headshots) {
		let player = pList[playerIndex];
		let loss = lossexpall;
		if (weapon.class === "piercing") {
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
	 	if (lossexpall + lossfallall > 0 || headshots > 0) {
	 		// TODO: Draw comment
	 	}
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
}