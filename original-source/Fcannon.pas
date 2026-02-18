unit FCannon;

interface

  procedure FireCannon;
  procedure ChangePlayer;

implementation

uses crt,graph,Global,Drawing,Combat,Colors;

const ExpCol: array[1..20] of byte =
               (210,245,174,244,138,243,102,242,66,241,30,240,24,239,18,238,12,237,6,236);
              {(210,174,138,102,66,30,24,18,12,6);}

type ShotType = record
       px,py,vx,vy: extended;
       dead,miss: boolean;
     end;

var Shot: Array[1..10,1..10] of ShotType;
    GLevel,Shots,ExNum,Leaps: integer;
    ax,ay,GuiBar: extended;
    Divided,MaxYReached: boolean;

procedure ReadKeys(N,L:integer);
var Angle: real;
begin
  if keypressed then
  begin
    k := readkey;
    if GuiBar > 0 then
    with Shot[N,L] do
    begin
      if k = #75 then
      begin
        angle := 0.01*GLevel;
        vx := cos(angle)*(vx)+sin(angle)*(vy);
        vy := -sin(angle)*(vx)+cos(angle)*(vy);
        GuiBar := GuiBar - 0.5;
        DrawGuiBar(round(GuiBar));
      end;
      if k = #77 then
      begin
        angle := -0.01*GLevel;
        vx := cos(angle)*(vx)+sin(angle)*(vy);
        vy := -sin(angle)*(vx)+cos(angle)*(vy);
        GuiBar := GuiBar - 0.5;
        DrawGuiBar(round(GuiBar));
      end;
    end;
    k := #0;
  end;
end;

function MoveShot(N,L: integer): boolean;
var i,c: integer;
    Died: boolean;

  procedure DivideMirv;
  var i: integer;
  begin
    Shots := WeaponList[CurWT].Shots;
    for i := 2 to Shots do
    begin
      Shot[i,L] := Shot[1,L];
      Shot[i,L].vx := Shot[1,L].vx*((i-1)/Shots);
    end;
    Divided := true;
  end;

  procedure BendShot;
  begin
    with Shot[N,L] do
    if (py > PList[i].PosY-100) and (py < PList[i].PosY) and
       (px > PList[i].PosX-(PList[i].PosY-py)/2) and
       (px < PList[i].PosX+(PList[i].PosY-py)/2) then
         vy := vy - ((abs(vy)+abs(vx))/500+0.001);
    end;

  procedure ShotHitGround;
  begin
    with Shot[N,L] do
    begin
      hole[round(px)] := true;
      if (not WeaponList[CurWT].ExpOnImp) then
      begin
        vx := vx * 0.7;
        vy := vy * 0.7;
        if ((abs(vx) < 0.08) and (abs(vy) < 0.08)) then Died := true;
      end
      else
        Died := true;
    end;
  end;

begin
  Died := false;
  with Shot[N,L] do
  begin
    if Tracers then
    begin
      if TraceColAsTank then
        putpixel(round(px),round(py),PList[CurP].SecColor)
      else
        putpixel(round(px),round(py),DarkGray);
    end
    else
      putpixel(round(px),round(py),Sky);
    ReadKeys(N,L);
    vy := vy+ay;
    vx := vx+ax;
    if (px+vx > GetMaxX-2) or (px+vx < 2) then
      if not (WeaponList[CurWT].Class = Nitro) then
      begin
        vx := -vx*0.9;
        MakeSound(250,2);
      end
      else Died := true;
    px := px+vx;
    if (py+vy > GetMaxY-19) then
      if not (WeaponList[CurWT].Class = Nitro) then
      begin
        vy := -vy*0.5;
        MakeSound(250,2);
      end
      else Died := true;
    if (py+vy < 19) then
      if not (WeaponList[CurWT].Class = Nitro) then
      begin
        vy := -vy*0.9;
        MakeSound(250,2);
      end
      else Died := true;
    py := py+vy;
    c := GetPixel(round(px),round(py));
    if (c = DirtColor) or (c = DirtColor2) then ShotHitGround;
    putpixel(round(px),round(py),yellow);
    if WeaponList[CurWT].Class = Guiding then
      if GuiBar > 0 then
      begin
        GuiBar := GuiBar - 0.025;
        DrawGuiBar(round(GuiBar));
      end;
    if (vy > 0) then
    begin
      MaxYReached := True;
      if (not Divided) and (WeaponList[CurWT].Shots > 1) then DivideMirv;
    end;
    if Shots-ExNum < 3 then delay(2-ord(FastShot)) else delay(1);
    for i := 1 to Players do
      if (PList[i].MaxPower > 0) then
      begin
        if (PList[i].Shield) and not
          ((i = CurP) and (not MaxYReached)) then BendShot;
        if ((round(px) < PList[i].PosX+5) and (round(px) > PList[i].PosX-5)) and
           ((round(py) < PList[i].PosY+2) and (round(py) > PList[i].PosY-3)) then Died := true;
      end;
    if (abs(vy) < 0.08) and (py+vy > GetMaxY-19) then Died := true;
    if Died then
    begin
      Dead := true;
      MoveShot := true;
    end
    else
      MoveShot := false;
  end;
