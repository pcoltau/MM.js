"use strict";

function createRoundStatsScreen(gameGraphics) {
	let isVisible = false;

	let players = [];
	let roundNumber = 1;
	let winCon = 1;
	let economy = 3;
	let roundList = [];
	let overallList = [];
	let rankListRound = [];
	let rankListOverall = [];
	let totalDamRound = [];
	let totalDamOverall = [];
	let totalDamSumRound = 0;
	let totalDamSumOverall = 0;
	let maxDamRound = 0;
	let maxDamOverall = 0;
	let currentView = "primary";
	let barsAnimated = false;
	let animating = false;
	let animationProgress = 1;
	let onDone = null;

	return {
		onShow: onShow,
		onKeyDown: onKeyDown,
		onTick: onTick,
		show: show,
		hide: hide,
		getRoundOrder: getRoundOrder
	};

	function show(statsPlayers, round, winConIndex, economyFactor, onExit) {
		players = statsPlayers || [];
		roundNumber = round || 1;
		winCon = (winConIndex || 0) + 1;
		economy = economyFactor || 3;
		onDone = onExit;
		isVisible = true;
		currentView = "primary";
		barsAnimated = false;
		animating = false;
		animationProgress = 1;
		applyRoundTotals();
		sortLists();
		calcIncome();
		showPrimary();
	}

	function hide() {
		isVisible = false;
		gameGraphics.hideRoundStats();
	}

	function onShow() {
		// No-op; use show() to set data.
	}

	function onKeyDown(stage, key) {
		if (!isVisible) {
			return;
		}
		switch (key) {
			case Keys.SPACE:
				if (currentView === "primary") {
					currentView = "secondary";
					animationProgress = barsAnimated ? 1 : 0;
					animating = !barsAnimated;
					showSecondary(animationProgress);
				}
				else {
					currentView = "primary";
					animating = false;
					showPrimary();
				}
				break;
			case Keys.ESCAPE:
				if (onDone) {
					onDone();
				}
				break;
		}
	}

	function onTick(stage, deltaInSeconds) {
		if (!isVisible || !animating) {
			return;
		}
		animationProgress = Math.min(1, animationProgress + deltaInSeconds * 2);
		showSecondary(animationProgress);
		if (animationProgress >= 1) {
			animating = false;
			barsAnimated = true;
		}
	}

	function getRoundOrder() {
		return roundList.slice();
	}

	function applyRoundTotals() {
		for (let i = 0; i < players.length; ++i) {
			let roundStats = players[i].roundStats;
			let overallStats = players[i].overallStats;
			overallStats.shots += roundStats.shots;
			overallStats.headshots += roundStats.headshots;
			overallStats.misses += roundStats.misses;
			overallStats.damage += roundStats.damage;
			overallStats.kills += roundStats.kills;
			overallStats.place += roundStats.place;
		}
	}

	function sortLists() {
		let playersCount = players.length;
		let roundScores = [];
		for (let i = 0; i < playersCount; ++i) {
			roundScores[i] = getScore(players[i].roundStats, winCon);
		}

		let sortedRound = buildSortedList(playersCount, roundScores, null);
		roundList = sortedRound.list;
		rankListRound = sortedRound.rankList;
		assignRoundPoints(roundScores, sortedRound.list);

		let overallScores = [];
		let overallSecScores = [];
		for (let i = 0; i < playersCount; ++i) {
			overallScores[i] = players[i].overallStats.points;
			overallSecScores[i] = getScore(players[i].overallStats, winCon);
		}
		let sortedOverall = buildSortedList(playersCount, overallScores, overallSecScores);
		overallList = sortedOverall.list;
		rankListOverall = sortedOverall.rankList;
		calcDamageTotals();
	}

	function calcDamageTotals() {
		totalDamRound = [];
		totalDamOverall = [];
		totalDamSumRound = 0;
		totalDamSumOverall = 0;
		maxDamRound = 0;
		maxDamOverall = 0;

		for (let i = 0; i < players.length; ++i) {
			let roundPlayer = players[roundList[i]];
			let overallPlayer = players[overallList[i]];
			let roundDam = roundPlayer.roundStats.damage;
			let overallDam = overallPlayer.overallStats.damage;
			totalDamRound[i] = roundDam;
			totalDamOverall[i] = overallDam;
			totalDamSumRound += roundDam;
			totalDamSumOverall += overallDam;
			if (maxDamRound < roundDam) {
				maxDamRound = roundDam;
			}
			if (maxDamOverall < overallDam) {
				maxDamOverall = overallDam;
			}
		}
	}

	function buildSortedList(playersCount, scores, secScores) {
		let list = [];
		for (let i = 0; i < playersCount; ++i) {
			list.push(i);
		}
		list.sort(function(a, b) {
			if (scores[b] !== scores[a]) {
				return scores[b] - scores[a];
			}
			if (secScores) {
				return secScores[b] - secScores[a];
			}
			return 0;
		});

		let rankList = [];
		let lastScore = null;
		let lastSecScore = null;
		let rank = 1;
		for (let i = 0; i < list.length; ++i) {
			let index = list[i];
			if (secScores) {
				let secScore = secScores[index];
				if (lastSecScore === null || secScore !== lastSecScore) {
					rank = i + 1;
				}
				rankList[i] = rank;
				lastSecScore = secScore;
			}
			else {
				let score = scores[index];
				if (lastScore === null || score !== lastScore) {
					rank = i + 1;
				}
				rankList[i] = rank;
				lastScore = score;
			}
		}

		return { list: list, rankList: rankList };
	}

	function assignRoundPoints(roundScores, roundOrder) {
		let playersCount = players.length;
		let lastScore = null;
		let points = 0;
		for (let i = playersCount - 1; i >= 0; --i) {
			let playerIndex = roundOrder[i];
			let score = roundScores[playerIndex];
			if (lastScore === null || score !== lastScore) {
				points = (playersCount - 1) - i;
			}
			players[playerIndex].roundStats.points = points;
			lastScore = score;
		}
		for (let i = 0; i < playersCount; ++i) {
			players[i].overallStats.points += players[i].roundStats.points;
		}
	}

	function calcIncome() {
		let playersCount = players.length;
		for (let i = 0; i < playersCount; ++i) {
			let roundStats = players[i].roundStats;
			let base = 0;
			switch (playersCount - roundStats.points) {
				case 1: base = 3000; break;
				case 2: base = 2500; break;
				case 3: base = 2000; break;
				case 4: base = 1750; break;
				case 5: base = 1500; break;
				case 6: base = 1200; break;
				case 7: base = 1000; break;
				case 8: base = 800; break;
				default: base = 0; break;
			}
			base += 300 * roundStats.headshots;
			base += 500 * roundStats.kills;
			base += Math.round(roundStats.damage / (playersCount * 2));

			let factor = economy;
			if (economy === 3) {
				factor = 4;
			}
			if (economy === 4) {
				factor = 8;
			}
			roundStats.profit = Math.floor((base * factor) / 2);
			players[i].overallStats.profit += roundStats.profit;
		}
	}

	function getScore(stats, winCondit) {
		switch (winCondit) {
			case 1:
				return players.length - stats.place + 1;
			case 2:
				return stats.shots === 0 ? 0 : (stats.shots - stats.misses) / stats.shots;
			case 3:
				return stats.kills;
			case 4:
				return stats.damage;
			case 5:
				return stats.shots === 0 ? 0 : stats.damage / stats.shots;
			case 6:
				return stats.headshots;
		}
		return 0;
	}

	function showPrimary() {
		gameGraphics.showRoundStatsPrimary(buildPrimaryViewModel());
	}

	function showSecondary(progress) {
		gameGraphics.showRoundStatsSecondary(buildSecondaryViewModel(progress));
	}

	function buildPrimaryViewModel() {
		return {
			roundTitle: "S T A T I S T I C S   F O R   R O U N D   " + roundNumber,
			overallTitle: "O V E R A L L   S T A T I S T I C S",
			hintText: "Press space for next statistics or ESC to continue game.",
			roundRows: buildPrimaryRows(true),
			overallRows: buildPrimaryRows(false)
		};
	}

	function buildSecondaryViewModel(progress) {
		return {
			roundTitle: "S T A T I S T I C S   F O R   R O U N D   " + roundNumber,
			overallTitle: "O V E R A L L   S T A T I S T I C S",
			hintText: "Press space for previous statistics or ESC to continue game.",
			roundRows: buildSecondaryRows(true, progress),
			overallRows: buildSecondaryRows(false, progress)
		};
	}

	function buildPrimaryRows(isRound) {
		let statsList = isRound ? roundList : overallList;
		let ranks = isRound ? rankListRound : rankListOverall;
		let rows = [];
		for (let i = 0; i < players.length; ++i) {
			let playerIndex = statsList[i];
			let player = players[playerIndex];
			let stats = isRound ? player.roundStats : player.overallStats;
			let miss = 0;
			let hits = 0;
			if (stats.shots !== 0) {
				miss = Math.round(stats.misses / stats.shots * 100);
				hits = Math.round((stats.shots - stats.misses) / stats.shots * 100);
			}
			let statsText = makeSpaces(stats.points, 3) + "  " +
				makeSpaces("$" + stats.profit, 9) + "  " +
				makeSpaces(stats.shots, 5) + "  " +
				makeSpaces(hits, 4) + "% " +
				makeSpaces(miss, 5) + "% " +
				makeSpaces(stats.kills, 5);
			rows.push({
				rank: ranks[i],
				name: player.name,
				color: player.color,
				statsText: statsText
			});
		}
		return rows;
	}

	function buildSecondaryRows(isRound, progress) {
		let statsList = isRound ? roundList : overallList;
		let ranks = isRound ? rankListRound : rankListOverall;
		let totalDam = isRound ? totalDamRound : totalDamOverall;
		let totalSum = isRound ? totalDamSumRound : totalDamSumOverall;
		let maxDam = isRound ? maxDamRound : maxDamOverall;
		let rows = [];
		for (let i = 0; i < players.length; ++i) {
			let playerIndex = statsList[i];
			let player = players[playerIndex];
			let stats = isRound ? player.roundStats : player.overallStats;
			let total = totalDam[i];
			let maxLen = maxDam === 0 ? 0 : Math.round((total / maxDam) * 126);
			let length = Math.round(maxLen * progress);
			let percent = totalSum === 0 ? 0 : Math.round(((length * maxDam) / 1.26) / totalSum);
			let damPerShot = stats.shots === 0 ? "   0.00" : makeSpaces((total / stats.shots).toFixed(2), 7);
			rows.push({
				rank: ranks[i],
				name: player.name,
				color: player.color,
				secColor: player.secColor,
				barLength: length,
				percentText: percent + "%",
				damageText: makeSpaces(total, 6),
				damPerShotText: damPerShot,
				headshotsText: makeSpaces(stats.headshots, 6)
			});
		}
		return rows;
	}

	function makeSpaces(value, count) {
		let str = String(value);
		while (str.length < count) {
			str = " " + str;
		}
		return str;
	}
}
