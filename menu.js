function createMenu(stage, assets) {
    var drawableShape = new createjs.Shape();
    createBackground()

    // We cache the drawable shape to improve performance on static content.
    drawableShape.cache(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    stage.addChild(drawableShape)

    return {
        onTick: onTick
    };

    function createBackground() {
        var halfScreenWidth = SCREEN_WIDTH / 2;
        var halfScreenHeight = SCREEN_HEIGHT / 2;

        // TODO: Use a Container for the background image
        var menutop = new createjs.Bitmap(assets.getResult("menutop.pcx"));
        menutop.x = halfScreenWidth - menutop.image.width / 2;
        menutop.y = halfScreenHeight - menutop.image.height;
        menutop.cache(0, 0, menutop.image.width, menutop.image.height);
        stage.addChild(menutop);
        var menubot = new createjs.Bitmap(assets.getResult("menubot.pcx"));
        menubot.x = halfScreenWidth - menubot.image.width / 2;
        menubot.y = halfScreenHeight;
        menutop.cache(0, 0, menubot.image.width, menubot.image.height);
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
        //outTextXY(stage, Colors.DARKGRAY, halfScreenWidth + 286, halfScreenHeight + 230, "1.0");
    }

    function onTick(stage, deltaInSeconds) {

    }
}