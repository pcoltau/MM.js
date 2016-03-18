SCREEN_WIDTH = 1024;
SCREEN_HEIGHT = 768;
SCREEN_WIDTH_CENTER = SCREEN_WIDTH / 2;
SCREEN_HEIGHT_CENTER = SCREEN_HEIGHT / 2;

function line(graphics, color, x1, y1, x2, y2) {
  // TODO: What if the line is straight? Then it should only be corrected in one direction? Maybe some min/max is neccessary?
  graphics.beginStroke(color).moveTo(x1, y1).lineTo(x2 - 0.01, y2 - 0.01).endStroke();
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
  var text = new createjs.Text(text, "11px TerminalVector", color);
  if (centered) {
    text.textAlign = "center";
  }
  text.scaleY = 0.84;
  text.x = x;
  text.y = y;
  if (shadowColor) {
    text.shadow = new createjs.Shadow(shadowColor, 2, 2, 0);
  }
  container.addChild(text);
}

function showPCX(assets, container, name, x, y, width, height) {
  var bitmap = new createjs.Bitmap(assets.getResult(name));
  bitmap.x = x;
  bitmap.y = y;
  // crop bitmap
  bitmap.sourceRect = new createjs.Rectangle(0, 0, width + 1, height + 1);
  container.addChild(bitmap);
}