unit EndStats;

interface

uses crt,graph,Global,SPCX_New,Img_Fade,Drawing;

procedure ShowEndStats;

implementation

const Blue = 71;
      LightRed = 72;
      Green = 73;
      Yellow = 74;
      Magenta = 75;
      Cyan = 76;
      White = 77;
      LightGray = 78;
      DarkGray = 79;
      Black = 80;

      MaxLaunch = 15;
      MaxSparks = 8;

type ListType = record
       Player: array[1..8] of integer;
       Score: extended;
       NumInList: integer;
     end;

     PointType = record
       x,y: array[1..2] of integer;
     end;

     Types = (Win,Mayhem,Assassin,Sniper);

     FireWorkType = record
       x,y: array[1..MaxSparks] of real;
       vx,vy: array[1..MaxSparks] of real;
       Color,ColBase: array[1..MaxSparks] of Byte;
       ColDec: array[1..MaxSparks] of real;
       Dead: array[1..MaxSparks] of boolean;
       Exploded: boolean;
       FType: byte;
     end;

var WinList,MayhemList,AssaList,SniperList: ListType;
    MainBox,WinBox,MayhemBox,AssaBox,SniperBox: PointType;
    OldPlCols,PlayerCols: array[1..8] of ColorType;
    ColorTable: array[1..8] of word;
    NumOfLaunch,NumOfSparks,InitBase: integer;
    FWork: array[1..MaxLaunch] of FireWorkType;

procedure MakeList(T: Types;var L: ListType);
var i: integer;
    Ty: extended;
begin
  L.NumInList := 0;
  L.Score := -1000;
  for i := 1 to Players do
  begin
    if T = Win then Ty := PList[i].Stats[2].Points;
    if T = Mayhem then Ty := PList[i].Stats[2].Damage;
    if T = Assassin then Ty := PList[i].Stats[2].Kills;
    if T = Sniper then
    begin
      if PList[i].Stats[2].Shots = 0 then
        Ty := 0
      else
        Ty := ((PList[i].Stats[2].Shots-PList[i].Stats[2].Misses)/PList[i].Stats[2].Shots)*100;
    end;
    if Ty = L.Score then
    begin
      inc(L.NumInList);
      L.Player[L.NumInList] := i;
    end;
    if Ty > L.Score then
    begin
      L.Score := Ty;
      L.NumInList := 1;
      L.Player[1] := i;
    end;
  end;
end;

procedure SetPal;
var Col,DGray: ColorType;
    i,j: integer;
    r,g,b: Byte;
begin
  GetPalette(43,DGray);
  for i := 0 to 6 do
    for j := 1 to 10 do
    begin
      case i of
        0: begin r := 1; g := 0; b := 0; end;
        1: begin r := 0; g := 1; b := 0; end;
        2: begin r := 0; g := 0; b := 1; end;
        3: begin r := 1; g := 1; b := 0; end;
        4: begin r := 1; g := 1; b := 1; end;
        5: begin r := 1; g := 0; b := 1; end;
        6: begin r := 0; g := 1; b := 1; end;
      end;
      Col.Red := round((11-j)*(6.3))*r;
      Col.Green := round((11-j)*(6.3))*g;
      Col.Blue := round((11-j)*(6.3))*b;
      SetPalette(i*10+j,Col);
    end;
  for i := 1 to 8 do
    SetPalette(70+i,PlayerCols[i]);
  SetPalette(79,DGray);
  Col.Red := 0;
  Col.Green := 0;
  Col.Blue := 0;
  SetPalette(80,Col);
end;

procedure GetPlayerCols;
var Col: ColorType;
    i: integer;
begin
  for i := 1 to 8 do
  begin
    GetPalette(ColorTable[i],Col);
    PlayerCols[i] := Col;
  end;
end;

procedure DrawWindow(T:Types;L: ListType;Box: PointType;str: string);
var i,j: integer;
    Col: word;
