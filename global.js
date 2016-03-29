"use strict";

var SCREEN_WIDTH = 800;
var SCREEN_HEIGHT = 600;
var GET_MAX_X = SCREEN_WIDTH - 1; 
var GET_MAX_Y = SCREEN_HEIGHT - 1; 
var SCREEN_WIDTH_CENTER = Math.floor(GET_MAX_X / 2);
var SCREEN_HEIGHT_CENTER = Math.floor(GET_MAX_Y / 2);

var playerColorTable = [GameColors.BLUE, GameColors.LIGHTRED, GameColors.GREEN, GameColors.YELLOW, GameColors.MAGENTA, GameColors.CYAN, GameColors.WHITE, GameColors.LIGHTGRAY, 
                        GameColors.DARKBLUE, GameColors.DARKRED, GameColors.DARKGREEN, GameColors.DARKBROWN, GameColors.DARKMAGENTA, GameColors.DARKCYAN, GameColors.LIGHTGRAY, GameColors.GRAY];

function line(graphics, color, x1, y1, x2, y2) {
  graphics.beginStroke(color).moveTo(x1, y1).lineTo(x2, y2).endStroke();
}

function bar(graphics, color, x1, y1, x2, y2) {
  var startX = Math.min(x1, x2);
  var endX = Math.max(x1, x2);
  var startY = Math.min(y1, y2);
  var endY = Math.max(y1, y2);
  var width = endX - startX;
  var height = endY - startY;
  if (width > 0 && height > 0) {
    graphics.beginStroke(color).beginFill(color).drawRect(startX, startY, width, height).endFill().endStroke();
  }
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

function rectangle(graphics, color, x1, y1, x2, y2) {
  var startX = Math.min(x1, x2);
  var endX = Math.max(x1, x2);
  var startY = Math.min(y1, y2);
  var endY = Math.max(y1, y2);
  var width = endX - startX;
  var height = endY - startY;
  if (width > 0 && height > 0) {
    graphics.beginStroke(color).drawRect(startX, startY, width, height).endStroke();
  }
}

function putPixel(graphics, color, x, y) {
  graphics.beginStroke(color).drawRect(x, y, 0.001, 0.001).endStroke();
}

function outTextXY(container, color, text, x, y, textAlign, shadowColor) {
  // This is the closest approximation to the DOS font and size used in the original Mortar Mayhem (combined with the font style in style.css)
  var text = outTextXYAsText(color, text, x, y, textAlign, shadowColor);
  container.addChild(text);
}

function outTextXYAsText(color, text, x, y, textAlign, shadowColor) {
  // This is the closest approximation to the DOS font and size used in the original Mortar Mayhem (combined with the font style in style.css)
  var text = new createjs.Text(text, "11px TerminalVector", color);
  if (textAlign) {
    text.textAlign = textAlign;
  }
  text.textBaseline = "hanging";
  text.scaleY = 0.84;
  text.x = x;
  text.y = y + 0.5;
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
  bitmap.sourceRect = new createjs.Rectangle(0, 0, width + 1, height + 1); // +1, because that's how Show_PCX() worked in MM.
  container.addChild(bitmap);
}