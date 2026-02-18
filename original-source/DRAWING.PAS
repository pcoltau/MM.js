unit Drawing;

interface

procedure DrawBox(x1,y1,x2,y2: integer);
procedure BlinkArrow(P: integer);
procedure DrawTank(P: integer;C: word);
procedure DrawCannon(P: integer;C: word);
procedure DrawScrEdge;
procedure DrawFrame(X1,Y1,X2,Y2: integer);
procedure DrawGuiBar(N: integer);
procedure DrawInfo(T: string);
procedure GenerateLand;
procedure DrawLand;
procedure DrawArrow(P: integer;C: word);
procedure DrawWepList;
procedure DrawLandTop;
procedure ShowRoundSign;

implementation

uses crt,graph,Global,Colors,SPCX_New;

procedure DrawBox(x1,y1,x2,y2: integer);
begin
  if y2-y1 > 240 then
  begin
    if (FileExists('Gfx\backtop.pcx')) and (FileExists('Gfx\backbot.pcx')) then
    begin
      Show_PCX('Gfx\backtop.pcx',x1,y1,x2-x1,239);
      Show_PCX('Gfx\backbot.pcx',x1,y1+240,x2-x1,y2-y1-240);
    end
    else
    begin
      SetFillStyle(SolidFill,LightGray);
      bar(x1,y1,x2,y2);
    end;
  end
  else
  begin
    if (FileExists('Gfx\backtop.pcx')) and (FileExists('Gfx\backbot.pcx')) then
    begin
      Show_PCX('Gfx\backtop.pcx',x1,y1,x2-x1,y2-y1);
    end
    else
    begin
      SetFillStyle(SolidFill,LightGray);
      bar(x1,y1,x2,y2);
    end;
  end;
  SetColor(White);
  line(x1,y1,x1,y2);
  line(x1,y1,x2,y1);
  SetColor(Gray);
  line(x2,y1,x2,y2);
  line(x1,y2,x2,y2);
end;

procedure BlinkArrow(P: integer);
begin
  repeat
    DrawArrow(P,Sky);
    delay(50);
    DrawArrow(P,PList[P].Color);
    if keypressed then break;
    delay(100);
  until keypressed;
end;

procedure DrawTank(P: integer;C: word);
begin
  if C = Black then C := Sky;
  SetFillStyle(SolidFill,C);
  bar(PList[P].PosX-3,PList[P].PosY-2,PList[P].PosX+3,PList[P].PosY+1);
  if C = Sky then
  begin
    PutPixel(PList[P].PosX-3,PList[P].PosY-2,C);
    PutPixel(PList[P].PosX+3,PList[P].PosY-2,C);
  end
  else
  begin
    PutPixel(PList[P].PosX-3,PList[P].PosY-2,PList[P].SecColor);
    PutPixel(PList[P].PosX+3,PList[P].PosY-2,PList[P].SecColor);
  end;
end;

procedure DrawCannon(P: integer;C: word);
var px,py : integer;
begin
  px := PList[P].PosX;
  py := PList[P].PosY;
  if C = Black then C := Sky;
  SetColor(C);
  Line(px,
       py-3,
       round(Cos(PList[P].Angle)*5)+px,
       -round(Sin(PList[P].Angle)*5)+py-3);
  if (PList[P].Shield) then
  begin
    if (C <> Sky) then SetColor(LightGray) else SetColor(Sky);
    line(px-2,py-12,px+2,py-12);
    line(px-2,py-12,px-5,py-10);
    line(px+2,py-12,px+5,py-10);
    if (C <> Sky) then SetColor(Gray);
    line(px-1,py-10,px+1,py-10);
    line(px-1,py-10,px-4,py-9);
    line(px+1,py-10,px+4,py-9);
  end;
end;

procedure DrawScrEdge;
begin
  SetColor(Magenta);
  rectangle(0,17,GetMaxX,GetMaxY-17);
  SetColor(DarkMagenta);
  rectangle(1,18,GetMaxX-1,GetMaxY-18);