begin
  DrawBox(Box.x[1],Box.y[1],Box.x[2],Box.y[2]);
  DrawFrame(Box.x[1]+8,Box.y[1]+18,Box.x[2]-8,Box.y[2]-8);
  SetColor(DarkGray);
  OutTextXY(GetMaxX div 2 - (TextWidth(str) div 2),Box.y[1]+6,str);
  SetColor(White);
  if T = Win then      OutTextXY(Box.x[1]+10,Box.y[1]+22,'With a total of '+inttostr(round(L.Score))+' points:');
  if T = Mayhem then   OutTextXY(Box.x[1]+10,Box.y[1]+22,'With a total of '+inttostr(round(L.Score))+' damage:');
  if T = Assassin then OutTextXY(Box.x[1]+10,Box.y[1]+22,'With a total of '+inttostr(round(L.Score))+' frags:');
  if T = Sniper then   OutTextXY(Box.x[1]+10,Box.y[1]+22,'With a hit percentage of '+inttostr(round(L.Score))+'%:');
  for i := 1 to L.NumInList do
  begin
    for j := 1 to 8 do
      if PList[L.Player[i]].Color = ColorTable[j] then Col := 70+j;
    SetColor(Col);
    OutTextXY(Box.x[1]+12,Box.y[1]+24+i*10,PList[L.Player[i]].Name);
  end;
end;

procedure SetInitLaunch(N,BY: integer);
var i: integer;
    x,y,vx,vy: real;
    Color: byte;
begin
  x      := random(GetMaxX div 10)+round(GetMaxX *(9/20));
  y      := BY;
  vx     := cos((random(90)+45)/180*pi)*10*(GetMaxY/2000+0.2);
  vy     := -sin((random(90)+45)/180*pi)*10*(GetMaxY/2000+0.2);
  Color  := Random(7)*10+1;
  FWork[N].FType := random(4);
  for i := 1 to NumOfSparks do
  begin
    if FWork[N].FType = 3 then Color  := Random(7)*10+1;
    FWork[N].x[i]  := x;
    FWork[N].y[i]  := y;
    FWork[N].vx[i] := vx;
    FWork[N].vy[i] := vy;
    FWork[N].Color[i] := Color;
    FWork[N].ColBase[i] := Color;
    FWork[N].ColDec[i] := 10;
    FWork[N].Dead[i] := false;
  end;
  FWork[N].Exploded := false;
end;

procedure DrawPoints(N: integer;Draw: boolean);
var i: integer;
    Col0,Col1,Col2: byte;

  function InsideBoxes(i: integer): boolean;
  begin
    if ((FWork[N].x[i] > WinBox.x[1]-3) and (FWork[N].x[i] < WinBox.x[2]+3) and
        (FWork[N].y[i] > WinBox.y[1]-3) and (FWork[N].y[i] < WinBox.y[2]+3)) or
       ((FWork[N].x[i] > MayhemBox.x[1]-3) and (FWork[N].x[i] < MayhemBox.x[2]+3) and
        (FWork[N].y[i] > MayhemBox.y[1]-3) and (FWork[N].y[i] < MayhemBox.y[2]+3)) or
       ((FWork[N].x[i] > AssaBox.x[1]-3) and (FWork[N].x[i] < AssaBox.x[2]+3) and
        (FWork[N].y[i] > AssaBox.y[1]-3) and (FWork[N].y[i] < AssaBox.y[2]+3)) or
       ((FWork[N].x[i] > SniperBox.x[1]-3) and (FWork[N].x[i] < SniperBox.x[2]+3) and
        (FWork[N].y[i] > SniperBox.y[1]-3) and (FWork[N].y[i] < SniperBox.y[2]+3)) or
       ((FWork[N].x[i] > MainBox.x[1]-3) and (FWork[N].x[i] < MainBox.x[2]+3) and
        (FWork[N].y[i] > MainBox.y[1]-3) and (FWork[N].y[i] < MainBox.y[2]+3)) then
      InsideBoxes := true
    else
      InsideBoxes := false;
  end;