end;

procedure Explode(N,L: integer);
var i,j,x,y: integer;
begin
  with Shot[N,L] do
  begin
    x := round(px);
    y := round(py);
    hole[x] := true;
    for i := 1 to WeaponList[CurWT].Dam do
    begin
      if x+i < GetMaxX-1 then hole[x+i] := true;
      if x-i > 1 then hole[x-i] := true;
      SetColor(ExpCol[round((i/WeaponList[CurWT].Dam)*20)]);
      Ellipse(x,y,0,360,i,i);
{      c := round((WeaponList[CurWT].Dam)/20+0.5);
      for j := round((i/c)) downto 1 do
      begin
        SetColor(ExpCol[round(((j*c)/WeaponList[CurWT].Dam)*20)]);
        SetFillStyle(SolidFill,ExpCol[round(((j*c)/WeaponList[CurWT].Dam)*20)]);
        FillEllipse(round(px),round(py),j*c,j*c);
      end;}
      DrawScrEdge;
      if ((y-i) < 19) or ((y+i) > GetMaxY-19) then DrawInfo('All');
{      if WeaponList[CurWT].Dam < 40 then
        delay(2)
      else
        if WeaponList[CurWT].Dam < 80 then
          delay(1);}
      if SoundOn then sound(random(100));
      delay(1);
      ClearKeys;
    end;
    NoSound;
    if x+i+1 < GetMaxX-1 then hole[x+i+1] := true;
    if x-i+1 > 1 then hole[x-i-1] := true;
    SetColor(Sky);
    SetFillStyle(SolidFill,Sky);
    FillEllipse(round(px),round(py),i,i);
{    for i := WeaponList[CurWT].Dam downto 1 do
    begin
      Ellipse(x,y,0,360,i,i);
      if SoundOn then sound(50);
      NoSound;
    end;}
    if L < Leaps then PutPixel(round(px),round(py),Yellow);
  end;
  DrawInfo('All');
  DrawScrEdge;
  for i := 1 to Players do
    if PList[i].MaxPower > 0 then
    begin
      DrawTank(i,PList[i].Color);
      DrawCannon(i,White);
    end;
end;

