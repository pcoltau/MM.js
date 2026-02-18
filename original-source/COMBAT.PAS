unit Combat;

interface

procedure ExpTank(P: integer);
procedure MoveTanks(P,Lexp: integer;var L: integer);
procedure CalcTankDam(P,X,Y: integer;var L: integer);
procedure DecMaxP(P,L1,L2,H: integer);
procedure MoveDirt;

implementation

uses crt,graph,Global,Drawing,Colors,Comments;

procedure ExpTank(P: integer);
var x,y,vx,vy: array[1..100] of extended;
    stopped: array[1..100] of boolean;
    bounce: array[1..100] of integer;
    i,j,Num,NumStopped: integer;
    col: word;
begin
  num := 100;
  for i := 1 to num do
  begin
    stopped[i] := false;
    bounce[i] := 0;
    x[i] := PList[P].PosX+(random(7)-3);
    y[i] := PList[P].PosY+(random(3)-1);
    vx[i] := Cos((random(round(0.5*pi*100))+round(0.25*pi*100))/100);
    vy[i] := -Sin((random(150)+2)/100);
{    vy[i] := -(random(100)+20)/100;}
  end;
  NumStopped := 0;
  repeat
    for i := 1 to num do
      if not stopped[i] then
      begin
        putpixel(round(x[i]),round(y[i]),Sky);
        if not NoWind then vx[i] := vx[i] + wind/10000;
        vy[i] := vy[i] + 0.01;
        if (x[i]+vx[i] > GetMaxX-2) or (x[i]+vx[i] < 2) then
        begin
          vx[i] := -0.5*vx[i];
          if bounce[i] < 1 then MakeSound(200,1);
          inc(bounce[i]);
        end;
        if (y[i]+vy[i] > GetMaxY-19) or (y[i]+vy[i] < 18) then
        begin
          vy[i] := -0.5*vy[i];
          if bounce[i] < 1 then MakeSound(200,1);
          inc(bounce[i]);
        end;
        while (LandTop[round(x[i]+vx[i])]-1 < round(y[i]+vy[i])) and
              (bounce[i] < 2) do
          begin
            vy[i] := -0.5*vy[i];
            if bounce[i] < 1 then MakeSound(200,1);
            inc(bounce[i]);
          end;
        if bounce[i] > 1 then
        begin
          Stopped[i] := true;
          inc(NumStopped);
        end
        else
        begin
          x[i] := x[i]+vx[i];
          y[i] := y[i]+vy[i];
          putpixel(round(x[i]),round(y[i]),PList[P].color);
        end;
      end;
    delay(4);
    for j := 1 to Players do
      if PList[j].MaxPower > 0 then
      begin
        DrawTank(j,PList[j].Color);
        DrawCannon(j,White);
      end;
  until NumStopped = Num;
end;

procedure MoveTanks(P,Lexp: integer;var L: integer);
var i: integer;
    x,y,vx,vy,ay: real;
    fall: boolean;

    procedure DrawPara(C: word);
    var PX,PY: integer;
    begin
      PX := PList[P].PosX;
      PY := PList[P].PosY;
      SetColor(C);
      Line(PX-2,PY-14,PX+2,PY-14);
      Line(PX-3,PY-12,PX-3,PY-13);
      Line(PX+3,PY-12,PX+3,PY-13);
      PutPixel(PX-2,PY-13,C);
      PutPixel(PX+2,PY-13,C);
      PutPixel(PX,PY-15,C);
      if C = White then SetColor(Gray);
      Line(PX-3,PY-11,PX-2,PY-3);
      Line(PX+3,PY-11,PX+2,PY-3);
    end;

    procedure UpdateLandTop(X: integer);
    var y,c,Pixels: integer;
    begin
      Pixels := 0;
      for y := GetMaxY-18 downto LandTop[X] do
      begin
        c := GetPixel(X,Y);
        if (C = DirtColor) or (C = DirtColor2) then inc(Pixels);
      end;
      LandTop[X] := GetMaxY-Pixels-18;
    end;

begin
  L := 0;
  if (PList[P].PosY < LandTop[PList[P].PosX]-2) then
  begin
    if (PList[P].Para > 0) and ((PList[P].MaxPower+PList[i].Armour)-Lexp > 0) then
      dec(PList[P].Para)
    else
      L := ((LandTop[PList[P].PosX]-2)-PList[P].PosY)*5;
    x := PList[P].PosX;
    y := PList[P].PosY;
    if L = 0 then
    begin
      vx := wind/200;
      vy := 0.2;
      ay := 0
    end
    else
    begin
      vx := 0;
      vy := 0;
      ay := 0.01;
    end;
    fall := false;
    while y < LandTop[PList[P].PosX]-2 do
    begin
      fall := true;
      DrawTank(P,Black);
      DrawCannon(P,Black);
      if L = 0 then DrawPara(Sky);
      vy := vy + ay;
      if (x+vx > 6) and (x+vx < GetMaxX-6) then x := x + vx;
      y := y + vy;
      PList[P].PosX := round(x);
      PList[P].PosY := round(y);
      DrawTank(P,PList[P].Color);
      DrawCannon(P,White);
      if L = 0 then DrawPara(White);
      delay(4);
    end;
    if fall then MakeSound(150,5);
    if L = 0 then
    begin
      DrawPara(Sky);
      DrawCannon(P,White);
    end;
    for i := PList[P].PosX-7 to PList[P].PosX+7 do
      UpdateLandTop(i);
  end;
