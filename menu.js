"use strict";

function createMenu(onSelect, assets) {
    var menuItems = ["Start Game", "Options", "About", "Quit"];
    var selectedItemShape = null;
    var selectedItemIndex = 0;

    var mainContainer = new createjs.Container();

    var backgroundContainer = createBackground();
    //backgroundContainer.cache(0,0,SCREEN_WIDTH, SCREEN_WIDTH);
    var menuContainer = createMainMenu();

    mainContainer.addChild(backgroundContainer, menuContainer);

    // The Pixel dance test..
/*
    var testShape = new createjs.Shape();
    line(testShape.graphics, Colors.WHITE, 11, 11, 11, 21);
    line(testShape.graphics, Colors.WHITE, 21, 11, 26, 11);
    line(testShape.graphics, Colors.WHITE, 31, 11, 41, 21);
    putPixel(testShape.graphics, Colors.WHITE, 51, 11);
    putPixel(testShape.graphics, Colors.WHITE, 51, 15);
    putPixel(testShape.graphics, Colors.WHITE, 51, 15);
    bar(testShape.graphics, Colors.WHITE, 61, 11, 71, 21);
    line(testShape.graphics, Colors.WHITE, 0, 110, SCREEN_WIDTH, 110);
    putPixel(testShape.graphics, Colors.RED, 0, 0);
    bar(testShape.graphics, Colors.WHITE, 0, 120, SCREEN_WIDTH, 120);
    mainContainer.addChild(testShape);
*/
    return {
        container: mainContainer,
        onKeyDown: onKeyDown,
    };

    function createBackground() {
        var backgroundContainer = new createjs.Container();

        //Show_PCX('Gfx\menutop.pcx',GetMaxX div 2 - 319,GetMaxY div 2 - 240,639,239);
        //Show_PCX('Gfx\menubot.pcx',GetMaxX div 2 - 319,GetMaxY div 2      ,639,239);

        showPCX(assets, backgroundContainer, "menutop.pcx", SCREEN_WIDTH_CENTER - 319, SCREEN_HEIGHT_CENTER - 240, 639, 239);
        showPCX(assets, backgroundContainer, "menubot.pcx", SCREEN_WIDTH_CENTER - 319, SCREEN_HEIGHT_CENTER, 639, 239);

        // SetColor(DarkGray);
        // Line(GetMaxX div 2 - 319,GetMaxY div 2 + 240,GetMaxX div 2 + 320,GetMaxY div 2 + 240);
        // Line(GetMaxX div 2 + 320,GetMaxY div 2 - 239,GetMaxX div 2 + 320,GetMaxY div 2 + 239);
        // SetColor(Gray);
        // Line(GetMaxX div 2 - 319,GetMaxY div 2 - 239,GetMaxX div 2 + 320,GetMaxY div 2 - 239);
        // Line(GetMaxX div 2 - 319,GetMaxY div 2 - 239,GetMaxX div 2 - 319,GetMaxY div 2 + 240);
        var shape = new createjs.Shape();
        line(shape.graphics, MenuColors.DARKGRAY, SCREEN_WIDTH_CENTER - 319, SCREEN_HEIGHT_CENTER + 240, SCREEN_WIDTH_CENTER + 320, SCREEN_HEIGHT_CENTER + 240);
        line(shape.graphics, MenuColors.DARKGRAY, SCREEN_WIDTH_CENTER + 320, SCREEN_HEIGHT_CENTER - 239, SCREEN_WIDTH_CENTER + 320, SCREEN_HEIGHT_CENTER + 239);
        line(shape.graphics, MenuColors.GRAY, SCREEN_WIDTH_CENTER - 319, SCREEN_HEIGHT_CENTER - 239, SCREEN_WIDTH_CENTER + 320, SCREEN_HEIGHT_CENTER - 239);
        line(shape.graphics, MenuColors.GRAY, SCREEN_WIDTH_CENTER - 319, SCREEN_HEIGHT_CENTER - 239, SCREEN_WIDTH_CENTER - 319, SCREEN_HEIGHT_CENTER + 240);
        backgroundContainer.addChild(shape);

        // SetColor(DarkGray);
        // OutTextXY(GetMaxX div 2 + 286,GetMaxY div 2 + 230,'v'+FloatToStr(Version,0,1));
        outTextXY(backgroundContainer, MenuColors.DARKGRAY, "v1.0", SCREEN_WIDTH_CENTER + 286, SCREEN_HEIGHT_CENTER + 230);

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
        var x1 = SCREEN_WIDTH_CENTER - 80;
        var y1 = SCREEN_HEIGHT_CENTER - 70;
        var x2 = x1 + 159;
        var y2 = y1 + 193;

        var menubackContainer = new createjs.Container();
        showPCX(assets, menubackContainer, "menuback.pcx", x1, y1, x2 - x1, y2 - y1);
        // add shadow
        menubackContainer.shadow = new createjs.Shadow(MenuColors.DARKGRAY, 2, 2, 0);
        menuContainer.addChild(menubackContainer);

        /*  SetColor(BrightGray);
          Line(x[1],y[1],x[2],y[1]);
          Line(x[1],y[1],x[1],y[2]);
          SetColor(Gray);
          Line(x[1],y[2],x[2],y[2]);
          Line(x[2],y[1],x[2],y[2]);
        */
        var shape = new createjs.Shape();
        line(shape.graphics, MenuColors.BRIGHTGRAY, x1, y1, x2, y1);
        line(shape.graphics, MenuColors.BRIGHTGRAY, x1, y1, x1, y2);
        line(shape.graphics, MenuColors.GRAY, x1, y2, x2, y2);
        line(shape.graphics, MenuColors.GRAY, x2, y1, x2, y2);
        menuContainer.addChild(shape);

        //  SetColor(DarkGray);
        //  OutTextXY(GetMaxX div 2 - 68,y[1]+10,'M A I N   M E N U');
        outTextXY(menuContainer, MenuColors.DARKGRAY, "M A I N   M E N U", SCREEN_WIDTH_CENTER - 68, y1 + 10);

        //  DrawFrame(x[1]+16,y[1]+32,x[2]-16,y[2]-16);
        var frame = drawFrame(menuContainer, MenuColors, x1 + 16, y1 + 32, x2 - 16, y2 - 16);

        // bar(x[1]+19,y[1]+23+i*30,x[2]-20,y[1]+35+i*30);
        var yPos = getItemBarPosition(selectedItemIndex);
        selectedItemShape = barAsShape(MenuColors.DARKESTGREEN, x1 + 19, yPos, x2 - 20, yPos + 12);
        
        menuContainer.addChild(selectedItemShape);

        var menuItemsContainer = createMenuItems();
        menuContainer.addChild(menuItemsContainer);

        return menuContainer;
    }

    function createMenuItems() {
        var container = new createjs.Container();
        for (var i = 0; i < menuItems.length; ++i) {
            /*
            if i = C then SetFillStyle(SolidFill,DarkestGreen) else SetFillStyle(SolidFill,Black);
            bar(x[1]+19,y[1]+23+i*30,x[2]-20,y[1]+35+i*30);
            SetColor(Black);
            OutTextXY(GetMaxX div 2 - (TextWidth(MenuItems[i]) div 2)+2,y[1]+27+i*30,MenuItems[i]);
            SetColor(White);
            OutTextXY(GetMaxX div 2 - (TextWidth(MenuItems[i]) div 2),y[1]+25+i*30,MenuItems[i]);
            */        
            outTextXY(container, MenuColors.WHITE, menuItems[i], SCREEN_WIDTH_CENTER, getItemBarPosition(i) + 2, true, MenuColors.BLACK);
        }
        return container;
    }

    function getItemBarPosition(itemIndex) {
        return (SCREEN_HEIGHT_CENTER - 70) + 23 + (itemIndex + 1) * 30;
    }

    function onKeyDown(stage, key) {
        switch (key) {
            case Keys.DOWN_ARROW:
                if (selectedItemIndex < menuItems.length - 1) {
                    selectedItemIndex++;    
                }
                else {
                    selectedItemIndex = 0;
                }
                selectedItemShape.y = getItemBarPosition(selectedItemIndex);
                break;
            case Keys.UP_ARROW:
                if (selectedItemIndex > 0) {
                    selectedItemIndex--;
                }
                else {
                    selectedItemIndex = menuItems.length - 1;
                }
                selectedItemShape.y = getItemBarPosition(selectedItemIndex);
                break;    
            case Keys.ENTER:
                onSelect(selectedItemIndex);
                break;
            case Keys.ESCAPE:
                // TODO: Implement quit.
                break;
        }
    }
}