begin
  for i := 1 to NumOfSparks do
    if (not FWork[N].Dead[i]) and (not InsideBoxes(i)) then
      if Draw then
      begin
        Col0 := FWork[N].Color[i];
        Col1 := round(((FWork[N].ColBase[i]+10) - round(FWork[N].ColDec[i]+0.5)/2));
        Col2 := round(((FWork[N].ColBase[i]+10) - round(FWork[N].ColDec[i]+0.5)/3));
        if not FWork[N].Exploded then begin Col0 := 41; Col1 := 0; Col2 := 0; end;
        PutPixel(round(FWork[N].x[i]), round(FWork[N].y[i]), Col0);
        PutPixel(round(FWork[N].x[i])+1, round(FWork[N].y[i]), Col1);
        PutPixel(round(FWork[N].x[i])-1, round(FWork[N].y[i]), Col1);
        PutPixel(round(FWork[N].x[i]), round(FWork[N].y[i])+1, Col1);
        PutPixel(round(FWork[N].x[i]), round(FWork[N].y[i])-1, Col1);

        if FWork[N].FType > 0 then
        begin
          PutPixel(round(FWork[N].x[i])+1, round(FWork[N].y[i])+1, Col2);
          PutPixel(round(FWork[N].x[i])-1, round(FWork[N].y[i])-1, Col2);
          PutPixel(round(FWork[N].x[i])+1, round(FWork[N].y[i])-1, Col2);
          PutPixel(round(FWork[N].x[i])-1, round(FWork[N].y[i])+1, Col2);

          if FWork[N].FType > 1 then
          begin
            PutPixel(round(FWork[N].x[i]), round(FWork[N].y[i]), Col0);
            PutPixel(round(FWork[N].x[i])+2, round(FWork[N].y[i]), Col1);
            PutPixel(round(FWork[N].x[i])-2, round(FWork[N].y[i]), Col1);
            PutPixel(round(FWork[N].x[i]), round(FWork[N].y[i])+2, Col1);
            PutPixel(round(FWork[N].x[i]), round(FWork[N].y[i])-2, Col1);
          end;
        end;

      end
      else
      begin
        PutPixel(round(FWork[N].x[i]), round(FWork[N].y[i]), Black);
        PutPixel(round(FWork[N].x[i])+1, round(FWork[N].y[i]), Black);
        PutPixel(round(FWork[N].x[i])-1, round(FWork[N].y[i]), Black);
        PutPixel(round(FWork[N].x[i]), round(FWork[N].y[i])+1, Black);
        PutPixel(round(FWork[N].x[i]), round(FWork[N].y[i])-1, Black);

        PutPixel(round(FWork[N].x[i])+1, round(FWork[N].y[i])+1, Black);
        PutPixel(round(FWork[N].x[i])-1, round(FWork[N].y[i])-1, Black);
        PutPixel(round(FWork[N].x[i])+1, round(FWork[N].y[i])-1, Black);
        PutPixel(round(FWork[N].x[i])-1, round(FWork[N].y[i])+1, Black);

        PutPixel(round(FWork[N].x[i])+2, round(FWork[N].y[i]), Black);
        PutPixel(round(FWork[N].x[i])-2, round(FWork[N].y[i]), Black);
        PutPixel(round(FWork[N].x[i]), round(FWork[N].y[i])+2, Black);
        PutPixel(round(FWork[N].x[i]), round(FWork[N].y[i])-2, Black);

      end;
end;

procedure MovePoints(N: integer);
var i: integer;
    InsideScreen: boolean;

  procedure ExplodeFireWork;
  var i: integer;
  begin
    for i := 1 to NumOfSparks do
    if not FWork[N].Dead[i] then
    begin
      FWork[N].vx[i] := cos(random(360)/180*pi)*1.5;
      FWork[N].vy[i] := sin(random(360)/180*pi)*1.5;
    end;
    FWork[N].Exploded := true;
  end;

  procedure FadeSparks;
  var i: integer;
  begin
    for i := 1 to NumOfSparks do
    if not FWork[N].Dead[i] then
    begin
      FWork[N].ColDec[i] := FWork[N].ColDec[i] - (0.025+random(250)/1000);
      FWork[N].Color[i] := (FWork[N].ColBase[i]+10) - round(FWork[N].ColDec[i]+0.5);
      if FWork[N].ColDec[i] < 1 then
        FWork[N].dead[i] := true;
    end;
  end;

