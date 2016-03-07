function createMenu(stage, assets) {
    var halfScreenWidth = SCREEN_WIDTH / 2;
    var halfScreenHeight = SCREEN_HEIGHT / 2;

    var drawableShape = new createjs.Shape();
    createBackground();
    createMainMenu();

    // We cache the drawable shape to improve performance on static content.
    drawableShape.cache(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    stage.addChild(drawableShape);

    return {
        onTick: onTick
    };

    function createBackground() {
        // TODO: Use a Container for the background image
        var menutop = new createjs.Bitmap(assets.getResult("menutop.pcx"));
        menutop.x = halfScreenWidth - menutop.image.width / 2;
        menutop.y = halfScreenHeight - menutop.image.height;
        menutop.cache(0, 0, menutop.image.width, menutop.image.height);
        stage.addChild(menutop);
        var menubot = new createjs.Bitmap(assets.getResult("menubot.pcx"));
        menubot.x = halfScreenWidth - menubot.image.width / 2;
        menubot.y = halfScreenHeight;
        menubot.cache(0, 0, menubot.image.width, menubot.image.height);
        stage.addChild(menubot);

        var halfMenuWidth = menutop.image.width / 2;
        var halfMenuHeight = (menutop.image.height + menubot.image.height) / 2;

        // SetColor(DarkGray);
        // Line(GetMaxX div 2 - 319,GetMaxY div 2 + 240,GetMaxX div 2 + 320,GetMaxY div 2 + 240);
        // Line(GetMaxX div 2 + 320,GetMaxY div 2 - 239,GetMaxX div 2 + 320,GetMaxY div 2 + 239);
        // SetColor(Gray);
        // Line(GetMaxX div 2 - 319,GetMaxY div 2 - 239,GetMaxX div 2 + 320,GetMaxY div 2 - 239);
        // Line(GetMaxX div 2 - 319,GetMaxY div 2 - 239,GetMaxX div 2 - 319,GetMaxY div 2 + 240);
        line(drawableShape, Colors.DARKGRAY, halfScreenWidth - halfMenuWidth, halfScreenHeight + halfMenuHeight, halfScreenWidth + halfMenuWidth, halfScreenHeight + halfMenuHeight)
        line(drawableShape, Colors.DARKGRAY, halfScreenWidth + halfMenuWidth, halfScreenHeight - halfMenuHeight, halfScreenWidth + halfMenuWidth, halfScreenHeight + halfMenuHeight)
        line(drawableShape, Colors.GRAY, halfScreenWidth - halfMenuWidth, halfScreenHeight - halfMenuHeight, halfScreenWidth + halfMenuWidth, halfScreenHeight - halfMenuHeight)
        line(drawableShape, Colors.GRAY, halfScreenWidth - halfMenuWidth, halfScreenHeight - halfMenuHeight, halfScreenWidth - halfMenuWidth, halfScreenHeight + halfMenuHeight)

        // SetColor(DarkGray);
        // OutTextXY(GetMaxX div 2 + 286,GetMaxY div 2 + 230,'v'+FloatToStr(Version,0,1));
        outTextXY(stage, Colors.DARKGRAY, halfScreenWidth + 286, halfScreenHeight + 230, "v1.0");
    }

    function createMainMenu() {
        //  x[1] := GetMaxX div 2 - 80;
        //  y[1] := GetMaxY div 2 - 70;
        //  x[2] := x[1] + 159;
        //  y[2] := y[1] + 193;
        //  SetFillStyle(SolidFill,DarkGray);
        //  bar(x[1]+2,y[1]+2,x[2]+2,y[2]+2);
        var x1 = halfScreenWidth - 80;
        var y1 = halfScreenHeight - 70;
        var x2 = x1 + 159;
        var y2 = y1 + 193;
        bar(drawableShape, Colors.DARKGRAY, x1+2,y1+2,x2+2,y2+2);

        var menuback = new createjs.Bitmap(assets.getResult("menuback.pcx"));
        menuback.x = x1;
        menuback.y = y1;
        menuback.cache(0, 0, menuback.image.width, menuback.image.height);
        stage.addChild(menuback);

        //  SetColor(DarkGray);
        //  OutTextXY(GetMaxX div 2 - 68,y[1]+10,'M A I N   M E N U');
        outTextXY(stage, Colors.DARKGRAY, halfScreenWidth - 68, y1 + 10, "M A I N   M E N U");
    }

    function onTick(stage, deltaInSeconds) {

    }
}