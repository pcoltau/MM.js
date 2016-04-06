"use strict";

function drawFrame(container, colorScheme, x1, y1, x2, y2, color) {
    let shape = new createjs.Shape();
    let c = color ? color : colorScheme.BLACK;
    // SetFillStyle(SolidFill,Black);
    // Bar(X1+1,Y1+1,X2-1,Y2-1);
    // SetColor(White);
    // Line(X1+1,Y2,X2,Y2);
    // Line(X2,Y1,X2,Y2);
    // SetColor(Gray);
    // Line(X1,Y1,X2-1,Y1);
    // Line(X1,Y1,X1,Y2);            
    bar(shape.graphics, c, x1 + 1, y1 + 1, x2 - 1, y2 - 1);
    line(shape.graphics, colorScheme.WHITE, x1 + 1, y2, x2, y2);
    line(shape.graphics, colorScheme.WHITE, x2, y1, x2, y2);
    line(shape.graphics, colorScheme.GRAY, x1, y1, x2 - 1, y1);
    line(shape.graphics, colorScheme.GRAY, x1, y1, x1, y2);
    container.addChild(shape);
}

function drawBox(assets, container, colorScheme, x1, y1, x2, y2, addShadow) {
    let mainContainer = new createjs.Container();
    let backContainer = new createjs.Container();

	if (y2 - y1 > 240) {
		showPCX(assets, backContainer, "backtop.pcx", x1, y1, x2 - x1, 239);
		showPCX(assets, backContainer, "backbot.pcx", x1, y1 + 240, x2 - x1, y2 - y1 - 240);
	}
	else {
//      Show_PCX('Gfx\backtop.pcx',x1,y1,x2-x1,y2-y1);
		showPCX(assets, backContainer, "backtop.pcx", x1, y1, x2 - x1, y2- y1);
	}
	if (addShadow) {
		backContainer.shadow = new createjs.Shadow(colorScheme.DARKGRAY, 2, 2, 0);
	}
	mainContainer.addChild(backContainer);
	let shape = new createjs.Shape();
	line(shape.graphics, colorScheme.WHITE, x1, y1, x1, y2);
	line(shape.graphics, colorScheme.WHITE, x1, y1, x2, y1);
	line(shape.graphics, colorScheme.GRAY, x2, y1, x2, y2);
	line(shape.graphics, colorScheme.GRAY, x1, y2, x2, y2);
	mainContainer.addChild(shape);
	container.addChild(mainContainer);
}