end;

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

procedure DrawGuiBar(N: integer);
begin
  SetFillStyle(SolidFill,Black);
  bar(443,GetMaxY-10,494,GetMaxY-5);
  if N > 0 then
  begin
    SetFillStyle(SolidFill,Red);
    bar(443,GetMaxY-9,443+N,GetMaxY-6);
    SetColor(DarkRed);
    line(443,GetMaxY-6,443+N,GetMaxY-6);
    line(443+N,GetMaxY-9,443+N,GetMaxY-6);
    SetColor(LightRed);
    line(443,GetMaxY-9,443+N,GetMaxY-9);
  end;
end;

procedure DrawInfo(T: string);
var TmpAng,dir: string;
    C: word;
    N: integer;

  procedure DrawWind;
  var P,Q: integer;
  begin
    wind := wind * 2;
    P := GetMaxX-90;
    Q := GetMaxY-11;
    OutTextXY(P-42,Q,'Wind:');
    SetFillStyle(SolidFill,Black);
    bar(P,Q+1,P+81,Q+6);
    SetColor(White);
    Line(P-1,Q+7,P+82,Q+7);
    Line(P+82,Q+7,P+82,Q);
    SetColor(Gray);
    Line(P-1,Q,P+81,Q);
    Line(P-1,Q,P-1,Q+7);
    SetFillStyle(SolidFill,Blue);
    bar(P+41+wind,Q+2,P+41,Q+5);
    SetColor(MedBlue);
    Line(P+41+wind,Q+5,P+41,Q+5);
    if wind < 0 then SetColor(BrightBlue);
    Line(P+41+wind,Q+2,P+41+wind,Q+5);
    SetColor(BrightBlue);
    Line(P+41+wind,Q+2,P+41,Q+2);
    SetColor(White);
    line(P+41,Q+1,P+41,Q+6);
    wind := wind div 2;
  end;

