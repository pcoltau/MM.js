// selectedItemShape: createjs.Shape
// itemCount: int
// getItemPosition: function taking selectedItemIndex as parameter and returning {x: int, y: int}
// onSelect: function taking selectedItemIndex as parameter and returning void
function createMenuItemMovementHelper(selectedItemShape, itemCount, getItemPosition, onSelect) {
    var minTimeBetweenItemMoves = 0.15;
    var timeSinceMenuItemMoved = 0;

    var selectedItemIndex = 0;

    updateSelectedItemPosition();

    return {
    	onTick: onTick,
    	onKeyUp: onKeyUp,
    	onKeyPress: onKeyPress
    }

    function onTick(stage, deltaInSeconds) {
        timeSinceMenuItemMoved += deltaInSeconds;
        // Make sure that selected menu item only moves in reasonable time.
        if (timeSinceMenuItemMoved >= minTimeBetweenItemMoves) {
            if (gameEngine.isKeyDown[Keys.DOWN_ARROW]) {
                timeSinceMenuItemMoved = 0;
                if (selectedItemIndex < itemCount - 1) {
                    selectedItemIndex++;    
                }
                else {
                    selectedItemIndex = 0;
                }
                updateSelectedItemPosition();
            }
            if (gameEngine.isKeyDown[Keys.UP_ARROW]) {
                timeSinceMenuItemMoved = 0;
                if (selectedItemIndex > 0) {
                    selectedItemIndex--;
                }
                else {
                    selectedItemIndex = itemCount - 1;
                }
                updateSelectedItemPosition();
            }
        }
    }

    function updateSelectedItemPosition() {
        var pos = getItemPosition(selectedItemIndex);
        selectedItemShape.x = pos.x;
        selectedItemShape.y = pos.y;
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
            onSelect(selectedItemIndex);
        }
    }

}