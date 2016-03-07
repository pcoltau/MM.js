function createMenu(stage, assets) {
    // TODO: Figure out how to make caching (of canvas - for performance) work with text (it resets the font).

    var halfScreenWidth = SCREEN_WIDTH / 2;
    var halfScreenHeight = SCREEN_HEIGHT / 2;

    var backgroundContainer = createBackground();
    var menuContainer = createMainMenu();

    stage.addChild(backgroundContainer, menuContainer);
    
    return {
        onTick: onTick
    };

    function createBackground() {
        var backgroundContainer = new createjs.Container();

        var menutop = new createjs.Bitmap(assets.getResult("menutop.pcx"));
        menutop.x = halfScreenWidth - menutop.image.width / 2;
        menutop.y = halfScreenHeight - menutop.image.height;
        backgroundContainer.addChild(menutop);
        var menubot = new createjs.Bitmap(assets.getResult("menubot.pcx"));
        menubot.x = halfScreenWidth - menubot.image.width / 2;
        menubot.y = halfScreenHeight;
        backgroundContainer.addChild(menubot);

        var halfMenuWidth = menutop.image.width / 2;
        var halfMenuHeight = (menutop.image.height + menubot.image.height) / 2;

        // SetColor(DarkGray);
        // Line(GetMaxX div 2 - 319,GetMaxY div 2 + 240,GetMaxX div 2 + 320,GetMaxY div 2 + 240);
        // Line(GetMaxX div 2 + 320,GetMaxY div 2 - 239,GetMaxX div 2 + 320,GetMaxY div 2 + 239);
        // SetColor(Gray);
        // Line(GetMaxX div 2 - 319,GetMaxY div 2 - 239,GetMaxX div 2 + 320,GetMaxY div 2 - 239);
        // Line(GetMaxX div 2 - 319,GetMaxY div 2 - 239,GetMaxX div 2 - 319,GetMaxY div 2 + 240);
        var shape = new createjs.Shape();
        line(shape.graphics, Colors.DARKGRAY, halfScreenWidth - halfMenuWidth, halfScreenHeight + halfMenuHeight, halfScreenWidth + halfMenuWidth, halfScreenHeight + halfMenuHeight)
        line(shape.graphics, Colors.DARKGRAY, halfScreenWidth + halfMenuWidth, halfScreenHeight - halfMenuHeight, halfScreenWidth + halfMenuWidth, halfScreenHeight + halfMenuHeight)
        line(shape.graphics, Colors.GRAY, halfScreenWidth - halfMenuWidth, halfScreenHeight - halfMenuHeight, halfScreenWidth + halfMenuWidth, halfScreenHeight - halfMenuHeight)
        line(shape.graphics, Colors.GRAY, halfScreenWidth - halfMenuWidth, halfScreenHeight - halfMenuHeight, halfScreenWidth - halfMenuWidth, halfScreenHeight + halfMenuHeight)
        backgroundContainer.addChild(shape);

        // SetColor(DarkGray);
        // OutTextXY(GetMaxX div 2 + 286,GetMaxY div 2 + 230,'v'+FloatToStr(Version,0,1));
        outTextXY(backgroundContainer, Colors.DARKGRAY, halfScreenWidth + 286, halfScreenHeight + 230, "v1.0");

        return backgroundContainer;
    }

    function createMainMenu() {
        var menuContainer = new createjs.Container();
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
        var shape = new createjs.Shape();
        bar(shape.graphics, Colors.DARKGRAY, x1+2,y1+2,x2+2,y2+2);
        menuContainer.addChild(shape);

        var menuback = new createjs.Bitmap(assets.getResult("menuback.pcx"));
        menuback.x = x1;
        menuback.y = y1;
        // crop bitmap
        menuback.sourceRect = new createjs.Rectangle(0, 0, x2 - x1, y2 - y1);
        menuContainer.addChild(menuback);

        //  SetColor(DarkGray);
        //  OutTextXY(GetMaxX div 2 - 68,y[1]+10,'M A I N   M E N U');
        outTextXY(menuContainer, Colors.DARKGRAY, halfScreenWidth - 68, y1 + 10, "M A I N   M E N U");

        return menuContainer;
    }

    function onTick(stage, deltaInSeconds) {

    }
}