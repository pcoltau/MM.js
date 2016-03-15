SCREEN_WIDTH = 1024;
SCREEN_HEIGHT = 768;
SCREEN_WIDTH_CENTER = SCREEN_WIDTH / 2;
SCREEN_HEIGHT_CENTER = SCREEN_HEIGHT / 2;

function line(graphics, color, x1, y1, x2, y2) {
  graphics.beginStroke(color).moveTo(x1, y1).lineTo(x2, y2).endStroke();
}

function bar(graphics, color, x1, y1, x2, y2) {
  var startX = Math.min(x1, x2);
  var endX = Math.max(x1, x2);
  var startY = Math.min(y1, y2);
  var endY = Math.max(y1, y2);
  graphics.beginFill(color).drawRect(startX, startY, endX - startX + 1, endY - startY + 1).endFill();
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
  line(graphics, color, x, y, x+0.5, y+0.5);
}

function outTextXY(container, color, x, y, text) {
  // This is the closest approximation to the DOS font and size used in the original Mortar Mayhem (combined with the font style in style.css)
  var text = outTextXYAsText(color, text);
  text.x = x;
  text.y = y;
  container.addChild(text);
}

function outTextXYAsText(color, text) {
  // This is the closest approximation to the DOS font and size used in the original Mortar Mayhem (combined with the font style in style.css)
  var text = new createjs.Text(text, "11px TerminalVector", color);
  text.scaleY = 0.85;
  return text;
}