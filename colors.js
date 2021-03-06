"use strict";

let Palette = {
	menuPalette: ["rgb(11, 11, 11)", "rgb(11, 27, 11)", "rgb(11, 43, 11)", "rgb(11, 59, 11)", "rgb(11, 78, 11)", "rgb(11, 94, 11)", "rgb(11, 110, 11)", "rgb(11, 128, 11)", "rgb(27, 11, 11)", "rgb(27, 27, 11)", "rgb(27, 43, 11)", "rgb(43, 11, 11)", "rgb(43, 27, 11)", "rgb(43, 43, 11)", "rgb(59, 27, 11)", "rgb(59, 43, 11)", "rgb(59, 59, 11)", "rgb(78, 43, 11)", "rgb(78, 59, 11)", "rgb(11, 11, 27)", "rgb(11, 27, 27)", "rgb(27, 11, 27)", "rgb(27, 27, 27)", "rgb(27, 43, 27)", "rgb(43, 11, 27)", "rgb(43, 27, 27)", "rgb(43, 43, 27)", "rgb(43, 59, 27)", "rgb(59, 27, 27)", "rgb(59, 43, 27)", "rgb(59, 59, 27)", "rgb(78, 27, 27)", "rgb(78, 43, 27)", "rgb(78, 59, 27)", "rgb(94, 59, 27)", "rgb(94, 78, 27)", "rgb(11, 11, 43)", "rgb(11, 27, 43)", "rgb(27, 11, 43)", "rgb(27, 27, 43)", "rgb(27, 43, 43)", "rgb(43, 27, 43)", "rgb(43, 43, 43)", "rgb(43, 59, 43)", "rgb(59, 27, 43)", "rgb(59, 43, 43)", "rgb(59, 59, 43)", "rgb(59, 78, 43)", "rgb(78, 43, 43)", "rgb(78, 59, 43)", "rgb(78, 78, 43)", "rgb(78, 94, 43)", "rgb(94, 43, 43)", "rgb(94, 59, 43)", "rgb(94, 78, 43)", "rgb(94, 94, 43)", "rgb(27, 27, 59)", "rgb(27, 43, 59)", "rgb(43, 27, 59)", "rgb(43, 43, 59)", "rgb(43, 59, 59)", "rgb(59, 43, 59)", "rgb(59, 59, 59)", "rgb(59, 78, 59)", "rgb(78, 43, 59)", "rgb(78, 59, 59)", "rgb(78, 78, 59)", "rgb(78, 94, 59)", "rgb(94, 43, 59)", "rgb(94, 59, 59)", "rgb(94, 78, 59)", "rgb(94, 94, 59)", "rgb(94, 110, 59)", "rgb(27, 43, 78)", "rgb(43, 43, 78)", "rgb(43, 59, 78)", "rgb(59, 43, 78)", "rgb(59, 59, 78)", "rgb(59, 78, 78)", "rgb(78, 59, 78)", "rgb(78, 78, 78)", "rgb(78, 94, 78)", "rgb(94, 59, 78)", "rgb(94, 78, 78)", "rgb(94, 94, 78)", "rgb(94, 110, 78)", "rgb(43, 43, 94)", "rgb(43, 59, 94)", "rgb(59, 43, 94)", "rgb(59, 59, 94)", "rgb(59, 78, 94)", "rgb(78, 59, 94)", "rgb(78, 78, 94)", "rgb(59, 59, 110)", "rgb(59, 68, 119)", "rgb(78, 59, 110)", "rgb(78, 78, 110)", "rgb(94, 59, 94)", "rgb(94, 59, 110)", "rgb(94, 78, 94)", "rgb(94, 78, 110)", "rgb(59, 78, 128)", "rgb(78, 94, 94)", "rgb(94, 94, 94)", "rgb(78, 94, 110)", "rgb(94, 94, 110)", "rgb(94, 110, 94)", "rgb(94, 110, 110)", "rgb(78, 59, 128)", "rgb(78, 78, 128)", "rgb(78, 94, 128)", "rgb(94, 78, 128)", "rgb(94, 94, 128)", "rgb(94, 110, 128)", "rgb(78, 78, 145)", "rgb(78, 94, 145)", "rgb(94, 78, 145)", "rgb(94, 94, 145)", "rgb(94, 110, 145)", "rgb(78, 78, 162)", "rgb(78, 94, 162)", "rgb(94, 78, 162)", "rgb(94, 94, 162)", "rgb(110, 43, 43)", "rgb(110, 59, 43)", "rgb(128, 59, 43)", "rgb(110, 59, 59)", "rgb(110, 78, 52)", "rgb(128, 59, 59)", "rgb(110, 59, 78)", "rgb(110, 78, 78)", "rgb(128, 59, 78)", "rgb(128, 78, 43)", "rgb(128, 78, 59)", "rgb(128, 78, 78)", "rgb(145, 59, 59)", "rgb(145, 78, 59)", "rgb(145, 78, 78)", "rgb(162, 78, 59)", "rgb(110, 94, 43)", "rgb(110, 94, 59)", "rgb(110, 94, 78)", "rgb(110, 110, 59)", "rgb(110, 110, 78)", "rgb(128, 94, 59)", "rgb(128, 94, 78)", "rgb(128, 110, 59)", "rgb(135, 103, 68)", "rgb(145, 94, 78)", "rgb(145, 110, 59)", "rgb(145, 110, 78)", "rgb(162, 78, 78)", "rgb(162, 94, 78)", "rgb(162, 110, 78)", "rgb(179, 94, 78)", "rgb(110, 78, 94)", "rgb(110, 94, 94)", "rgb(110, 110, 94)", "rgb(128, 78, 94)", "rgb(128, 94, 94)", "rgb(128, 110, 94)", "rgb(145, 78, 94)", "rgb(145, 94, 94)", "rgb(145, 110, 94)", "rgb(162, 94, 94)", "rgb(162, 110, 94)", "rgb(179, 94, 94)", "rgb(110, 78, 110)", "rgb(110, 94, 110)", "rgb(110, 110, 110)", "rgb(128, 94, 110)", "rgb(128, 110, 110)", "rgb(145, 94, 110)", "rgb(145, 110, 110)", "rgb(162, 94, 110)", "rgb(110, 78, 128)", "rgb(110, 94, 128)", "rgb(128, 94, 128)", "rgb(110, 78, 145)", "rgb(110, 94, 145)", "rgb(128, 94, 145)", "rgb(145, 94, 145)", "rgb(110, 94, 162)", "rgb(128, 94, 162)", "rgb(110, 128, 59)", "rgb(145, 128, 59)", "rgb(110, 128, 78)", "rgb(128, 128, 78)", "rgb(128, 145, 78)", "rgb(145, 128, 78)", "rgb(145, 145, 78)", "rgb(110, 128, 94)", "rgb(110, 128, 110)", "rgb(128, 128, 94)", "rgb(128, 128, 110)", "rgb(128, 145, 94)", "rgb(145, 128, 94)", "rgb(145, 145, 94)", "rgb(145, 145, 110)", "rgb(145, 162, 103)", "rgb(162, 110, 110)", "rgb(162, 128, 78)", "rgb(162, 128, 94)", "rgb(162, 145, 78)", "rgb(162, 145, 94)", "rgb(162, 145, 110)", "rgb(162, 162, 94)", "rgb(162, 162, 110)", "rgb(162, 179, 110)", "rgb(179, 110, 110)", "rgb(179, 128, 94)", "rgb(179, 145, 78)", "rgb(179, 145, 94)", "rgb(195, 145, 94)", "rgb(195, 162, 94)", "rgb(104, 110, 144)", "rgb(128, 110, 128)", "rgb(128, 110, 145)", "rgb(110, 110, 162)", "rgb(110, 110, 179)", "rgb(119, 119, 170)", "rgb(128, 110, 179)", "rgb(128, 128, 128)", "rgb(162, 110, 128)", "rgb(145, 110, 145)", "rgb(135, 119, 162)", "rgb(128, 128, 179)", "rgb(128, 128, 195)", "rgb(145, 145, 145)", "rgb(162, 162, 162)", "rgb(179, 110, 128)", "rgb(179, 145, 110)", "rgb(195, 145, 110)", "rgb(179, 162, 110)", "rgb(195, 162, 110)", "rgb(179, 179, 179)", "rgb(195, 195, 195)", "rgb(213, 213, 213)", "rgb(230, 230, 230)", "rgb(246, 246, 246)", "rgb(255, 255, 255)", "rgb(255, 255, 255)", "rgb(255, 255, 255)", "rgb(255, 255, 255)", "rgb(255, 255, 255)", "rgb(11, 11, 11)", "rgb(0, 102, 0)", "rgb(155, 155, 155)", "rgb(146, 146, 146)", "rgb(143, 143, 143)", "rgb(140, 140, 140)", "rgb(51, 51, 51)", "rgb(90, 90, 90)", "rgb(11, 11, 11)", "rgb(11, 11, 11)", "rgb(11, 11, 11)"],
	gamePalette: ["rgb(0, 0, 0)", "rgb(0, 0, 51)", "rgb(0, 0, 130)" /*was 102*/, "rgb(0, 0, 153)", "rgb(0, 0, 204)", "rgb(0, 0, 255)", "rgb(51, 0, 0)", "rgb(51, 0, 51)", "rgb(51, 0, 102)", "rgb(51, 0, 153)", "rgb(51, 0, 204)", "rgb(51, 0, 255)", "rgb(130, 0, 0)"/*was 102*/, "rgb(102, 0, 51)", "rgb(102, 0, 102)", "rgb(102, 0, 153)", "rgb(102, 0, 204)", "rgb(102, 0, 255)", "rgb(153, 0, 0)", "rgb(153, 0, 51)", "rgb(153, 0, 102)", "rgb(153, 0, 153)", "rgb(153, 0, 204)", "rgb(153, 0, 255)", "rgb(204, 0, 0)", "rgb(204, 0, 51)", "rgb(204, 0, 102)", "rgb(204, 0, 153)", "rgb(204, 0, 204)", "rgb(204, 0, 255)", "rgb(255, 0, 0)", "rgb(255, 0, 51)", "rgb(255, 0, 102)", "rgb(255, 0, 153)", "rgb(255, 0, 204)", "rgb(255, 0, 255)", "rgb(0, 51, 0)", "rgb(0, 51, 51)", "rgb(0, 51, 102)", "rgb(0, 51, 153)", "rgb(0, 51, 204)", "rgb(0, 51, 255)", "rgb(51, 51, 0)", "rgb(51, 51, 51)", "rgb(51, 51, 102)", "rgb(51, 51, 153)", "rgb(51, 51, 204)", "rgb(51, 51, 255)", "rgb(102, 51, 0)", "rgb(102, 51, 51)", "rgb(102, 51, 102)", "rgb(102, 51, 153)", "rgb(102, 51, 204)", "rgb(102, 51, 255)", "rgb(153, 51, 0)", "rgb(153, 51, 51)", "rgb(153, 51, 102)", "rgb(153, 51, 153)", "rgb(153, 51, 204)", "rgb(153, 51, 255)", "rgb(204, 51, 0)", "rgb(204, 51, 51)", "rgb(204, 51, 102)", "rgb(204, 51, 153)", "rgb(204, 51, 204)", "rgb(204, 51, 255)", "rgb(255, 51, 0)", "rgb(255, 51, 51)", "rgb(255, 51, 102)", "rgb(255, 51, 153)", "rgb(255, 51, 204)", "rgb(255, 51, 255)", "rgb(0, 102, 0)", "rgb(0, 102, 51)", "rgb(0, 102, 102)", "rgb(0, 102, 153)", "rgb(0, 102, 204)", "rgb(0, 102, 255)", "rgb(51, 102, 0)", "rgb(51, 102, 51)", "rgb(51, 102, 102)", "rgb(51, 102, 153)", "rgb(51, 102, 204)", "rgb(51, 102, 255)", "rgb(102, 102, 0)", "rgb(102, 102, 51)", "rgb(102, 102, 102)", "rgb(102, 102, 153)", "rgb(102, 102, 204)", "rgb(102, 102, 255)", "rgb(153, 102, 0)", "rgb(153, 102, 51)", "rgb(153, 102, 102)", "rgb(153, 102, 153)", "rgb(153, 102, 204)", "rgb(153, 102, 255)", "rgb(204, 102, 0)", "rgb(204, 102, 51)", "rgb(204, 102, 102)", "rgb(204, 102, 153)", "rgb(204, 102, 204)", "rgb(204, 102, 255)", "rgb(255, 102, 0)", "rgb(255, 102, 51)", "rgb(255, 102, 102)", "rgb(255, 102, 153)", "rgb(255, 102, 204)", "rgb(255, 102, 255)", "rgb(0, 153, 0)", "rgb(0, 153, 51)", "rgb(0, 153, 102)", "rgb(0, 153, 153)", "rgb(0, 153, 204)", "rgb(0, 153, 255)", "rgb(51, 153, 0)", "rgb(51, 153, 51)", "rgb(51, 153, 102)", "rgb(51, 153, 153)", "rgb(51, 153, 204)", "rgb(51, 153, 255)", "rgb(102, 153, 0)", "rgb(102, 153, 51)", "rgb(102, 153, 102)", "rgb(102, 153, 153)", "rgb(102, 153, 204)", "rgb(102, 153, 255)", "rgb(153, 153, 0)", "rgb(153, 153, 51)", "rgb(153, 153, 102)", "rgb(153, 153, 153)", "rgb(153, 153, 204)", "rgb(153, 153, 255)", "rgb(204, 153, 0)", "rgb(204, 153, 51)", "rgb(204, 153, 102)", "rgb(204, 153, 153)", "rgb(204, 153, 204)", "rgb(204, 153, 255)", "rgb(255, 153, 0)", "rgb(255, 153, 51)", "rgb(255, 153, 102)", "rgb(255, 153, 153)", "rgb(255, 153, 204)", "rgb(255, 153, 255)", "rgb(0, 204, 0)", "rgb(0, 204, 51)", "rgb(0, 204, 102)", "rgb(0, 204, 153)", "rgb(0, 204, 204)", "rgb(0, 204, 255)", "rgb(51, 204, 0)", "rgb(51, 204, 51)", "rgb(51, 204, 102)", "rgb(51, 204, 153)", "rgb(51, 204, 204)", "rgb(51, 204, 255)", "rgb(102, 204, 0)", "rgb(102, 204, 51)", "rgb(102, 204, 102)", "rgb(102, 204, 153)", "rgb(102, 204, 204)", "rgb(102, 204, 255)", "rgb(153, 204, 0)", "rgb(153, 204, 51)", "rgb(153, 204, 102)", "rgb(153, 204, 153)", "rgb(153, 204, 204)", "rgb(153, 204, 255)", "rgb(204, 204, 0)", "rgb(204, 204, 51)", "rgb(204, 204, 102)", "rgb(204, 204, 153)", "rgb(204, 204, 204)", "rgb(204, 204, 255)", "rgb(255, 204, 0)", "rgb(255, 204, 51)", "rgb(255, 204, 102)", "rgb(255, 204, 153)", "rgb(255, 204, 204)", "rgb(255, 204, 255)", "rgb(0, 255, 0)", "rgb(0, 255, 51)", "rgb(0, 255, 102)", "rgb(0, 255, 153)", "rgb(0, 255, 204)", "rgb(0, 255, 255)", "rgb(51, 255, 0)", "rgb(51, 255, 51)", "rgb(51, 255, 102)", "rgb(51, 255, 153)", "rgb(51, 255, 204)", "rgb(51, 255, 255)", "rgb(102, 255, 0)", "rgb(102, 255, 51)", "rgb(102, 255, 102)", "rgb(102, 255, 153)", "rgb(102, 255, 204)", "rgb(102, 255, 255)", "rgb(153, 255, 0)", "rgb(153, 255, 51)", "rgb(153, 255, 102)", "rgb(153, 255, 153)", "rgb(153, 255, 204)", "rgb(153, 255, 255)", "rgb(204, 255, 0)", "rgb(204, 255, 51)", "rgb(204, 255, 102)", "rgb(204, 255, 153)", "rgb(204, 255, 204)", "rgb(204, 255, 255)", "rgb(255, 255, 0)", "rgb(255, 255, 51)", "rgb(255, 255, 102)", "rgb(255, 255, 153)", "rgb(255, 255, 204)", "rgb(255, 255, 255)", "rgb(0, 0, 0)", "rgb(0, 0, 0)", "rgb(0, 0, 0)", "rgb(0, 0, 0)", "rgb(0, 0, 0)", "rgb(0, 0, 0)", "rgb(0, 0, 0)", "rgb(0, 0, 0)", "rgb(0, 0, 0)", "rgb(0, 0, 0)", "rgb(0, 0, 0)", "rgb(0, 0, 0)", "rgb(0, 0, 0)", "rgb(0, 0, 0)", "rgb(0, 0, 0)", "rgb(0, 0, 0)", "rgb(0, 0, 0)", "rgb(0, 0, 0)", "rgb(0, 0, 0)", "rgb(0, 0, 0)", "rgb(25, 0, 0)", "rgb(76, 0, 0)", "rgb(127, 0, 0)", "rgb(178, 0, 0)", "rgb(220, 0, 0)", "rgb(255, 25, 0)", "rgb(255, 76, 0)", "rgb(255, 127, 0)", "rgb(255, 178, 0)", "rgb(255, 220, 0)", "rgb(155, 155, 155)", "rgb(152, 152, 152)", "rgb(149, 149, 149)", "rgb(146, 146, 146)", "rgb(143, 143, 143)", "rgb(140, 140, 140)", "rgb(137, 137, 137)", "rgb(135, 135, 135)", "rgb(132, 132, 132)", "rgb(0, 0, 0)"],

	getMenuColor: function(index) {
		return Palette.menuPalette[index];
	},
	getGameColor: function(index) {
		return Palette.gamePalette[index];
	},
	getRGBFromColor: function(color) {
		let m = color.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
    	if (m) {
        	return {r: m[1] & 0xFF, g: m[2] & 0xFF, b: m[3] & 0xFF, a: 0xFF};
    	}
	},
	compareColors: function(color1, color2) {
		return (color1.r === color2.r && color1.g === color2.g && color1.b === color2.b && color1.a === color2.a);
	}
}