procedure Impact(N,L: integer);

  procedure MoveRoller;
  var Dir,OldDir,i: integer;
      Exp: boolean;
      yr,yl: integer;

    function RightCheck: boolean;
    var i: integer;
    begin
      i := 0;
      while (LandTop[round(Shot[N,L].px)+i]-1 = round(Shot[N,L].py)) and (i < 20) do
        inc(i);
      if i = 20 then
        yr := 0
      else
        if (LandTop[round(Shot[N,L].px)+i]-1 < round(Shot[N,L].py)) then
          yr := -1
        else
          yr := 1;
    end;

    procedure LeftCheck;
    var i: integer;
    begin
      i := 0;
      while (LandTop[round(Shot[N,L].px)-i]-1 = round(Shot[N,L].py)) and (i < 20) do
        inc(i);
      if i = 20 then
        yl := 0
      else
        if (LandTop[round(Shot[N,L].px)-i]-1 < round(Shot[N,L].py)) then
          yl := -1
        else
          yl := 1;
    end;

  begin
    PutPixel(round(Shot[N,L].px),round(Shot[N,L].py),Sky);
    for i := 1 to Players do
      if PList[i].MaxPower > 0 then
        if ((round(Shot[N,L].px) < PList[i].PosX+4) and (round(Shot[N,L].px) > PList[i].PosX-4)) and
           ((round(Shot[N,L].py) < PList[i].PosY+3) and (round(Shot[N,L].py) > PList[i].PosY-2)) then
          Exp := true
        else
          Exp := false;
    Shot[N,L].py := LandTop[round(Shot[N,L].px)]-1;
    RightCheck;
    LeftCheck;
    if yr > yl then OldDir := 1;
    if yr < yl then OldDir := -1;
    if yr = yl then Exp := true;
    Dir := 0;
    repeat
      RightCheck;
      LeftCheck;
      if yr > yl then Dir := 1;
      if yr < yl then Dir := -1;
      if yr = yl then Exp := true;
      if (Dir <> OldDir) then Exp := true;
      if (Shot[N,L].px+Dir > GetMaxX-2) or (Shot[N,L].px+Dir < 2) then Exp := true;
      if not Exp then
      begin
        for i := 1 to Players do
          if PList[i].MaxPower > 0 then
            if ((round(Shot[N,L].px) < PList[i].PosX+4) and (round(Shot[N,L].px) > PList[i].PosX-4)) and
               ((round(Shot[N,L].py) < PList[i].PosY+3) and (round(Shot[N,L].py) > PList[i].PosY-2)) then Exp := true;
        PutPixel(round(Shot[N,L].px),round(Shot[N,L].py),Sky);
        Shot[N,L].px := Shot[N,L].px + Dir;
        OldDir := Dir;
        Shot[N,L].py := LandTop[round(Shot[N,L].px)]-1;
        PutPixel(round(Shot[N,L].px),round(Shot[N,L].py),Yellow);
      end;
      delay(10);
    until Exp;
  end;

begin
  if WeaponList[CurWT].Class = Roller then MoveRoller;
  Explode(N,L);
end;

procedure ChangePlayer;
begin
  repeat
    if CurP+1 > Players then
    begin
      CurP := 1;
      if not NoWind then
      begin
        wind := wind + (random(11)-5);
        if wind < -20 then wind := wind-(wind+20)*2;
        if wind > 20 then wind := wind-(wind-20)*2;
      end;
    end
    else
      inc(CurP);
  until (PList[CurP].MaxPower > 0) or (LivePlayers < 2);
  CurWT := PList[CurP].WeaponList[PList[CurP].CurW].WepType;
  if LivePlayers > 1 then DrawInfo('All');
  if WeaponList[CurWT].Class = Guiding then DrawInfo('Guidiance');
end;

procedure FireCannon;
var lv: extended;
    i,j,h: integer;

    procedure DecDamFromShot;
    var i,h,j,StatDam1,StatDam2,HeadShots,lossexp,lossexpall,lossfallall,rank: integer;
        killed: array[1..8] of boolean;
    begin
      for i := 1 to 8 do
        killed[i] := false;
      rank := 0;
      for h := 1 to Players do
        if PList[h].MaxPower > 0 then
        begin
          StatDam1 := 0;
          StatDam2 := 0;
          lossexpall := 0;
          HeadShots := 0;
          for j := 1 to Leaps do
            for i := 1 to Shots do
            begin
              CalcTankDam(h,round(Shot[i,j].px),round(Shot[i,j].py),lossexp);
              if lossexp = -1 then
              begin
                if CurP <> h then inc(HeadShots);
                lossexpall := lossexpall + CalcHeadShot;
              end
              else
                lossexpall := lossexpall + lossexp;
              if (CurP <> h) and (lossexp <> 0) then Shot[i,j].Miss := false;
            end;
          MoveTanks(h,lossexpall,lossfallall);
          DecMaxP(h,lossexpall,lossfallall,HeadShots);
          if PList[h].MaxPower < 1 then
          begin
            if rank < liveplayers+1 then rank := LivePlayers+1;
            Killed[h] := true;
          end;
{          if lossexp = -1 then StatDam1 := StatDam1 + CalcHeadShot else StatDam1 := StatDam1 + loss1;}
          StatDam1 := StatDam1 + lossexpall;
          StatDam2 := StatDam2 + lossfallall;
          if CurP <> h then
            PList[CurP].Stats[1].Damage := PList[CurP].Stats[1].Damage + StatDam1 + StatDam2;
        end;
      for j := 1 to Leaps do
        for i := 1 to Shots do
        begin
          if Shot[i,j].Miss then inc(PList[CurP].Stats[1].Misses);
          inc(PList[CurP].Stats[1].Shots);
        end;
      for i := 1 to 8 do
        if Killed[i] = true then PList[i].stats[1].Place := rank;
    end;

    procedure CheckNoAmmo;
    var N,W: integer;

      procedure RemoveWep(W: integer);
      var i: integer;
      begin
        for i := W to PList[CurP].MaxW-1 do
          PList[CurP].WeaponList[i] := PList[CurP].WeaponList[i+1];
        dec(PList[CurP].MaxW);
        dec(PLIst[CurP].CurW);
      end;

    begin
      W := PList[CurP].CurW;
      N := PList[CurP].WeaponList[W].Ammo;
      if N > -1 then dec(N);
      PList[CurP].WeaponList[W].Ammo := N;
      if N = 0 then RemoveWep(W);
    end;

