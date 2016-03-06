SCREEN_WIDTH = 1024;
SCREEN_HEIGHT = 768;

function line(shape, color, x1, y1, x2, y2) {
  shape.graphics.setStrokeStyle(1).beginStroke(color).moveTo(x1, y1).lineTo(x2, y2).endStroke();
}

function putPixel(shape, color, x, y) {
  line(shape, color, x, y, x+1, y);
}

// TODO: Not working...yet!
function outTextXY(stage, color, x, y, text) {
    var text = new createjs.Text(text, "bold 12px monospace", color);
    text.x = x;
    text.y = y;
    text.textBaseline = "middle";
    stage.addChild(text);
}