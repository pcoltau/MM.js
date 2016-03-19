function createGameSetup(onExit, assets) {
	var mainContainer = new createjs.Container();

	var colorTable = [Colors.BLUE, Colors.LIGHTRED, Colors.GREEN, Colors.YELLOW, Colors.MAGENTA, Colors.CYAN, Colors.WHITE, Colors.LIGHTGRAY];
	var winCon = ["Survival", "Most Hits", "Most Frags", "Most Damage", "Best Damage/Shot", "Most Headshots"];
	var menuItems = [
		{name: "Number of Players", value: 4, min: 2, max: 8}, 
		{name: "Number of Rounds", value: 15, min: 1, max: 99}, 
		{name: "Points given for", value: 0, min: 0, max: winCon.length}]; 
    var selectedItemShape = null;
    var selectedItemIndex = 0;

	var backgroundContainer = createBackground();
    var gameSetupFrame = createGameSetupFrame();

	mainContainer.addChild(backgroundContainer);
	mainContainer.addChild(gameSetupFrame);

    var menuItemMovementHelper = createMenuItemMovementHelper(onMenuItemMoved, onMenuItemSelected, onExit);

	return {
		container: mainContainer,
        onTick: menuItemMovementHelper.onTick,
        onKeyUp: menuItemMovementHelper.onKeyUp,
        onKeyPress: menuItemMovementHelper.onKeyPress
	};

	function createBackground() {
	/*
	    Show_PCX('Gfx\frame.pcx',GetMaxX div 2 -318,GetMaxY div 2 - 235,636,235);
		Show_PCX('Gfx\frame.pcx',GetMaxX div 2 -318,GetMaxY div 2,636,235);
	*/
        var backgroundContainer = new createjs.Container();

        showPCX(assets, backgroundContainer, "frame.pcx", SCREEN_WIDTH_CENTER - 318, SCREEN_HEIGHT_CENTER - 235, 636, 235);
        showPCX(assets, backgroundContainer, "frame.pcx", SCREEN_WIDTH_CENTER - 318, SCREEN_HEIGHT_CENTER, 636, 235);
        return backgroundContainer;
	}

	function createGameSetupFrame() {
        var gameSetupContainer = new createjs.Container();

		x1 = SCREEN_WIDTH_CENTER - 180;
		y1 = SCREEN_HEIGHT_CENTER - 55;
		x2 = x1 + 360;
		y2 = y1 + 110;

		drawBox(assets, gameSetupContainer, x1, y1, x2, y2);

		drawBox(assets, gameSetupContainer, x1, y2 + 5, x2, y2 + 21, true);

        outTextXY(gameSetupContainer, Colors.DARKGRAY, "Press Enter to start game or Esc to cancel.", SCREEN_WIDTH_CENTER, y2 + 9, true); 

		drawFrame(gameSetupContainer, x1 + 8, y1 + 18, x2 - 8, y2 - 8);		

        outTextXY(gameSetupContainer, Colors.DARKGRAY, "G A M E   S E T U P", SCREEN_WIDTH_CENTER, y1 + 6, true); 

	    //bar(x[1]+12,y[1]+14+i*20,x[2]-12,y[1]+26+i*20);
        var yPos = getItemBarPosition(selectedItemIndex);
        selectedItemShape = barAsShape(Colors.DARKESTGREEN, x1 + 12, yPos, x2 - 12, yPos + 12);
		gameSetupContainer.addChild(selectedItemShape);

        var menu = createMenuItems(x1, y1, x2, y2);
		gameSetupContainer.addChild(menu);

		return gameSetupContainer;
	}

	function createMenuItems(x1, y1, x2, y2) {
		
		function drawArrow(index, isRightArrow) {
			var shape = new createjs.Shape();
			var v = isRightArrow ? 1 : 0;
			var ypos = getItemBarPosition(index) + 2;
			for (var n = 4; n > 0; n--) {
/*
				xpos := ord(T)*126+(ord(T)*2-1)*n;
				Line(x[1]+196+xpos+d, y[1]+16+i*20+(8-n)+d, x[1]+196+xpos+d, y[1]+24+i*20-(8-n)+d);
*/
				var xpos = v * 126 + (v * 2 - 1) * n;
				line(shape.graphics, Colors.WHITE, x1 + 196 + xpos, ypos + (8 - n), x1 + 196 + xpos, ypos + 8 - (8 - n));
			}			
			return shape;
		}

		var container = new createjs.Container();
		for (var i = 0; i < menuItems.length; ++i) {
/*
		    SetColor(White);
		    OutTextXY(x[1]+30,y[1]+16+i*20,MenuItems[i].Name);
		    OutTextXY(x[1]+260-(TextWidth(Str) div 2),y[1]+16+i*20,Str);
		    DrawArrow(i,0,true);
		    DrawArrow(i,0,false);
*/
			outTextXY(container, Colors.WHITE, menuItems[i].name, x1 + 30, getItemBarPosition(i) + 2, false, Colors.BLACK);
			var value = (i === 2) ? winCon[menuItems[i].value] : menuItems[i].value;
			outTextXY(container, Colors.WHITE, value, x1 + 260, getItemBarPosition(i) + 2, true, Colors.BLACK);
			container.addChild(drawArrow(i, true));
			container.addChild(drawArrow(i, false));
		}

		return container;
	}

	function getItemBarPosition(itemIndex) {
		return (SCREEN_HEIGHT_CENTER - 55) + 14 + (itemIndex + 1) * 20;
	}

    function onMenuItemMoved(movement) {
        switch (movement) {
            case MenuItemMovement.DOWN:
                if (selectedItemIndex < menuItems.length - 1) {
                    selectedItemIndex++;    
                }
                else {
                    selectedItemIndex = 0;
                }
                selectedItemShape.y = getItemBarPosition(selectedItemIndex);
                break;
            case MenuItemMovement.UP:
                if (selectedItemIndex > 0) {
                    selectedItemIndex--;
                }
                else {
                    selectedItemIndex = menuItems.length - 1;
                }
                selectedItemShape.y = getItemBarPosition(selectedItemIndex);
                break;    
        }
    }

    function onMenuItemSelected() {
        onSelect(selectedItemIndex);
    }

}