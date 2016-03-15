function createMenu(onSelect, assets) {
    var menuItems = ["Start Game", "Options", "About", "Quit"];
    var minTimeBetweenItemMoves = 0.15;
    var selectedItemIndex = 0;
    var selectedItemShape = null;
    var timeSinceMenuItemMoved = 0;

    var mainContainer = new createjs.Container();

    var backgroundContainer = createBackground();
    //backgroundContainer.cache(0,0,SCREEN_WIDTH, SCREEN_WIDTH);
    var menuContainer = createMainMenu();

    mainContainer.addChild(backgroundContainer, menuContainer);
    var shape = new createjs.Shape();
    putPixel(shape.graphics, Colors.WHITE, 100, 100);
    mainContainer.addChild(shape);
    return {
        container: mainContainer,
        onTick: onTick,
        onKeyUp: onKeyUp,
        onKeyPress: onKeyPress
    };

    function createBackground() {
        var backgroundContainer = new createjs.Container();

        var menutop = new createjs.Bitmap(assets.getResult("menutop.pcx"));
        menutop.x = SCREEN_WIDTH_CENTER - menutop.image.width / 2;
        menutop.y = SCREEN_HEIGHT_CENTER - menutop.image.height;
        backgroundContainer.addChild(menutop);
        var menubot = new createjs.Bitmap(assets.getResult("menubot.pcx"));
        menubot.x = SCREEN_WIDTH_CENTER - menubot.image.width / 2;
        menubot.y = SCREEN_HEIGHT_CENTER;
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
        line(shape.graphics, Colors.DARKGRAY, SCREEN_WIDTH_CENTER - halfMenuWidth, SCREEN_HEIGHT_CENTER + halfMenuHeight, SCREEN_WIDTH_CENTER + halfMenuWidth, SCREEN_HEIGHT_CENTER + halfMenuHeight)
        line(shape.graphics, Colors.DARKGRAY, SCREEN_WIDTH_CENTER + halfMenuWidth, SCREEN_HEIGHT_CENTER - halfMenuHeight, SCREEN_WIDTH_CENTER + halfMenuWidth, SCREEN_HEIGHT_CENTER + halfMenuHeight)
        line(shape.graphics, Colors.GRAY, SCREEN_WIDTH_CENTER - halfMenuWidth, SCREEN_HEIGHT_CENTER - halfMenuHeight, SCREEN_WIDTH_CENTER + halfMenuWidth, SCREEN_HEIGHT_CENTER - halfMenuHeight)
        line(shape.graphics, Colors.GRAY, SCREEN_WIDTH_CENTER - halfMenuWidth, SCREEN_HEIGHT_CENTER - halfMenuHeight, SCREEN_WIDTH_CENTER - halfMenuWidth, SCREEN_HEIGHT_CENTER + halfMenuHeight)
        backgroundContainer.addChild(shape);

        // SetColor(DarkGray);
        // OutTextXY(GetMaxX div 2 + 286,GetMaxY div 2 + 230,'v'+FloatToStr(Version,0,1));
        outTextXY(backgroundContainer, Colors.DARKGRAY, SCREEN_WIDTH_CENTER + 286, SCREEN_HEIGHT_CENTER + 230, "v1.0");

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

        var menuback = new createjs.Bitmap(assets.getResult("menuback.pcx"));
        menuback.x = x1;
        menuback.y = y1;
        // crop bitmap
        menuback.sourceRect = new createjs.Rectangle(0, 0, x2 - x1, y2 - y1);
        // add shadow
        menuback.shadow = new createjs.Shadow(Colors.DARKGRAY, 2, 2, 0);
        menuContainer.addChild(menuback);

        /*  SetColor(BrightGray);
          Line(x[1],y[1],x[2],y[1]);
          Line(x[1],y[1],x[1],y[2]);
          SetColor(Gray);
          Line(x[1],y[2],x[2],y[2]);
          Line(x[2],y[1],x[2],y[2]);
        */
        var shape = new createjs.Shape();
        line(shape.graphics, Colors.BRIGHTGRAY, x1, y1, x2, y1);
        line(shape.graphics, Colors.BRIGHTGRAY, x1, y1, x1, y2);
        line(shape.graphics, Colors.GRAY, x1, y2, x2, y2);
        line(shape.graphics, Colors.GRAY, x2, y1, x2, y2);
        menuContainer.addChild(shape);

        //  SetColor(DarkGray);
        //  OutTextXY(GetMaxX div 2 - 68,y[1]+10,'M A I N   M E N U');
        outTextXY(menuContainer, Colors.DARKGRAY, SCREEN_WIDTH_CENTER - 68, y1 + 10, "M A I N   M E N U");

        //  DrawFrame(x[1]+16,y[1]+32,x[2]-16,y[2]-16);
        var frame = drawFrame(x1 + 16, y1 + 32, x2 - 16, y2 - 16);
        menuContainer.addChild(frame);

        // bar(x[1]+19,y[1]+23+i*30,x[2]-20,y[1]+35+i*30);
        var yPos = getItemBarYPosition(selectedItemIndex);
        selectedItemShape = barAsShape(Colors.DARKESTGREEN, x1 + 19, yPos, x2 - 20, yPos + 12);
        
        menuContainer.addChild(selectedItemShape);

        var menuItemsContainer = createMenuItems();
        menuContainer.addChild(menuItemsContainer);

        return menuContainer;
    }

    function createMenuItems() {
        var container = new createjs.Container();
        for (i = 0; i < menuItems.length; ++i) {
            /*
            if i = C then SetFillStyle(SolidFill,DarkestGreen) else SetFillStyle(SolidFill,Black);
            bar(x[1]+19,y[1]+23+i*30,x[2]-20,y[1]+35+i*30);
            SetColor(Black);
            OutTextXY(GetMaxX div 2 - (TextWidth(MenuItems[i]) div 2)+2,y[1]+27+i*30,MenuItems[i]);
            SetColor(White);
            OutTextXY(GetMaxX div 2 - (TextWidth(MenuItems[i]) div 2),y[1]+25+i*30,MenuItems[i]);
            */        
            var text = outTextXYAsText(Colors.WHITE, menuItems[i]);            
            text.textAlign = "center";
            text.x = SCREEN_WIDTH_CENTER;
            text.y = getItemBarYPosition(i) + 2;
            text.shadow = new createjs.Shadow(Colors.BLACK, 2, 2, 0);
            container.addChild(text);
        }
        return container;
    }

    function getItemBarYPosition(itemIndex) {
        return (SCREEN_HEIGHT_CENTER - 70) + 23 + (itemIndex + 1) * 30;
    }

    function onTick(stage, deltaInSeconds) {
        timeSinceMenuItemMoved += deltaInSeconds;
        // Make sure that selected menu item only moves in reasonable time.
        if (timeSinceMenuItemMoved >= minTimeBetweenItemMoves) {
            if (gameEngine.isKeyDown[Keys.DOWN_ARROW]) {
                timeSinceMenuItemMoved = 0;
                if (selectedItemIndex < menuItems.length - 1) {
                    selectedItemIndex++;    
                }
                else {
                    selectedItemIndex = 0;
                }
                selectedItemShape.y = getItemBarYPosition(selectedItemIndex);
            }
            if (gameEngine.isKeyDown[Keys.UP_ARROW]) {
                timeSinceMenuItemMoved = 0;
                if (selectedItemIndex > 0) {
                    selectedItemIndex--;
                }
                else {
                    selectedItemIndex = menuItems.length - 1;
                }
                selectedItemShape.y = getItemBarYPosition(selectedItemIndex);
            }
        }
    }

    function onKeyUp(stage, key) {
        if (key === Keys.DOWN_ARROW || key === Keys.UP_ARROW) {
            // make sure that fast key presses are not suppressed by timeSinceMenuItemMoved being less than minTimeBetweenItemMoves.
            timeSinceMenuItemMoved = minTimeBetweenItemMoves;
        }
    }

    function onKeyPress(stage, key) {
        if (key === Keys.ENTER) {
            timeSinceMenuItemMoved = 0;
            onSelect(stage, selectedItemIndex);
        }
    }
}