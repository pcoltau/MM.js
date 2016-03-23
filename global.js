"use strict";

var SCREEN_WIDTH = 1024;
var SCREEN_HEIGHT = 768;
var SCREEN_WIDTH_CENTER = SCREEN_WIDTH / 2;
var SCREEN_HEIGHT_CENTER = SCREEN_HEIGHT / 2;

var playerColorTable = [GameColors.BLUE, GameColors.LIGHTRED, GameColors.GREEN, GameColors.YELLOW, GameColors.MAGENTA, GameColors.CYAN, GameColors.WHITE, GameColors.LIGHTGRAY, 
                        GameColors.DARKBLUE, GameColors.DARKRED, GameColors.DARKGREEN, GameColors.DARKBROWN, GameColors.DARKMAGENTA, GameColors.DARKCYAN, GameColors.LIGHTGRAY, GameColors.GRAY];

function line(graphics, color, x1, y1, x2, y2) {
  // Note: We need to shorten the line to make it equivalent to the Pascal line function. We only use straight lines in MM, so it is only necessary to shorten non-dialogonally.
  var startX = Math.min(x1, x2);
  var endX = Math.max(x1, x2);
  var startY = Math.min(y1, y2);
  var endY = Math.max(y1, y2);
  if (y1 === y2) {
    endX -= 0.01;
  }
  if (x1 === x2) {
    endY -= 0.01;
  }
  graphics.beginStroke(color).moveTo(startX, startY).lineTo(endX, endY).endStroke();
}

function bar(graphics, color, x1, y1, x2, y2) {
  var startX = Math.min(x1, x2);
  var endX = Math.max(x1, x2);
  var startY = Math.min(y1, y2);
  var endY = Math.max(y1, y2);
  graphics.beginStroke(color).beginFill(color).drawRect(startX, startY, endX - startX, endY - startY).endStroke().endFill();
}

function barAsShape(color, x1, y1, x2, y2) {
  var startX = Math.min(x1, x2);
  var endX = Math.max(x1, x2);
  var startY = Math.min(y1, y2);
  var endY = Math.max(y1, y2);
  var shape = new createjs.Shape();
  bar(shape.graphics, color, 0, 0, endX - startX, endY - startY);
  shape.x = startX;
  shape.y = startY;
  return shape;
}

function putPixel(graphics, color, x, y) {
  graphics.beginStroke(color).moveTo(x, y).lineTo(x + 0.01, y + 0.01).endStroke();
}

function outTextXY(container, color, text, x, y, centered, shadowColor) {
  // This is the closest approximation to the DOS font and size used in the original Mortar Mayhem (combined with the font style in style.css)
  var text = outTextXYAsText(color, text, x, y, centered, shadowColor);
  container.addChild(text);
}

function outTextXYAsText(color, text, x, y, centered, shadowColor) {
  // This is the closest approximation to the DOS font and size used in the original Mortar Mayhem (combined with the font style in style.css)
  var text = new createjs.Text(text, "11px TerminalVector", color);
  if (centered) {
    text.textAlign = "center";
  }
  text.scaleY = 0.84;
  text.x = x;
  text.y = y - 0.5;
  if (shadowColor) {
    text.shadow = new createjs.Shadow(shadowColor, 2, 2, 0);
  }
  return text;
}

function showPCX(assets, container, name, x, y, width, height) {
  var bitmap = new createjs.Bitmap(assets.getResult(name));
  bitmap.x = x - 0.5;
  bitmap.y = y - 0.5;
  // crop bitmap
  bitmap.sourceRect = new createjs.Rectangle(0, 0, width + 1, height + 1);
  container.addChild(bitmap);
}