let GameColors = {
	BLACK: Palette.getGameColor(0),
	WHITE: Palette.getGameColor(215),
	DARKBLUE: Palette.getGameColor(2),
	MEDBLUE: Palette.getGameColor(4),
	BLUE: Palette.getGameColor(5),
	LIGHTBLUE: Palette.getGameColor(47),
	BRIGHTBLUE: Palette.getGameColor(89),
	DARKRED: Palette.getGameColor(12),
	RED: Palette.getGameColor(18),
	LIGHTRED: Palette.getGameColor(30),
	PINK: Palette.getGameColor(143),
	CYAN: Palette.getGameColor(185),
	DARKCYAN: Palette.getGameColor(81),
	LIGHTBROWN: Palette.getGameColor(133),
	DARKBROWN: Palette.getGameColor(84),
	DARKESTBROWN: Palette.getGameColor(48),
	BROWN: Palette.getGameColor(90),
	LIGHTGRAY: Palette.getGameColor(129),
	GRAY: Palette.getGameColor(86),
	BRIGHTGRAY: Palette.getGameColor(172),
	DARKGRAY: Palette.getGameColor(43),
	YELLOW: Palette.getGameColor(210),
	LIGHTMAGENTA: Palette.getGameColor(35),
	MAGENTA: Palette.getGameColor(28),
	DARKMAGENTA: Palette.getGameColor(14),
	GREEN: Palette.getGameColor(180),
	MEDGREEN: Palette.getGameColor(144),
	DARKGREEN: Palette.getGameColor(108),
	DARKESTGREEN: Palette.getGameColor(72),
	ORANGE: Palette.getGameColor(138),
	DARKYELLOW: Palette.getGameColor(174),
	SKY: Palette.getGameColor(1)
};

