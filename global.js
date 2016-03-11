SCREEN_WIDTH = 1024;
SCREEN_HEIGHT = 768;

function line(graphics, color, x1, y1, x2, y2) {
  graphics.setStrokeStyle(1).beginStroke(color).moveTo(x1, y1).lineTo(x2, y2).endStroke();
}

function bar(graphics, color, x1, y1, x2, y2) {
  var startX = Math.min(x1, x2);
  var endX = Math.max(x1, x2);
  var startY = Math.min(y1, y2);
  var endY = Math.max(y1, y2);
  graphics.setStrokeStyle(0).beginFill(color).drawRect(startX, startY, endX - startX, endY - startY).endFill();
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
  line(graphics, color, x, y, x+1, y);
}

function outTextXY(container, color, x, y, text) {
  // This is the closest approximation to the DOS font and size used in the original Mortar Mayhem
  var text = outTextXYAsText(color, text);
  text.x = x - 1;
  text.y = y;
  container.addChild(text);
}

function outTextXYAsText(color, text) {
  // This is the closest approximation to the DOS font and size used in the original Mortar Mayhem
  var text = new createjs.Text(text, "12px TerminalVector", color);
  text.textBaseline = "hanging";
  text.scaleY = 0.80;
  return text;
}