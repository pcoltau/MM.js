"use strict";

let SCREEN_WIDTH = 800;
let SCREEN_HEIGHT = 600;
let GET_MAX_X = SCREEN_WIDTH - 1; 
let GET_MAX_Y = SCREEN_HEIGHT - 1; 
let SCREEN_WIDTH_CENTER = Math.floor(GET_MAX_X / 2);
let SCREEN_HEIGHT_CENTER = Math.floor(GET_MAX_Y / 2);

let playerColorTable = [GameColors.BLUE, GameColors.LIGHTRED, GameColors.GREEN, GameColors.YELLOW, GameColors.MAGENTA, GameColors.CYAN, GameColors.WHITE, GameColors.LIGHTGRAY, 
                        GameColors.DARKBLUE, GameColors.DARKRED, GameColors.DARKGREEN, GameColors.DARKBROWN, GameColors.DARKMAGENTA, GameColors.DARKCYAN, GameColors.LIGHTGRAY, GameColors.GRAY];

function line(graphics, color, x1, y1, x2, y2) {
  graphics.beginStroke(color).moveTo(x1, y1).lineTo(x2, y2).endStroke();
}

function bar(graphics, color, x1, y1, x2, y2) {
  let startX = Math.min(x1, x2);
  let endX = Math.max(x1, x2);
  let startY = Math.min(y1, y2);
  let endY = Math.max(y1, y2);
  let width = endX - startX;
  let height = endY - startY;
  if (width > 0 && height > 0) {
    graphics.beginStroke(color).beginFill(color).drawRect(startX, startY, width, height).endFill().endStroke();
  }
}

function barAsShape(color, x1, y1, x2, y2) {
  let startX = Math.min(x1, x2);
  let endX = Math.max(x1, x2);
  let startY = Math.min(y1, y2);
  let endY = Math.max(y1, y2);
  let shape = new createjs.Shape();
  bar(shape.graphics, color, 0, 0, endX - startX, endY - startY);
  shape.x = startX;
  shape.y = startY;
  return shape;
}

function rectangle(graphics, color, x1, y1, x2, y2) {
  let startX = Math.min(x1, x2);
  let endX = Math.max(x1, x2);
  let startY = Math.min(y1, y2);
  let endY = Math.max(y1, y2);
  let width = endX - startX;
  let height = endY - startY;
  if (width > 0 && height > 0) {
    graphics.beginStroke(color).drawRect(startX, startY, width, height).endStroke();
  }
}

function putPixel(graphics, color, x, y) {
  graphics.beginStroke(color).drawRect(x, y, 0.001, 0.001).endStroke();
}

function circle(graphics, color, x, y, r) {
  graphics.beginStroke(color).drawCircle(x, y, r).endStroke();
}

function outTextXY(container, color, text, x, y, textAlign, shadowColor) {
  // This is the closest approximation to the DOS font and size used in the original Mortar Mayhem (combined with the font style in style.css)
  let textObj = outTextXYAsText(color, text, x, y, textAlign, shadowColor);
  container.addChild(textObj);
}

function outTextXYAsText(color, text, x, y, textAlign, shadowColor) {
  // This is the closest approximation to the DOS font and size used in the original Mortar Mayhem (combined with the font style in style.css)
  let textObj = new createjs.Text(text, "11px TerminalVector", color);
  if (textAlign) {
    textObj.textAlign = textAlign;
  }
  textObj.textBaseline = "hanging";
  textObj.scaleY = 0.84;
  textObj.x = x;
  textObj.y = y + 0.5;
  if (shadowColor) {
    textObj.shadow = new createjs.Shadow(shadowColor, 2, 2, 0);
  }
  return textObj;
}

function showPCX(assets, container, name, x, y, width, height) {
  let bitmap = new createjs.Bitmap(assets.getResult(name));
  bitmap.x = x - 0.5;
  bitmap.y = y - 0.5;
  // crop bitmap
  bitmap.sourceRect = new createjs.Rectangle(0, 0, width + 1, height + 1); // +1, because that's how Show_PCX() worked in MM.
  container.addChild(bitmap);
}