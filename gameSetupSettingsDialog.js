function createGameSetupSettingsDialog(assets, onDone, onExit) {
	var winCon = ["Survival", "Most Hits", "Most Frags", "Most Damage", "Best Damage/Shot", "Most Headshots"];
	var menuItems = [
		{name: "Number of Players", value: 4, min: 2, max: 8, textObj: null}, 
		{name: "Number of Rounds", value: 15, min: 1, max: 99, textObj: null}, 
		{name: "Points given for", value: 0, min: 0, max: winCon.length - 1, textObj: null}]; 
    var selectedItemShape = null;
    var selectedItemIndex = 0;

	var settingsDialog = createGameSetupSettingsDialog();
    var menuItemMovementHelper = createMenuItemMovementHelper(onMenuItemMoved, onMenuItemSelected, onExit);

	return {
		container: settingsDialog,
        onTick: menuItemMovementHelper.onTick,
        onKeyUp: menuItemMovementHelper.onKeyUp,
        onKeyPress: menuItemMovementHelper.onKeyPress
	};

	function createGameSetupSettingsDialog() {
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
			var value = getMenuItemValue(i);
			var text = outTextXYAsText(Colors.WHITE, value, x1 + 260, getItemBarPosition(i) + 2, true, Colors.BLACK);
			menuItems[i].textObj = text;
			container.addChild(text);
			container.addChild(drawArrow(i, true));
			container.addChild(drawArrow(i, false));
		}

		return container;
	}

	function getMenuItemValue(index) {
		return (index === 2) ? winCon[menuItems[index].value] : menuItems[index].value;
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
             case MenuItemMovement.LEFT:
             	var selectedMenuItem = menuItems[selectedItemIndex];
             	if (selectedMenuItem.value > selectedMenuItem.min) {
             		selectedMenuItem.value--;
             		var newValue = getMenuItemValue(selectedItemIndex);
             		menuItems[selectedItemIndex].textObj.text = newValue;
             	}
             	break;  
             case MenuItemMovement.RIGHT:
             	var selectedMenuItem = menuItems[selectedItemIndex];
             	if (selectedMenuItem.value < selectedMenuItem.max) {
             		selectedMenuItem.value++;
             		var newValue = getMenuItemValue(selectedItemIndex);
             		menuItems[selectedItemIndex].textObj.text = newValue;
             	}
             	break;  
        }
    }

    function onMenuItemSelected() {
    	onDone({ numPlayers: menuItems[0].value, numRounds: menuItems[1].value, winCon: menuItems[2].value });
    }

}