begin
  if T = 'All' then
  begin
    { Main bar (Top) }
    if FileExists('Gfx\bar.pcx') then
      Show_Pcx('Gfx\bar.pcx',0,0,GetMaxX,16)
    else
    begin
      SetFillStyle(SolidFill,LightGray);
      bar(0,0,GetMaxX,16);
    end;
    SetColor(White);
    Line(0,0,GetMaxX,0);
    Line(0,0,0,16);
    SetColor(Gray);
    Line(0,16,GetMaxX,16);
    Line(GetMaxX,16,GetMaxX,0);
    { Main bar (Bottom) }
    if FileExists('Gfx\bar.pcx') then
      Show_Pcx('Gfx\bar.pcx',0,GetMaxY-16,GetMaxX,16)
    else
    begin
      SetFillStyle(SolidFill,LightGray);
      bar(0,GetMaxY-16,GetMaxX,GetMaxY);
    end;
    SetColor(White);
    Line(0,GetMaxY-16,GetMaxX,GetMaxY-16);
    Line(0,GetMaxY-16,0,GetMaxY);
    SetColor(Gray);
    Line(0,GetMaxY,GetMaxX,GetMaxY);
    Line(GetMaxX,GetMaxY,GetMaxX,GetMaxY-16);
    { Small frames (Top) }
    DrawFrame(57,3,130,13);
    DrawFrame(188,3,222,13);
    DrawFrame(GetMaxX-26,3,GetMaxX-8,13);
    DrawFrame(GetMaxX-192,3,GetMaxX-30,13);
    { Small frames (Bottom) }
    DrawFrame(64,GetMaxY-13,98,GetMaxY-3);
    DrawFrame(200,GetMaxY-13,210,GetMaxY-3);
    DrawFrame(312,GetMaxY-13,340,GetMaxY-3);
    SetColor(DarkGray);
    OutTextXY(8,5,'Power:');
    OutTextXY(140,5,'Angle:');
    OutTextXY(GetMaxX-248,5,'Weapon:');
    OutTextXY(8,GetMaxY-11,'Armour:');
    OutTextXY(112,GetMaxY-11,'Parachutes:');
    OutTextXY(224,GetMaxY-11,'Mag.Shield:');
    DrawWind;
    SetFillStyle(SolidFill,Black);
    bar(66,GetMaxY-11,96,GetMaxY-5);
    SetColor(White);
    OutTextXY(66,GetMaxY-11,MakeSpaces(IntToStr(PList[CurP].Armour),4));
    bar(202,GetMaxY-11,208,GetMaxY-5);
    OutTextXY(202,GetMaxY-11,IntToStr(PList[CurP].Para));
    bar(314,GetMaxY-11,338,GetMaxY-5);
    if PList[CurP].Shield then
    begin
      SetColor(White);
      OutTextXY(314,GetMaxY-11,'On');
    end
    else
    begin
      SetColor(LightGray);
      OutTextXY(314,GetMaxY-11,'Off');
    end;
    { Name }
    C := PList[CurP].Color;
    if (C <> Gray) and (C <> DarkMagenta) and (C <> DarkGreen) and
       (C <> DarkBrown) and (C <> Blue) and (C <> Red) and (C <> Magenta) then
      SetColor(Gray)
    else
      SetColor(DarkGray);
    OutTextXY((GetMaxX div 2)-(Length(PList[CurP].Name)*8 div 2)-11,5,PList[CurP].Name);
    SetColor(PList[CurP].Color);
    OutTextXY((GetMaxX div 2)-(Length(PList[CurP].Name)*8 div 2)-12,4,PList[CurP].Name);
  end;
  SetColor(White);
  if (T = 'Power') or (T = 'All') then
  begin
    SetFillStyle(SolidFill,Black);
    bar(58,5,128,12);
    OutTextXY(58,5,MakeSpaces(IntToStr(PList[CurP].Power)+'/'+IntToStr(PList[CurP].MaxPower),9));
  end;
  if (T = 'Angle') or (T = 'All') then
  begin
    if PList[CurP].Angle > (pi/2) then
    begin
      dir := ' L';
      TmpAng := IntToStr(round((pi-PList[CurP].Angle)*(180/pi)))
    end
    else
    begin
      dir := ' R';
      TmpAng := IntToStr(round(PList[CurP].Angle*(180/pi)));
    end;
    SetFillStyle(SolidFill,Black);
    bar(190,5,220,12);
    OutTextXY(190,5,MakeSpaces(TmpAng+dir,4));
  end;
  if (T = 'Weapon') or (T = 'All') then
  begin
    SetColor(White);
    SetFillStyle(SolidFill,Black);
    bar(GetMaxX-190,5,GetMaxX-32,12);
    OutTextXY(GetMaxX-190,5,WeaponList[CurWT].Name);
    bar(GetMaxX-24,5,GetMaxX-10,12);
    N := PList[CurP].WeaponList[PList[CurP].CurW].Ammo;
    if N = -1 then N := 99;
    OutTextXY(GetMaxX-24,5,MakeSpaces(IntToStr(N),2));
  end;
  if T = 'Guidiance' then
  begin
    SetColor(DarkGray);
    OutTextXY(354,GetMaxY-11,'Guid. Fuel:');
    DrawFrame(442,GetMaxY-11,495,GetMaxY-4);
    DrawGuiBar(50);
  end;
  if T = 'NotGuidiance' then
    if (FileExists('Gfx\bar.pcx')) and (FileExists('Gfx\guibar.pcx')) then
      Show_Pcx('Gfx\guibar.pcx',354,GetMaxY-15,141,12)
    else
    begin
      SetFillStyle(SolidFill,LightGray);
      bar(354,GetMaxY-15,495,GetMaxY-3);
    end;
end;

procedure GenerateLand;
var StartX,StartY,SlutX,SlutY,x,ytop,Smoothness,Lines,i,j: integer;
    Breaks: array[1..100] of PointType;
