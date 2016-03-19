MenuItemMovement = {
	UP: Keys.UP_ARROW,
	DOWN: Keys.DOWN_ARROW,
	LEFT: Keys.LEFT_ARROW,
	RIGHT: Keys.RIGHT_ARROW
}

// onMenuItemMovement: function taking a MenuItemMovement as parameter
// onSelect: function taking selectedItemIndex as parameter
function createMenuItemMovementHelper(onMenuItemMovement, onSelect, onExit) {
    var minTimeBetweenItemMoves = 0.15;
    var timeSinceMenuItemMoved = 0;

    return {
    	onTick: onTick,
    	onKeyUp: onKeyUp,
    	onKeyPress: onKeyPress
    }

    function onTick(stage, deltaInSeconds) {
        timeSinceMenuItemMoved += deltaInSeconds;
        // Make sure that selected menu item only moves in reasonable time.
        if (timeSinceMenuItemMoved >= minTimeBetweenItemMoves) {
            checkAndHandleKeyDown(Keys.DOWN_ARROW);
            checkAndHandleKeyDown(Keys.UP_ARROW);
            checkAndHandleKeyDown(Keys.LEFT_ARROW);
            checkAndHandleKeyDown(Keys.RIGHT_ARROW);
			// ESC is not triggered in onKeyPress, so we trigger it here
            if (gameEngine.isKeyDown[Keys.ESCAPE]) {
	            timeSinceMenuItemMoved = 0;
            	onExit();
            } 
        }
    }

    function checkAndHandleKeyDown(key) {
        if (gameEngine.isKeyDown[key]) {
            timeSinceMenuItemMoved = 0;
            onMenuItemMovement(key);
        }
    }

    function onKeyUp(stage, key) {
        if (key === Keys.DOWN_ARROW || key === Keys.UP_ARROW || key === Keys.LEFT_ARROW || key === Keys.RIGHT_ARROW) {
            // make sure that fast key presses are not suppressed by timeSinceMenuItemMoved being less than minTimeBetweenItemMoves.
            timeSinceMenuItemMoved = minTimeBetweenItemMoves;
        }
    }

    function onKeyPress(stage, key) {
        if (key === Keys.ENTER) {
            timeSinceMenuItemMoved = 0;
            onSelect();
        }
    }
}