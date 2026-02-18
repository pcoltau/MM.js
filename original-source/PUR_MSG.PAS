unit Pur_Msg;

interface

procedure FilledMsg;
procedure MagShieldMsg;
procedure BetterArmMsg;
procedure NeedArmMsg;
function WantToEndMsg: boolean;

implementation

uses crt,graph,Drawing,Colors;

procedure FilledMsg;
var x1,y1,x2,y2: integer;
    P: Pointer;

  procedure Msg(C: word;I: integer);
  var T: string;
  begin
    SetColor(C);
    T := 'There is no more room for this';
    OutTextXY(GetMaxX div 2 -(TextWidth(T) div 2)+I,y1+6+I,T);
    T := 'particular item.';
    OutTextXY(GetMaxX div 2 -(TextWidth(T) div 2)+I,y1+16+I,T);
    T := 'Don''t you think you have enough? :)';
    OutTextXY(GetMaxX div 2 -(TextWidth(T) div 2)+I,y1+26+I,T);
  end;

begin
  x1 := GetMaxX div 2 - 150;
  y1 := GetMaxY div 2 - 20;
  x2 := x1 + 300;
  y2 := y1 + 40;
  GetMem(P, ImageSize(x1,y1,x2,y2));
  GetImage(x1,y1,x2,y2, P^);
  DrawBox(x1,y1,x2,y2);
  Msg(Black,1);
  Msg(White,0);
  readkey;
  PutImage(x1,y1,P^,NormalPut);
  FreeMem(P,ImageSize(x1,y1,x2,y2));
end;

procedure MagShieldMsg;
var x1,y1,x2,y2: integer;
    P: Pointer;

  procedure Msg(C: word;I: integer);
  var T: string;
  begin
    SetColor(C);
    T := 'You need to either sell your';
    OutTextXY(GetMaxX div 2 -(TextWidth(T) div 2)+I,y1+6+I,T);
    T := 'mag.shield or buy some armour.';
    OutTextXY(GetMaxX div 2 -(TextWidth(T) div 2)+I,y1+16+I,T);
  end;

begin
  x1 := GetMaxX div 2 - 130;
  y1 := GetMaxY div 2 - 15;
  x2 := x1 + 260;
  y2 := y1 + 30;
  GetMem(P, ImageSize(x1,y1,x2,y2));
  GetImage(x1,y1,x2,y2, P^);
  DrawBox(x1,y1,x2,y2);
  Msg(Black,1);
  Msg(White,0);
  readkey;
  PutImage(x1,y1,P^,NormalPut);
  FreeMem(P,ImageSize(x1,y1,x2,y2));
end;

procedure BetterArmMsg;
var x1,y1,x2,y2: integer;
    P: Pointer;

  procedure Msg(C: word;I: integer);
  var T: string;
  begin
    SetColor(C);
    T := 'You already have a better armour than that.';
    OutTextXY(GetMaxX div 2 -(TextWidth(T) div 2)+I,y1+6+I,T);
    T := 'If its broken then try to buy a Armour Repair Kit.';
    OutTextXY(GetMaxX div 2 -(TextWidth(T) div 2)+I,y1+16+I,T);
    T := 'Or you could just sell the old one.';
    OutTextXY(GetMaxX div 2 -(TextWidth(T) div 2)+I,y1+26+I,T);
  end;

begin
  x1 := GetMaxX div 2 - 210;
  y1 := GetMaxY div 2 - 20;
  x2 := x1 + 420;
  y2 := y1 + 40;
  GetMem(P, ImageSize(x1,y1,x2,y2));
  GetImage(x1,y1,x2,y2, P^);
  DrawBox(x1,y1,x2,y2);
  Msg(Black,1);
  Msg(White,0);
  readkey;
  PutImage(x1,y1,P^,NormalPut);
  FreeMem(P,ImageSize(x1,y1,x2,y2));
end;

procedure NeedArmMsg;
var x1,y1,x2,y2: integer;
    P: Pointer;

  procedure Msg(C: word;I: integer);
  var T: string;
  begin
    SetColor(C);
    T := 'You need armour to buy this item.';
    OutTextXY(GetMaxX div 2 -(TextWidth(T) div 2)+I,y1+6+I,T);
    T := 'See item description for details.';
    OutTextXY(GetMaxX div 2 -(TextWidth(T) div 2)+I,y1+16+I,T);
  end;

  begin
  x1 := GetMaxX div 2 - 160;
  y1 := GetMaxY div 2 - 15;
  x2 := x1 + 320;
  y2 := y1 + 30;
  GetMem(P, ImageSize(x1,y1,x2,y2));
  GetImage(x1,y1,x2,y2, P^);
  DrawBox(x1,y1,x2,y2);
  Msg(Black,1);
  Msg(White,0);
  readkey;
  PutImage(x1,y1,P^,NormalPut);
  FreeMem(P,ImageSize(x1,y1,x2,y2));
end;

function WantToEndMsg: boolean;
var x1,y1,x2,y2: integer;
    P: Pointer;
    k: char;

  procedure Msg(C: word;I: integer);
  var T: string;
  begin
    SetColor(C);
    T := 'Are all players';
    OutTextXY(GetMaxX div 2 -(TextWidth(T) div 2)+I,y1+6+I,T);
    T := 'finished (y/n)?';
    OutTextXY(GetMaxX div 2 -(TextWidth(T) div 2)+I,y1+16+I,T);
  end;

begin
  x1 := GetMaxX div 2 - 70;
  y1 := GetMaxY div 2 - 15;
  x2 := x1 + 140;
  y2 := y1 + 30;
  GetMem(P, ImageSize(x1,y1,x2,y2));
  GetImage(x1,y1,x2,y2, P^);
  DrawBox(x1,y1,x2,y2);
  Msg(Black,1);
  Msg(White,0);
  repeat
    k := readkey;
  until (k = 'y') or (k = 'Y') or (k = 'n') or (k = 'N') or (k = #27);
  PutImage(x1,y1,P^,NormalPut);
  FreeMem(P,ImageSize(x1,y1,x2,y2));
  if (k = 'y') or (k = 'Y') then
    WantToEndMsg := true
  else
    WantToEndMsg := false;
end;


end.