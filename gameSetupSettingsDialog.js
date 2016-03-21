"use strict";

function createGameSetupSettingsDialog(assets, onDone, onExit) {
	var winCon = ["Survival", "Most Hits", "Most Frags", "Most Damage", "Best Damage/Shot", "Most Headshots"];
	var menuItems = [
		{name: "Number of Players", value: 4, min: 2, max: 8, textObj: null}, 
		{name: "Number of Rounds", value: 15, min: 1, max: 99, textObj: null}, 
		{name: "Points given for", value: 0, min: 0, max: winCon.length - 1, textObj: null}]; 
    var selectedItemShape = null;
    var selectedItemIndex = 0;

	var settingsDialog = createGameSetupSettingsDialog();

	return {
		container: settingsDialog,
        onKeyDown: onKeyDown,
        onShow: onShow
	};

	function createGameSetupSettingsDialog() {
        var gameSetupContainer = new createjs.Container();

		var x1 = SCREEN_WIDTH_CENTER - 180;
		var y1 = SCREEN_HEIGHT_CENTER - 55;
		var x2 = x1 + 360;
		var y2 = y1 + 110;

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
		
		function drawArrow(index, isShadow, isRightArrow) {
			var shape = new createjs.Shape();
			var v = isRightArrow ? 1 : 0;
			var d = isShadow ? 2 : 0;
			var ypos = getItemBarPosition(index) + 2;
			for (var n = 4; n > 0; n--) {
/*
				xpos := ord(T)*126+(ord(T)*2-1)*n;
				Line(x[1]+196+xpos+d, y[1]+16+i*20+(8-n)+d, x[1]+196+xpos+d, y[1]+24+i*20-(8-n)+d);
*/
				var xpos = v * 126 + (v * 2 - 1) * n;
				line(shape.graphics, isShadow ? Colors.BLACK : Colors.WHITE, x1 + 196 + xpos + d, ypos + (8 - n) + d, x1 + 196 + xpos + d, ypos + 8 - (8 - n) + d);
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
			container.addChild(drawArrow(i, true, true));
			container.addChild(drawArrow(i, false, true));
			container.addChild(drawArrow(i, true, false));
			container.addChild(drawArrow(i, false, false));
		}

		return container;
	}

	function getMenuItemValue(index) {
		return (index === 2) ? winCon[menuItems[index].value] : menuItems[index].value;
	}

	function getItemBarPosition(itemIndex) {
		return (SCREEN_HEIGHT_CENTER - 55) + 14 + (itemIndex + 1) * 20;
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
                updateSelectedItemShape();
                break;
            case Keys.UP_ARROW:
                if (selectedItemIndex > 0) {
                    selectedItemIndex--;
                }
                else {
                    selectedItemIndex = menuItems.length - 1;
                }
                updateSelectedItemShape();
                break;  
             case Keys.LEFT_ARROW:
             	var selectedMenuItem = menuItems[selectedItemIndex];
             	if (selectedMenuItem.value > selectedMenuItem.min) {
             		selectedMenuItem.value--;
             		updateItemValue(selectedItemIndex)
             	}
             	break;  
             case Keys.RIGHT_ARROW:
             	var selectedMenuItem = menuItems[selectedItemIndex];
             	if (selectedMenuItem.value < selectedMenuItem.max) {
             		selectedMenuItem.value++;
             		updateItemValue(selectedItemIndex);
             	}
             	break;  
             case Keys.ENTER:
		    	onDone({ numPlayers: menuItems[0].value, numRounds: menuItems[1].value, winCon: menuItems[2].value });
             	break;
             case Keys.ESCAPE:
		    	onExit();
             	break;
        }
    }

    function updateSelectedItemShape() {
        selectedItemShape.y = getItemBarPosition(selectedItemIndex);
    }

    function updateItemValue(index) {
 		var newValue = getMenuItemValue(index);
 		menuItems[index].textObj.text = newValue;
    }

    function onShow() {
		menuItems[0].value = 2;
		menuItems[1].value = 15;
		menuItems[2].value = 0;
		for (var i = 0; i < menuItems.length; ++i) {
			updateItemValue(i);
		}
	    selectedItemIndex = 0;
	    updateSelectedItemShape();
	}
}