begin
  randomize;
  SetColor(DirtColor);
  StartX := 0;
  StartY := random(GetMaxY div 2)+(GetMaxY div 3)+10;
  Lines := 1;
  repeat
    Breaks[Lines].x := StartX;
    Breaks[Lines].y := StartY;
    Smoothness := random(LandSmooth div 2)+(LandSmooth div 2);
{    Smoothness := random(10)+7;}
    SlutX := random(GetMaxX div LandComplex)+StartX+10;
    SlutY := random(GetMaxY div Smoothness)-(GetMaxY div (Smoothness*2))+StartY;
    if SlutX > GetMaxX-2 then SlutX := GetMaxX-2;
    if SlutY < 75 then SlutY := 75;
    if SlutY > GetMaxY-18 then SlutY := GetMaxY-18;
    StartX := SlutX;
    StartY := SlutY;
    inc(Lines);
  until SlutX = GetMaxX-2;
  Breaks[Lines].x := SlutX;
  Breaks[Lines].y := SlutY;
  for i := 1 to Lines-1 do
  begin
    LandTop[Breaks[i].x] := Breaks[i].y;
    for j := Breaks[i].x to Breaks[i+1].x do
      LandTop[j] := Breaks[i].y+round((Breaks[i+1].y-Breaks[i].y)*(j-Breaks[i].x)/(Breaks[i+1].x-Breaks[i].x));
  end;
end;

procedure DrawLand;
var x,i: integer;
    r: real;
begin
  randomize;
  for x := 2 to GetMaxX-2 do
    for i := LandTop[x]+1 to GetMaxY-18 do
    begin
      r := (GetMaxY-i+LandTop[x])/70;
      if r < 1 then r := 1/r;
      if round(r) <= 1 then r := 2;
      if random(round(r)) = 0 then
        putpixel(x,i,DirtColor2)
      else
        putpixel(x,i,DirtColor);
    end;
  SetColor(DirtColor2);
  for x := 3 to GetMaxX-2 do
    Line(x-1,LandTop[x-1],x,LandTop[x]);
end;

procedure ShowRoundSign;
var x1,y1,x2,y2: integer;
    P: Pointer;
    T: string;
begin
  x1 := GetMaxX div 2 - 57;
  y1 := GetMaxY div 2 - 8;
  x2 := x1 + 114;
  y2 := y1 + 14;
  GetMem(P, ImageSize(x1,y1,x2,y2));
  GetImage(x1,y1,x2,y2, P^);
  DrawBox(x1,y1,x2,y2);
  if CurR > 9 then
    T := 'R O U N D  '+IntToStr(CurR)
  else
    T := 'R O U N D   '+IntToStr(CurR);
  SetColor(DarkGray);
  OutTextXY(x1 + 7,y1 + 5,T);
  SetColor(White);
  OutTextXY(x1 + 6,y1 + 4,T);
  readkey;
  PutImage(x1,y1,P^,NormalPut);
  FreeMem(P,ImageSize(x1,y1,x2,y2));
end;

procedure DrawArrow(P: integer;C: word);
begin
  if C = Black then C := Sky;
  SetColor(C);
  line(PList[P].PosX-2,PList[P].PosY-16,PList[P].PosX+2,PList[P].PosY-16);
  line(PList[P].PosX-1,PList[P].PosY-15,PList[P].PosX+1,PList[P].PosY-15);
  PutPixel(PList[P].PosX,PList[P].PosY-14,C);
end;

