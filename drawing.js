function drawFrame(x1, y1, x2, y2) {
    var shape = new createjs.Shape();

    // SetFillStyle(SolidFill,Black);
    // Bar(X1+1,Y1+1,X2-1,Y2-1);
    // SetColor(White);
    // Line(X1+1,Y2,X2,Y2);
    // Line(X2,Y1,X2,Y2);
    // SetColor(Gray);
    // Line(X1,Y1,X2-1,Y1);
    // Line(X1,Y1,X1,Y2);            
    bar(shape.graphics, Colors.BLACK, x1 + 1, y1 + 1, x2 - 1, y2 - 1);
    line(shape.graphics, Colors.WHITE, x1 + 1, y2, x2, y2);
    line(shape.graphics, Colors.WHITE, x2, y1, x2, y2);
    line(shape.graphics, Colors.GRAY, x1, y1, x2 - 1, y1);
    line(shape.graphics, Colors.GRAY, x1, y1, x1, y2);
    return shape;
}