begin
  DrawCannon(CurP,White);
  DrawArrow(CurP,Black);
  Divided := false;
  { Leaping missiles }
  if WeaponList[CurWT].Class = Leap then
    Leaps := WeaponList[CurWT].Leaps
  else
    Leaps := 1;
  { Multiple missiles }
  if WeaponList[CurWT].Class = MultiShot then
  begin
    Shots := WeaponList[CurWT].Shots;
    Divided := true;
  end
  else
    Shots := 1;
  { Guided missiles }
  if WeaponList[CurWT].Class = Guiding then
  begin
    GLevel := WeaponList[CurWT].Shots;
    Shots := 1;
    Divided := true;
    GuiBar := 50;
  end
  else
    GuiBar := 0;
  lv := PList[CurP].Power/650;
  ay := 0.001;
  ax := wind/100000;
{  mid := (Shots + 1) div 2;}
  randomize;
  for i := 1 to Shots do
  begin
    MakeSound(200,5);
    Shot[i,1].px := round(Cos(PList[CurP].Angle)*6)+PList[CurP].PosX;
    Shot[i,1].py := -round(Sin(PList[CurP].Angle)*6)+PList[CurP].PosY-3;
    Shot[i,1].vx := Cos(PList[CurP].Angle)*(lv - (i-1)/25);
    Shot[i,1].vy := -Sin(PList[CurP].Angle)*(lv - (i-1)/25);
    Shot[i,1].Dead := false;
    Shot[i,1].Miss := true;
  end;
  if WeaponList[CurWT].Class = Nitro then
    if WeaponList[CurWT].Dam*lv > 25 then
    begin
      shots := 1;
      ExNum := 1;
      Shot[1,1].Dead := true;
      impact(1,1);
    end
    else
    begin
      ExNum := 0;
      Shot[1,1].Dead := false;
    end;
  MaxYReached := false;
  for j := 1 to Leaps do
  begin
    if WeaponList[CurWT].Class <> Nitro then
    begin
      ExNum := 0;
      for i := 1 to Shots do
        Shot[i,j].Dead := false;
    end;
    while ExNum < Shots do
      for i := 1 to Shots do
      begin
        if not Shot[i,j].dead then
          if MoveShot(i,j) then
          begin
            inc(ExNum);
            Impact(i,j);
          end
          else
            for h := 1 to Players do
              if PList[h].MaxPower > 0 then
                DrawCannon(h,White);
      end;
    lv := lv*0.85;
    for h := 1 to Shots do
    begin
      PutPixel(round(Shot[h,j].px),round(Shot[h,j].py),Sky);
      Shot[h,j+1].px := shot[h,j].px;
      Shot[h,j+1].py := shot[h,j].py;
      Shot[h,j+1].vx := Cos(random(314)/100)*lv;
      Shot[h,j+1].vy := -Sin(random(314)/100)*lv;
      Shot[h,j+1].Miss := true;
    end;
  end;
  DrawInfo('All');
  DrawScrEdge;
  MoveDirt;
  DecDamFromShot;
  DrawLandTop;
  for i := 1 to Players do
    if PList[i].MaxPower > 0 then
    begin
      DrawTank(i,PList[i].Color);
      DrawCannon(i,White);
    end;
  CheckNoAmmo;
  ChangePlayer;
end;

end.