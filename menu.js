function createMenu(stage, assets) {
    // TODO: Add a show() function to show the menu and add "fade in" to that. 
    // TODO: Figure out how to make caching (of canvas - for performance) work with text (it resets the font).

    var menuItems = ["Start Game", "Options", "About", "Quit"];
    var minTimeBetweenItemMoves = 0.15;
    var selectedItemIndex = 0;
    var selectedItemShape = null;
    var timeSinceMenuItemMoved = 0;

    var halfScreenWidth = SCREEN_WIDTH / 2;
    var halfScreenHeight = SCREEN_HEIGHT / 2;

    var mainContainer = new createjs.Container();

    var backgroundContainer = createBackground();
    //backgroundContainer.cache(0,0,SCREEN_WIDTH, SCREEN_WIDTH);
    var menuContainer = createMainMenu();

    mainContainer.addChild(backgroundContainer, menuContainer);

    // TODO: Add to show function?
    stage.addChild(mainContainer);

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
        outTextXY(menuContainer, Colors.DARKGRAY, halfScreenWidth - 68, y1 + 10, "M A I N   M E N U");

        //  DrawFrame(x[1]+16,y[1]+32,x[2]-16,y[2]-16);
        var frame = drawFrame(x1 + 16, y1 + 32, x2 - 16, y2 - 16);
        menuContainer.addChild(frame);

        // bar(x[1]+19,y[1]+23+i*30,x[2]-20,y[1]+35+i*30);
        var yPos = getItemBarYPosition(selectedItemIndex);
        selectedItemShape = barAsShape(Colors.DARKESTGREEN, x1 + 19, yPos, x2 - 20, yPos + 14);
        
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
            text.x = halfScreenWidth;
            text.y = getItemBarYPosition(i) + 4;
            text.shadow = new createjs.Shadow(Colors.BLACK, 2, 2, 0);
            container.addChild(text);
        }
        return container;
    }

    function getItemBarYPosition(itemIndex) {
        return (halfScreenHeight - 70) + 23 + (itemIndex + 1) * 30;
    }

    function onTick(stage, deltaInSeconds) {
        timeSinceMenuItemMoved += deltaInSeconds;
        // Make sure that selected menu item only moves in reasonable time.
        if (timeSinceMenuItemMoved > minTimeBetweenItemMoves) {
            if (gameEngine.keys[Keys.DOWN_ARROW]) {
                timeSinceMenuItemMoved = 0;
                if (selectedItemIndex < menuItems.length - 1) {
                    selectedItemIndex++;    
                }
                else {
                    selectedItemIndex = 0;
                }
                selectedItemShape.y = getItemBarYPosition(selectedItemIndex);
            }
            if (gameEngine.keys[Keys.UP_ARROW]) {
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
}