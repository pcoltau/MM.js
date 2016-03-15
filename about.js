function createAbout(onExit, assets) {
	var mainContainer = createAboutBox();

	return {
        container: mainContainer,
		onKeyPress: onKeyPress
	}

	function createAboutBox() {
		function addCenteredText(container, text, yPos) {
	        var text = outTextXYAsText(Colors.WHITE, text);
	        text.textAlign = "center";
	        text.x = SCREEN_WIDTH_CENTER;
	        text.y = yPos;
	        container.addChild(text);
		}

		function addLeftAlignedText(container, text, yPos) {
			outTextXY(container, Colors.WHITE, SCREEN_WIDTH_CENTER - 140, yPos, text)
		}

		var container = new createjs.Container();
		/*
		x1 := GetMaxX div 2 - 150;
		y1 := GetMaxY div 2 - 70;
		x2 := x1 + 300;
		y2 := y1 + 140;
		Show_PCX('Gfx\menuback.pcx',x1,y1,x2-x1,y2-y1)
		*/
		var x1 = SCREEN_WIDTH_CENTER - 150;
		var y1 = SCREEN_HEIGHT_CENTER - 70;
		var x2 = x1 + 300;
		var y2 = y1 + 140;

        var menuback = new createjs.Bitmap(assets.getResult("menuback.pcx"));
        menuback.x = x1;
        menuback.y = y1;
        // crop bitmap
        menuback.sourceRect = new createjs.Rectangle(0, 0, x2 - x1, y2 - y1);
        container.addChild(menuback);

        var shape = new createjs.Shape();
        line(shape.graphics, Colors.BRIGHTGRAY, x1, y1, x2, y1);
        line(shape.graphics, Colors.BRIGHTGRAY, x1, y1, x1, y2);
        line(shape.graphics, Colors.GRAY, x1, y2, x2, y2);
        line(shape.graphics, Colors.GRAY, x2, y1, x2, y2);
        container.addChild(shape);

        var frame = drawFrame(x1 + 8, y1 + 8, x2 - 8, y2 - 8);
        container.addChild(frame);

/*
		  SetColor(White);
		  T := 'M O R T A R   M A Y H E M  v1.0';
		  OutTextXY(GetMaxX div 2 - (TextWidth(T) div 2),y1+10,T);
		  T := 'A game by';
		  OutTextXY(GetMaxX div 2 - (TextWidth(T) div 2),y1+30,T);
		  T := 'Pelle Coltau & Jens Juul Jacobsen';
		  OutTextXY(GetMaxX div 2 - (TextWidth(T) div 2),y1+40,T);

		  OutTextXY(x1+10,y1+60,'This game was coded in the long and');
		  OutTextXY(x1+10,y1+70,'cold winter of 2001, with the words');
		  OutTextXY(x1+10,y1+80,'still hanging in the air:');
		  T := '"I can''t believe we coded this';
		  OutTextXY(GetMaxX div 2 - (TextWidth(T) div 2),y1+100,T);
		  T := ' with Turbo Pascal!"';
		  OutTextXY(GetMaxX div 2 - (TextWidth(T) div 2),y1+110,T);
*/
		addCenteredText(container, "M O R T A R   M A Y H E M  v1.0", y1 + 10);
		addCenteredText(container, "A game by", y1 + 30);
		addCenteredText(container, "Pelle Coltau & Jens Juul Jacobsen", y1 + 40);
		addLeftAlignedText(container, "This game was coded in the long and", y1 + 60);
		addLeftAlignedText(container, "cold winter of 2001, with the words", y1 + 70);
		addLeftAlignedText(container, "still hanging in the air:", y1 + 80);
		addCenteredText(container, "\"I can't believe we coded this", y1 + 100);
		addCenteredText(container, " with Turbo Pascal!\"", y1 + 110);

        return container;
	}

    function onKeyPress(stage, key) {
		onExit(stage);
	}
}