procedure DrawWepList;
var P,R: pointer;
    x,y: array[1..4] of integer;
    lines: array[1..10] of string[35];
    i,WepNum,ItemNum,ListNum,VisTop,VisBot,DLCount: integer;
    Descript: boolean;
    k: char;

  procedure ReadDesc(N: integer);
  var T,cs,ce,j: integer;
      info: string;

    procedure FindLeftSpace(var e:integer);
    begin
      while (info[e] <> ' ') and (e > 0) do dec(e);
    end;

  begin
    T := PList[CurP].WeaponList[N].WepType;
    info := WeaponList[T].info;
    j := 1;
    cs := 1;
    ce := 35;
    while ce <= length(info) do
    begin
      FindLeftSpace(ce);
      lines[j] := copy(info,cs,ce-cs+1);
      cs := ce+1;
      ce := cs+34;
      inc(j);
    end;
    lines[j] := copy(info,cs,length(info)-cs+1);
    DLCount := j;
  end;

  procedure DrawItem(Top,P: integer;C: word);
  var T,S,N: integer;
  begin
    N := P-Top+1;
    SetColor(White);
    SetFillStyle(SolidFill,C);
    bar(x[1]+9,y[1]+9+(10*N),x[2]-9,y[1]+18+(10*N));
    T := PList[CurP].WeaponList[P].WepType;
    OutTextXY(x[1]+10,y[1]+10+(10*N),WeaponList[T].LName);
    S := PList[CurP].WeaponList[P].Ammo;
    if S = -1 then S := 99;
    OutTextXY(X[2]-35,y[1]+10+(10*N),MakeSpaces(IntToStr(S),2));
  end;

  procedure DrawDesc(N: integer);
  var i,T: integer;
  begin
    SetColor(White);
    SetFillStyle(SolidFill,Black);
    bar(x[3]+9,y[3]+19,x[4]-67,y[4]-9);
    for i := 1 to DLCount do
      OutTextXY(x[3]+10,y[3]+10+(10*i),Lines[i]);
    T := PList[CurP].WeaponList[N].WepType;
    If FileExists(WeaponList[T].Img) then
      Show_PCX(WeaponList[T].Img,x[4]-59,y[3]+19,49,49);
  end;

  procedure DrawItems(N: integer);
  var i: integer;
  begin
    If N < VisTop then
    begin
      VisTop := N;
      VisBot := N+ItemNum-1;
    end;
    if N > VisBot then
    begin
      VisBot := N;
      VisTop := N-ItemNum+1;
    end;
    for i := VisTop to VisBot do
    begin
      if i = N then DrawItem(VisTop,i,DarkestGreen) else DrawItem(VisTop,i,Black);
      SetColor(LightGray);
      if (i = VisTop) and (VisTop > 1) then
        OutTextXY(X[2]-18,Y[1]+20,#30);
      if (i = VisBot) and (VisBot < PList[CurP].MaxW) then
        OutTextXY(X[2]-18,Y[1]+60,#31);
    end;
    if Descript then
    begin
      ReadDesc(N);
      DrawDesc(N);
    end;
  end;

begin
  DrawCannon(CurP,White);
  SetColor(White);
  { Weaponslist }
  x[1] := GetMaxX-360; y[1] := 20;
  ItemNum := PList[CurP].MaxW;
  if ItemNum > 5 then ItemNum := 5;
  x[2] := GetMaxX-4; y[2] := y[1]+27+(ItemNum*10);
  GetMem(P, ImageSize(x[1],y[1],x[2],y[2]));
  GetImage(x[1],y[1],x[2],y[2],P^);
  if FileExists('Gfx\weplist.pcx') then
    Show_Pcx('Gfx\weplist.pcx',x[1],y[1],x[2]-x[1],y[2]-y[1])
  else
  begin
    SetFillStyle(SolidFill,LightGray);
    bar(x[1],y[1],x[2],y[2]);
  end;
  SetColor(White);
  line(x[1],y[1],x[1],y[2]);
  line(x[1],y[1],x[2],y[1]);
  SetColor(Gray);
  line(x[2],y[1],x[2],y[2]);
  line(x[1],y[2],x[2],y[2]);
  SetColor(DarkGray);
  OutTextXY(x[1]+3,y[1]+4,'Weapon list:');
  DrawFrame(x[1]+8,y[1]+18,x[2]-8,y[1]+19+(ItemNum*10));
  { Description }
  x[3] := GetMaxX-360; y[3] := y[1]+27+(ItemNum*10)+4;
  x[4] := GetMaxX-4; y[4] := y[3]+77;
  Descript := true;
  if ImageSize(x[3],y[3],x[4],y[4]) > MemAvail then Descript := false;
  if Descript then
  begin
    GetMem(R, ImageSize(x[3],y[3],x[4],y[4]));
    GetImage(x[3],y[3],x[4],y[4],R^);
    if FileExists('Gfx\weplist.pcx') then
      Show_Pcx('Gfx\weplist.pcx',x[3],y[3],x[4]-x[3],y[4]-y[3])
    else
    begin
      SetFillStyle(SolidFill,LightGray);
      bar(x[3],y[3],x[4],y[4]);
    end;
    SetColor(White);
    line(x[3],y[3],x[3],y[4]);
    line(x[3],y[3],x[4],y[3]);
    SetColor(Gray);
    line(x[4],y[3],x[4],y[4]);
    line(x[3],y[4],x[4],y[4]);
    SetColor(DarkGray);
    OutTextXY(x[3]+3,y[3]+4,'Description:');
    DrawFrame(x[3]+8,y[3]+18,x[4]-66,y[4]-8);
    DrawFrame(x[4]-60,y[3]+18,x[4]-8,y[4]-8);
  end;
  WepNum := PList[CurP].CurW;
  VisTop := WepNum-round(ItemNum/2);
  VisBot := WepNum+round(ItemNum/2);
  if VisTop < 1 then
  begin
    VisTop := 1;
    VisBot := ItemNum;
  end;
  if VisBot > PList[CurP].MaxW then
  begin
    VisBot := PList[CurP].MaxW;
    VisTop := PList[CurP].MaxW-ItemNum+1;
  end;
  DrawItems(WepNum);
  repeat
    k := readkey;
    if k = #80 then
    begin
      inc(WepNum);
      MakeSound(400,2);
      if WepNum > PList[CurP].MaxW then WepNum := PList[CurP].MaxW else DrawItems(WepNum);
    end;
    if k = #72 then
    begin
      dec(WepNum);
      MakeSound(400,2);
      if WepNum < 1 then WepNum := 1 else DrawItems(WepNum);
    end;
    if k = #71 then begin WepNum := 1; DrawItems(WepNum); end;
    if k = #79 then begin WepNum := PList[CurP].MaxW; DrawItems(WepNum); end;
    if k = #81 then
    begin
      WepNum := WepNum+ItemNum;
      MakeSound(450,2);
      if WepNum > PList[CurP].MaxW then WepNum := PList[CurP].MaxW;
      DrawItems(WepNum);
    end;
    if k = #73 then
    begin
      WepNum := WepNum-ItemNum;
      MakeSound(450,2);
      if WepNum < 1 then WepNum := 1;
      DrawItems(WepNum);
    end;
{    if (ord(k) > 96) and (ord(k) < 123) then WepNum := FindWep(WepNum,k);}
  until (k = #27) or (k = #13) or (k = #9) or (k = ' ');
  if (k = #13) or (k = #9) or (K = ' ') then
  begin
    PList[CurP].CurW := WepNum;
    CurWT := PList[CurP].WeaponList[PList[CurP].CurW].WepType;
    DrawInfo('Weapon');
    if WeaponList[CurWT].Class = Guiding then
      DrawInfo('Guidiance')
    else
      DrawInfo('NotGuidiance');
  end;
  MakeSound(200,4);
{  OutTextXY(10,50,'Free Mem:'+IntToStr(MemAvail));}
  PutImage(x[1],y[1],P^, NormalPut);
  FreeMem(P, ImageSize(x[1],y[1],x[2],y[2]));
  if Descript then
  begin
    PutImage(x[3],y[3],R^, NormalPut);
    FreeMem(R, ImageSize(x[3],y[3],x[4],y[4]));
  end;
end;

procedure DrawLandTop;
var x: integer;
begin
  SetColor(DirtColor2);
  for x := 3 to GetMaxX-2 do
    Line(x-1,LandTop[x-1],x,LandTop[x]);
end;

end.
