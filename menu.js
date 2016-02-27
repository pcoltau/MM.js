function createMenu(stage, assets) {
    var menutop = new createjs.Bitmap(assets.getResult("menutop.pcx"));
    menutop.x = SCREEN_WIDTH / 2 - menutop.image.width / 2;
    menutop.y = SCREEN_HEIGHT / 2 - menutop.image.height;
    stage.addChild(menutop);
    var menubot = new createjs.Bitmap(assets.getResult("menubot.pcx"));
    menubot.x = SCREEN_WIDTH / 2 - menubot.image.width / 2;
    menubot.y = SCREEN_HEIGHT / 2;
    stage.addChild(menubot);

    return {
        onTick: onTick
    };

  // SetColor(DarkGray);
  // Line(GetMaxX div 2 - 319,GetMaxY div 2 + 240,GetMaxX div 2 + 320,GetMaxY div 2 + 240);
  // Line(GetMaxX div 2 + 320,GetMaxY div 2 - 239,GetMaxX div 2 + 320,GetMaxY div 2 + 239);
  // SetColor(Gray);
  // Line(GetMaxX div 2 - 319,GetMaxY div 2 - 239,GetMaxX div 2 + 320,GetMaxY div 2 - 239);
  // Line(GetMaxX div 2 - 319,GetMaxY div 2 - 239,GetMaxX div 2 - 319,GetMaxY div 2 + 240);
  // SetColor(DarkGray);

    function onTick(stage, deltaInSeconds) {

    }
}