let playerColorTable = [GameColors.BLUE, GameColors.LIGHTRED, GameColors.GREEN, GameColors.YELLOW, GameColors.MAGENTA, GameColors.CYAN, GameColors.WHITE, GameColors.LIGHTGRAY, 
                        GameColors.DARKBLUE, GameColors.DARKRED, GameColors.DARKGREEN, GameColors.DARKBROWN, GameColors.DARKMAGENTA, GameColors.DARKCYAN, GameColors.LIGHTGRAY, GameColors.GRAY];

let ExplosionColors = [
	Palette.getGameColor(210),
	Palette.getGameColor(245),
	Palette.getGameColor(174),
	Palette.getGameColor(244),
	Palette.getGameColor(138),
	Palette.getGameColor(243),
	Palette.getGameColor(102),
	Palette.getGameColor(242),
	Palette.getGameColor(66),
	Palette.getGameColor(241),
	Palette.getGameColor(30),
	Palette.getGameColor(240),
	Palette.getGameColor(24),
	Palette.getGameColor(239),
	Palette.getGameColor(18),
	Palette.getGameColor(238),
	Palette.getGameColor(12),
	Palette.getGameColor(237),
	Palette.getGameColor(6),
	Palette.getGameColor(236)
];

let MenuColors = {
	BLACK: Palette.getMenuColor(254),
	WHITE: Palette.getMenuColor(244),
	LIGHTGRAY: Palette.getMenuColor(242),
	GRAY: Palette.getMenuColor(252),
	BRIGHTGRAY: Palette.getMenuColor(243),
	DARKGRAY: Palette.getMenuColor(251),
	DARKESTGREEN: Palette.getMenuColor(246)
};