begin
  InsideScreen := false;
  if not FWork[N].Exploded then
  begin
    If round(FWork[N].vy[1]) = 0 then ExplodeFireWork;
  end
  else
    FadeSparks;
  for i := 1 to NumOfSparks do
  if not FWork[N].Dead[i] then
  With FWork[N] do
  begin
    x[i] := x[i] + (vx[i]/1.5);
    vy[i] := vy[i] + 0.02;
    y[i] := y[i] + (vy[i]/1.5);
    if (x[i] > 0) and (x[i] < GetMaxX) and (y[i] > 0) and (y[i] < GetMaxY) then
      InsideScreen := true;
  end;
  if not InsideScreen then SetInitLaunch(N,InitBase);
end;

procedure StartFireWorks;
var i: integer;
begin
  NumOfLaunch := MaxLaunch;
  NumOfSparks := MaxSparks;
  InitBase := GetMaxY;
{  randomize;}
  for i := 1 to NumOfLaunch do
    SetInitLaunch(i,InitBase);
  k := #0;
  repeat
    for i := 1 to NumOfLaunch do
    begin
      DrawPoints(i,false);
      MovePoints(i);
      DrawPoints(i,true);
    end;
    delay(5);
    if keypressed then k := readkey;
  until k <> #0;
end;

procedure ShowEndStats;
var str: string;
begin
  ClearViewPort;
  LoadPalette('Gfx\game.pal');
  ColorTable[1]  := 5;
  ColorTable[2]  := 30;
  ColorTable[3]  := 180;
  ColorTable[4]  := 210;
  ColorTable[5]  := 28;
  ColorTable[6]  := 185;
  ColorTable[7]  := 215;
  ColorTable[8]  := 129;
  GetPlayerCols;
  SetPal;
  SetDarkPal(SMemPal);
  MakeList(Win,WinList);
  MakeList(Mayhem,MayhemList);
  MakeList(Assassin,AssaList);
  MakeList(Sniper,SniperList);
  MayhemBox.x[1] := GetMaxX div 2 - 150;
  MayhemBox.y[2] := GetMaxY div 2 - 5;
  MayhemBox.x[2] := MayhemBox.x[1] + 300;
  MayhemBox.y[1] := MayhemBox.y[2] - (44+MayhemList.NumInList*10);
  WinBox.x[1] := MayhemBox.x[1];
  WinBox.y[2] := MayhemBox.y[1]-10;
  WinBox.x[2] := MayhemBox.x[2];
  WinBox.y[1] := WinBox.y[2] - (44+WinList.NumInList*10);
  AssaBox.x[1] := MayhemBox.x[1];
  AssaBox.y[1] := GetMaxY div 2 + 5;
  AssaBox.x[2] := MayhemBox.x[2];
  AssaBox.y[2] := AssaBox.y[1] + (44+AssaList.NumInList*10);
  SniperBox.x[1] := MayhemBox.x[1];
  SniperBox.y[1] := AssaBox.y[2]+10;
  SniperBox.x[2] := MayhemBox.x[2];
  SniperBox.y[2] := SniperBox.y[1] + (44+SniperList.NumInList*10);
  MainBox.x[1] := GetMaxX div 2 - 205;
  MainBox.y[1] := 6;
  MainBox.x[2] := MainBox.x[1] + 410;
  MainBox.y[2] := 24;
  DrawBox(MainBox.x[1],MainBox.y[1],MainBox.x[2],MainBox.y[2]);
  SetColor(DarkGray);
  str := 'T H E   W I N N E R   A N D   T H E   A W A R D S';
  OutTextXY(GetMaxX div 2 - (TextWidth(str) div 2),12,str);
  DrawWindow(Win,WinList,WinBox,'The Winner');
  DrawWindow(Mayhem,MayhemList,MayhemBox,'The Mayhem Award');
  DrawWindow(Assassin,AssaList,AssaBox,'The Assassin Award');
  DrawWindow(Sniper,SniperList,SniperBox,'The Sniper Award');
  FadeIn(1,SMemPal);
  StartFireWorks;
  k := #0;
end;


end.