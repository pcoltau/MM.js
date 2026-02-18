unit Menu;

interface

procedure ShowMenu(var Choice: integer);

implementation

uses crt,graph,Global,SPCX_New,MenuCols,Drawing,Img_Fade;

var MenuItems: array[1..10] of string;
    NumItems,MenuAni,i: integer;
    x,y: array[1..2] of integer;
    ItemChosen: boolean;

procedure DrawFrame(X1,Y1,X2,Y2: integer);
begin
  SetFillStyle(SolidFill,Black);
  Bar(X1+1,Y1+1,X2-1,Y2-1);
  SetColor(White);
  Line(X1+1,Y2,X2,Y2);
  Line(X2,Y1,X2,Y2);
  SetColor(Gray);
  Line(X1,Y1,X2-1,Y1);
  Line(X1,Y1,X1,Y2);
end;

procedure DrawMainMenu;
begin
  x[1] := GetMaxX div 2 - 80;
  y[1] := GetMaxY div 2 - 70;
  x[2] := x[1] + 159;
  y[2] := y[1] + 193;
  SetFillStyle(SolidFill,DarkGray);
  bar(x[1]+2,y[1]+2,x[2]+2,y[2]+2);
{  if FileExists('menuback.pcx') then
    Show_PCX('menuback.pcx',x[1],y[1],x[2]-x[1],y[2]-y[1])}
  if FileExists('Gfx\menuback.pcx') then
    Show_PCX('Gfx\menuback.pcx',x[1],y[1],x[2]-x[1],y[2]-y[1])
  else
  begin
    SetFillStyle(SolidFill,LightGray);
    bar(x[1],y[1],x[2],y[2]);
  end;
  SetColor(BrightGray);
  Line(x[1],y[1],x[2],y[1]);
  Line(x[1],y[1],x[1],y[2]);
  SetColor(Gray);
  Line(x[1],y[2],x[2],y[2]);
  Line(x[2],y[1],x[2],y[2]);
  SetColor(DarkGray);
{  OutTextXY(GetMaxX div 2 - 36,y[1]+10,'MAIN MENU');}
  OutTextXY(GetMaxX div 2 - 68,y[1]+10,'M A I N   M E N U');
  DrawFrame(x[1]+16,y[1]+32,x[2]-16,y[2]-16);
end;

procedure DrawMenuItems(C: integer);
var i: integer;
begin
  for i := 1 to NumItems do
  begin
    if i = C then SetFillStyle(SolidFill,DarkestGreen) else SetFillStyle(SolidFill,Black);
    bar(x[1]+19,y[1]+23+i*30,x[2]-20,y[1]+35+i*30);
    SetColor(Black);
    OutTextXY(GetMaxX div 2 - (TextWidth(MenuItems[i]) div 2)+2,y[1]+27+i*30,MenuItems[i]);
    SetColor(White);
    OutTextXY(GetMaxX div 2 - (TextWidth(MenuItems[i]) div 2),y[1]+25+i*30,MenuItems[i]);
  end;
end;

procedure ShowMenu(var Choice: integer);
begin
  NumItems := 4;
  MenuItems[1] := 'Start Game';
  MenuItems[2] := 'Options';
  MenuItems[3] := 'About';
  MenuItems[4] := 'Quit';
  ClearViewPort;
{  LoadPalette('menu.pal');
  if FileExists('menutop.pcx') and FileExists('menubot.pcx') then
  begin
    Show_PCX('menutop.pcx',GetMaxX div 2 - 320,GetMaxY div 2 - 240,639,239);
    Show_PCX('menubot.pcx',GetMaxX div 2 - 320,GetMaxY div 2      ,639,239);
  end;}
  LoadPalette('Gfx\menu.pal');
  if Choice <> 3 then SetDarkPal(SMemPal);
  if FileExists('Gfx\menutop.pcx') and FileExists('Gfx\menubot.pcx') then
  begin
    Show_PCX('Gfx\menutop.pcx',GetMaxX div 2 - 319,GetMaxY div 2 - 240,639,239);
    Show_PCX('Gfx\menubot.pcx',GetMaxX div 2 - 319,GetMaxY div 2      ,639,239);
  end;
  SetColor(DarkGray);
  Line(GetMaxX div 2 - 319,GetMaxY div 2 + 240,GetMaxX div 2 + 320,GetMaxY div 2 + 240);
  Line(GetMaxX div 2 + 320,GetMaxY div 2 - 239,GetMaxX div 2 + 320,GetMaxY div 2 + 239);
  SetColor(Gray);
  Line(GetMaxX div 2 - 319,GetMaxY div 2 - 239,GetMaxX div 2 + 320,GetMaxY div 2 - 239);
  Line(GetMaxX div 2 - 319,GetMaxY div 2 - 239,GetMaxX div 2 - 319,GetMaxY div 2 + 240);
  SetColor(DarkGray);
  OutTextXY(GetMaxX div 2 + 286,GetMaxY div 2 + 230,'v'+FloatToStr(Version,0,1));
  DrawMainMenu;
  menuani := 1;
  if Choice <> 3 then FadeIn(1,SMemPal);
  repeat
    ItemChosen := false;
    DrawMenuItems(Choice);
    repeat
      i := 0;
      k := #0;
      while (i < 100) and (k = #0) do
        if keypressed then
          k := readkey
        else
        begin
          k := #0;
          delay (1);
          inc(i);
        end;
{      Show_PCX('menani0'+inttostr(MenuAni)+'.pcx',GetMaxX div 2 - 319,GetMaxY div 2 - 239,637,119);
      if MenuAni < 8 then inc(MenuAni) else MenuAni := 1;}
    until k <> #0;
    if k = #72 then if Choice > 1 then dec(Choice) else Choice := NumItems;
    if k = #80 then if Choice < NumItems then inc(Choice) else Choice := 1;
    if k = #13 then ItemChosen := true;
    if k = #27 then begin Choice := 4; ItemChosen := true; end;
  until ItemChosen;
  k := #0;
end;

end.