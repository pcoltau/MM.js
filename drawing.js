"use strict";

function drawFrame(container, x1, y1, x2, y2, color) {
    var shape = new createjs.Shape();
    var c = color ? color : Colors.BLACK;
    // SetFillStyle(SolidFill,Black);
    // Bar(X1+1,Y1+1,X2-1,Y2-1);
    // SetColor(White);
    // Line(X1+1,Y2,X2,Y2);
    // Line(X2,Y1,X2,Y2);
    // SetColor(Gray);
    // Line(X1,Y1,X2-1,Y1);
    // Line(X1,Y1,X1,Y2);            
    bar(shape.graphics, c, x1 + 1, y1 + 1, x2 - 1, y2 - 1);
    line(shape.graphics, Colors.WHITE, x1 + 1, y2, x2, y2);
    line(shape.graphics, Colors.WHITE, x2, y1, x2, y2);
    line(shape.graphics, Colors.GRAY, x1, y1, x2 - 1, y1);
    line(shape.graphics, Colors.GRAY, x1, y1, x1, y2);
    container.addChild(shape);
}

function drawBox(assets, container, x1, y1, x2, y2, addShadow) {
    var mainContainer = new createjs.Container();
    var backContainer = new createjs.Container();

	if (y2 - y1 > 240) {
		showPCX(assets, backContainer, "backtop.pcx", x1, y1, x2 - x1, 239);
		showPCX(assets, backContainer, "backbot.pcx", x1, y1 + 240, x2 - x1, y2 - y1 - 240);
	}
	else {
//      Show_PCX('Gfx\backtop.pcx',x1,y1,x2-x1,y2-y1);
		showPCX(assets, backContainer, "backtop.pcx", x1, y1, x2 - x1, y2- y1);
	}
	if (addShadow) {
		backContainer.shadow = new createjs.Shadow(Colors.DARKGRAY, 2, 2, 0);
	}
	mainContainer.addChild(backContainer);
	var shape = new createjs.Shape();
	line(shape.graphics, Colors.WHITE, x1, y1, x1, y2);
	line(shape.graphics, Colors.WHITE, x1, y1, x2, y1);
	line(shape.graphics, Colors.GRAY, x2, y1, x2, y2);
	line(shape.graphics, Colors.GRAY, x1, y2, x2, y2);
	mainContainer.addChild(shape);
	container.addChild(mainContainer);
}