end;

procedure CalcTankDam(P,X,Y: integer;var L: integer);
var d,dam,dx,dy: extended;
begin
  dx := X-PList[P].PosX;
  dy := Y-PList[P].PosY;
  d := dx*dx+dy*dy;
  dam := WeaponList[CurWT].Dam*WeaponList[CurWT].Dam;
  L := 0;
  if d < 8 then
    L := -1
  else
    if d < dam then
    begin
      x := WeaponList[CurWT].Dam;
{      L := round((x/(x+18)*1300)*((dam-d)/dam));}
      L := round((x/(x+30)*2000)*((dam-d)/dam));
    end;
  SetColor(White);
end;

procedure DecMaxP(P,L1,L2,H: integer);
var Str1,Str2: string;
    loss,i: integer;
    Img: pointer;
begin
  loss := L1;
{  for i := 1 to H do
    loss := loss + CalcHeadShot;}
  if WeaponList[CurWT].Class = Piercing then
  begin
    PList[P].MaxPower := PList[P].MaxPower - loss;
    loss := 0;
  end;
  if (loss+L2) > PList[P].Armour then
  begin
    loss := loss+L2-PList[P].Armour;
    PList[P].Armour := 0;
    PList[P].Armourment := NoArmour;
  end
  else
  begin
    PList[P].Armour := PList[P].Armour - (loss+L2);
    loss := 0;
  end;
  if PList[P].Armour = 0 then
  begin
    DrawCannon(P,Black);
    PList[P].Shield := false;
    DrawCannon(P,White);
  end;
  PList[P].MaxPower := PList[P].MaxPower - loss;
  if (L1+L2 > 0) or (H > 0) then
  begin
    GetMem(Img,ImageSize(0,20,GetMaxX,36));
    GetImage(0,20,GetMaxX,36,Img^);
    DrawComment(L1,L2,H,P,PList[P].Color);
  end;
  if PList[P].MaxPower < PList[P].Power then PList[P].Power := PList[P].MaxPower;
  if PList[P].MaxPower < 1 then
  begin
    if P <> CurP then inc(PList[CurP].Stats[1].Kills) else dec(PList[CurP].Stats[1].Kills);
{    PList[P].Stats[1].Place := LivePlayers;}
    DrawTank(P,Black);
    DrawCannon(P,Black);
    ExpTank(P);
    Dec(LivePlayers);
    setcolor(white);
  end;
  if (L1+L2 > 0) or (H > 0) then
  begin
    if PList[P].MaxPower > 0 then
      for i := 1 to CommentDelay do
      begin
        delay(1);
        ClearKeys;
      end;
    PutImage(0,20,Img^,NormalPut);
    FreeMem(Img,ImageSize(0,20,GetMaxX,36));
  end;
end;

procedure MoveDirt;
var i,x,ymem,ytop,pixcount,ScanTop: integer;
    memline: array[0..1000] of word;
    c: word;
begin
  randomize;
  for x := 2 to GetMaxX-2 do if hole[x] then
  begin
    hole[x] := false;
    ClearKeys;
    ytop := GetMaxY-18;
{    while (getpixel(x,ytop) = DirtColor) do dec(ytop);
    if ytop > 1 then
    begin}
{      if s = 'All' then ScanTop := 18 else }
      ScanTop := 18;
      pixcount := 0;
      ymem := ytop;
      while ymem >= ScanTop do
      begin
        c := getpixel(x,ymem);
        if (c = DirtColor) or (c = DirtColor2) then
        begin
          inc(pixcount);
          putpixel(x,ymem,Sky);
          memline[pixcount] := c;
        end;
        dec(ymem);
      end;
{      SetColor(DirtColor);
      if pixcount > 0 then
        line(x,ytop-1,x,ytop-pixcount);}
      if pixcount > 0 then
        for i := ytop-1 downto ytop-pixcount do
          putpixel(x,i,memline[ytop-i]);
      if ytop <> LandTop[x] then LandTop[x] := ytop-pixcount;
      SetColor(DirtColor2);
      if x = 2 then
        Line(x-1,LandTop[x],x,LandTop[x])
      else
        Line(x-1,LandTop[x-1],x,LandTop[x]);
{    end;}
  end;
{  for i := 1 to Players do
    if PList[i].MaxPower > 0 then
    begin
      DrawTank(i,PList[i].Color);
      DrawCannon(i,White);
    end;}
end;

end.