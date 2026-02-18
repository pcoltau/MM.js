unit GameSet;

interface

function ShowGameSetup: boolean;

implementation

uses crt,graph,Global,SPCX_New,Colors,Drawing,Img_Fade;

type MenuItemType = record
       Name: string;
       Value,MaxVal,MinVal: integer;
     end;

var NumItems,Choice: integer;
    MenuItems: array[1..7] of MenuItemType;
    WinCon: array[1..7] of string[14];
    StOrder,Eco: array[1..4] of string[14];
    x,y: array[1..2] of integer;
    ColorTable: array[1..16] of word;

procedure GetPlayerNames;
var i: integer;

  procedure DrawName(str: string);
  begin
    SetFillStyle(SolidFill,DarkGray);
    bar(x[1]+5,y[1]+15,x[2]-5,y[2]-5);
    SetColor(Black);
    OutTextXY(x[1]+9,y[1]+19,str+'_');
    SetColor(White);
    OutTextXY(x[1]+7,y[1]+17,str+'_');
  end;

begin
  if FileExists('Gfx\frame.pcx') then
  begin
    Show_PCX('Gfx\frame.pcx',GetMaxX div 2 -318,GetMaxY div 2 - 235,636,235);
    Show_PCX('Gfx\frame.pcx',GetMaxX div 2 -318,GetMaxY div 2,636,235);
  end;
  x[1] := GetMaxX div 2 - 91;
  y[1] := GetMaxY div 2 - 16;
  x[2] := x[1] + 182;
  y[2] := y[1] + 32;
  for i := 1 to Players do
  begin
    DrawBox(x[1],y[1],x[2],y[2]);
    PList[i].Color := ColorTable[i];
    PList[i].SecColor := ColorTable[i+8];
    SetColor(DarkGray);
    OutTextXY(x[1]+4,y[1]+4,'Name for Player '+inttostr(i));
    SetColor(PList[i].Color);
    OutTextXY(x[1]+3,y[1]+3,'Name for Player '+inttostr(i));
    DrawFrame(x[1]+4,y[1]+14,x[2]-4,y[2]-4);
    PList[i].Name := '';
    repeat
      DrawName(PList[i].Name);
      k := readkey;
      if ((k >= 'A') and (k <= 'Z')) or
         ((k >= 'a') and (k <= 'z')) or
         ((k >= '0') and (k <= '9')) or
          (k = '‘') or  (k = '’')  or
          (k = '›') or  (k = '')  or
          (k = '†') or  (k = '')  or
          (k = ' ') or  (k = '.') then if Length(PList[i].Name) < 18 then PList[i].Name := PList[i].Name + k;
      if (k = #8) and (length(PList[i].Name) > 0) then PList[i].Name := copy(PList[i].Name,1,length(PList[i].Name)-1);
    until (k = #13) and (length(PList[i].Name) > 0);
  end;
end;

procedure DrawMenuItems(C: integer);
var i: integer;
    Str: string;

  procedure DrawArrow(i,d: integer;T: boolean);
  var
    n,xpos : integer;
  begin
    n := 4;
    while n > 0 do
    begin
      xpos := ord(T)*126+(ord(T)*2-1)*n;
      Line(x[1]+196+xpos+d, y[1]+16+i*20+(8-n)+d, x[1]+196+xpos+d, y[1]+24+i*20-(8-n)+d);
      dec(n);
    end;
  end;

begin
  for i := 1 to NumItems do
  begin
    if i = C then SetFillStyle(SolidFill,DarkestGreen) else SetFillStyle(SolidFill,Black);
    bar(x[1]+12,y[1]+14+i*20,x[2]-12,y[1]+26+i*20);
    Str := IntToStr(MenuItems[i].Value);
    if i = 3 then Str := WinCon[MenuItems[i].Value];
    if (i = 4) then
      if Boolean(MenuItems[i].Value) then
        Str := 'Yes'
      else
        Str := 'No';
    if i = 5 then Str := StOrder[MenuItems[i].Value];
    if i = 6 then
      if MenuItems[6].Value = 0 then
        Str := 'By color'
      else
        Str := 'Random';
    if i = 7 then Str := Eco[MenuItems[i].Value];
    SetColor(Black);
    OutTextXY(x[1]+32,y[1]+18+i*20,MenuItems[i].Name);
    OutTextXY(x[1]+262-(TextWidth(Str) div 2),y[1]+18+i*20,Str);
    DrawArrow(i,2,true);
    DrawArrow(i,2,false);
    SetColor(White);
    OutTextXY(x[1]+30,y[1]+16+i*20,MenuItems[i].Name);
    OutTextXY(x[1]+260-(TextWidth(Str) div 2),y[1]+16+i*20,Str);
    DrawArrow(i,0,true);
    DrawArrow(i,0,false);
  end;
end;

procedure DrawText(y1: integer);
var x1,x2,y2: integer;
    str: string;
begin
  x1 := x[1];
  y1 := y1 + 5;
  x2 := x[2];
  y2 := y1 + 16;
  SetFillStyle(SolidFill,DarkGray);
  bar(x1+2,y1+2,x2+2,y2+2);
  DrawBox(x1,y1,x2,y2);
  str := 'Press Enter to start game or Esc to cancel.';
  SetColor(DarkGray);
  OutTextXY(GetMaxX div 2 - (TextWidth(str) div 2),y1+4,str);
end;

function ShowGameSetup: boolean;
var T: string;
begin
  LoadPalette('Gfx\game.pal');
  SetDarkPal(SMemPal);
  if FileExists('Gfx\frame.pcx') then
  begin
    Show_PCX('Gfx\frame.pcx',GetMaxX div 2 -318,GetMaxY div 2 - 235,636,235);
    Show_PCX('Gfx\frame.pcx',GetMaxX div 2 -318,GetMaxY div 2,636,235);
  end;
  x[1] := GetMaxX div 2 - 180;
  y[1] := GetMaxY div 2 - 55;
  x[2] := x[1] + 360;
  y[2] := y[1] + 110;
  NumItems := 3;
  Choice := 1;
  ColorTable[1]  := Blue;
  ColorTable[2]  := LightRed;
  ColorTable[3]  := Green;
  ColorTable[4]  := Yellow;
  ColorTable[5]  := Magenta;
  ColorTable[6]  := Cyan;
  ColorTable[7]  := White;
  ColorTable[8]  := LightGray;
  ColorTable[9]  := DarkBlue;
  ColorTable[10] := DarkRed;
  ColorTable[11] := DarkGreen;
  ColorTable[12] := DarkBrown;
  ColorTable[13] := DarkMagenta;
  ColorTable[14] := DarkCyan;
  ColorTable[15] := LightGray;
  ColorTable[16] := Gray;
  MenuItems[1].Name   := 'Number of Players';
  MenuItems[1].Value  := Players;
  MenuItems[1].MinVal := 2;
  MenuItems[1].MaxVal := 8;
  MenuItems[2].Name := 'Number of Rounds';
  MenuItems[2].Value  := Rounds;
  MenuItems[2].MinVal := 1;
  MenuItems[2].MaxVal := 99;
  MenuItems[3].Name := 'Points given for';
  MenuItems[3].Value  := WinCondit;
  MenuItems[3].MinVal := 1;
  MenuItems[3].MaxVal := 6;
  WinCon[1] := 'Survival';
  WinCon[2] := 'Most Hits';
  WinCon[3] := 'Most Frags';
  WinCon[4] := 'Most Damage';
  WinCon[5] := 'Best Dam/Shot';
  WinCon[6] := 'Most Headshots';
  DrawBox(x[1],y[1],x[2],y[2]);
  DrawText(y[2]);
  SetColor(DarkGray);
  T := 'G A M E   S E T U P';
  OutTextXY(GetMaxX div 2 - (TextWidth(T) div 2),y[1]+6,T);
  DrawFrame(x[1]+8,y[1]+18,x[2]-8,y[2]-8);
  DrawMenuItems(Choice);
  FadeIn(1,SMemPal);
  repeat
    DrawMenuItems(Choice);
    k := readkey;
    if k = #72 then if Choice > 1 then dec(Choice) else Choice := NumItems;
    if k = #80 then if Choice < NumItems then inc(Choice) else Choice := 1;
    if k = #75 then
      if MenuItems[Choice].Value > MenuItems[Choice].MinVal then
        dec(MenuItems[Choice].Value)
      else
        MenuItems[Choice].Value := MenuItems[Choice].MaxVal;
    if k = #77 then
      if MenuItems[Choice].Value < MenuItems[Choice].MaxVal then
        inc(MenuItems[Choice].Value)
      else
        MenuItems[Choice].Value := MenuItems[Choice].MinVal;
  until (k = #13) or (k = #27);
  if k = #13 then
  begin
    Players := MenuItems[1].Value;
    Rounds := MenuItems[2].Value;
    WinCondit := MenuItems[3].Value;
    GetPlayerNames;
    ShowGameSetup := true;
  end
  else
    ShowGameSetup := false;
  k := #0;
  FadeOut(1);
  ClearViewPort;
end;

end.