unit Game;

interface

procedure StartGame;

implementation

uses crt,graph,Global,SPCX_New,Colors,Drawing,FCannon,Pause,ShowStat,Purchase,GameSet,Img_Fade,EndStats;

procedure SetPlayersXPos;
var ok: boolean;
    x,n,i: integer;
begin
  repeat
    for i := 1 to Players do
      with PList[i] do
      begin
        n := 0;
        repeat
          ok := true;
          PosX := random(GetMaxX-20)+10;
          for x := 1 to i do
            if x <> i then
              if (PosX < PList[x].PosX + (GetMaxX div (Players * 2))) and
                 (PosX > PList[x].PosX - (GetMaxX div (Players * 2))) then ok := false;
          inc(n);
        until (ok) or (n = 100);
      end;
  until (ok) and (n < 100);
end;

procedure SetNewRound;
var i,j: integer;
begin
  ClearViewPort;
  loadpalette('Gfx\game.pal');
  SetDarkPal(SMemPal);
  setfillstyle(1,sky);
  bar(0,0,getmaxx,getmaxy);
  SetPlayersXPos;
  CurP := 1;
  GenerateLand;
  LivePlayers := Players;
  for i := 1 to Players do
  with PList[i] do
  begin
    Power := 500;
    MaxPower := 1000;
    Angle := pi/4;
    if LandTop[PosX] = GetMaxY-18 then
      PosY := GetMaxY-20
    else
      PosY := LandTop[PosX]-1;
    CurW := 1;
    With Stats[1] do
    begin
      Shots := 0;
      HShots := 0;
      Misses := 0;
      Damage := 0;
      Kills := 0;
      Profit := 0;
      Place := 1;
    end;
  end;
  CurWT := PList[CurP].WeaponList[PList[CurP].CurW].WepType;
  DrawInfo('All');
  DrawLand;
  DrawScrEdge;
  for i := 1 to Players do
  begin
    DrawTank(i,PList[i].Color);
    DrawCannon(i,White);
    {Movetanks(i,gd);}
  end;
  ClearKeys;
  FadeIn(1,SMemPal);
  ShowRoundSign;
  BlinkArrow(CurP);
end;

procedure SetupGame;
var i,j,k,M,N: integer;
    PMem: PlayerType;
begin
  DirtColor := Brown;
  DirtColor2 := DarkestBrown;
{  DirtColor2 := DarkestGreen;}
  randomize;
  if not NoWind then wind := random(41)-20 else wind := 0;
  for i := 2 to 1280 do hole[i] := false;
  LivePlayers := Players;
  CurR := 1;
  for i := 1 to Players do
  with PList[i] do
  begin
{    Name := 'Karl Koder Hm #'+inttostr(i);}
    Power := 500;
    MaxPower := 1000;
    Armour := 0;
    Para := 0;
    Shield := false;
    Angle := pi/4;
    if LandTop[PosX] = GetMaxY-18 then
      PosY := GetMaxY-19
    else
      PosY := LandTop[PosX]-1;
    Armourment := NoArmour;
    CurW := 1;
    MaxW := 3;
    WeaponList[1].Ammo := -1;
    WeaponList[1].WepType := 1;
    WeaponList[2].Ammo := 5;
    WeaponList[2].WepType := 2;
    WeaponList[3].Ammo := 1;
    WeaponList[3].WepType := 3;
{    for j := 1 to MaxW do
    begin
      WeaponList[j].Ammo := -1;
      WeaponList[j].WepType := j;
    end;
}
    for k := 1 to 2 do
    With Stats[k] do
    begin
      Shots := 0;
      HShots := 0;
      Misses := 0;
      Damage := 0;
      Kills := 0;
      Profit := 0;
      Points := 0;
    end;
    Stats[1].Place := 1;
    Stats[2].Place := 1;
{    Stats[2].Place := Players;}
  end;

  if FRoundRandom then
    for i := 1 to Players do
    begin
      M := random(Players)+1;
      repeat
        N := random(Players)+1;
      until n <> m;
      PMem := PList[M];
      PList[M] := PList[N];
      PList[N] := PMem;
    end;
end;

procedure StartGame;
var i: integer;
begin
  FadeOut(1);
  ClearViewPort;
  QuitGame := false;
  if not ShowGameSetup then exit;
  loadPalette('Gfx\game.pal');
  SetDarkPal(SMemPal);
  setfillstyle(1,sky);
  bar(0,0,getmaxx,getmaxy);
  randomize;
  SetPlayersXPos;
  CurP := 1;
  GenerateLand;
  SetupGame;
  CurWT := PList[CurP].WeaponList[PList[CurP].CurW].WepType;
  DrawInfo('All');
  DrawLand;
  DrawScrEdge;
  for i := 1 to Players do
  begin
    DrawTank(i,PList[i].Color);
    DrawCannon(i,White);
    {Movetanks(i,gd);}
  end;
  FadeIn(1,SMemPal);
  ShowRoundSign;
  BlinkArrow(CurP);
  repeat
    if LivePlayers < 2 then
    begin
      ShowStats;
      FadeOut(1);
      inc(CurR);
      if CurR <= Rounds then
      begin
        ShowPurchase;
        SetNewRound;
      end
      else
      begin
        ShowEndStats;
        QuitGame := true; { End of all rounds }
      end;
    end;
    if not QuitGame then
    begin
      k := readkey;
      if PList[CurP].MaxPower > 0 then DrawCannon(CurP,Black);
      if k = '4' then begin PList[CurP].Angle := PList[CurP].Angle + pi/180; MakeSound(100,1); DrawInfo('Angle'); end;
      if k = '6' then begin PList[CurP].Angle := PList[CurP].Angle - pi/180; MakeSound(100,1); DrawInfo('Angle'); end;
      if k = #75 then begin PList[CurP].Angle := PList[CurP].Angle + pi/45; MakeSound(200,1); DrawInfo('Angle'); end;
      if k = #77 then begin PList[CurP].Angle := PList[CurP].Angle - pi/45; MakeSound(200,1); DrawInfo('Angle'); end;
      if k = '8' then begin inc(PList[CurP].Power); MakeSound(300,1); DrawInfo('Power'); end;
      if k = '2' then begin dec(PList[CurP].Power); MakeSound(300,1); DrawInfo('Power'); end;
      if k = #72 then begin inc(PList[CurP].Power,25); MakeSound(400,1); DrawInfo('Power'); end;
      if k = #80 then begin dec(PList[CurP].Power,25); MakeSound(400,1); DrawInfo('Power'); end;
      if k = #71 then begin PList[CurP].Power := PList[CurP].MaxPower; DrawInfo('Power'); end;
      if k = #79 then begin PList[CurP].Power := 0; DrawInfo('Power'); end;
      if k =  #9 then begin MakeSound(150,4); DrawWepList; end;
      if k = #73 then
      begin
        MakeSound(400,2);
        if WeaponList[CurWT].Class = Guiding then DrawInfo('NotGuidiance');
        if PList[CurP].CurW-1 < 1 then
          PList[CurP].CurW := PList[CurP].MaxW
        else
          dec(PList[CurP].CurW);
        CurWT := PList[CurP].WeaponList[PList[CurP].CurW].WepType;
        DrawInfo('Weapon');
        if WeaponList[CurWT].Class = Guiding then DrawInfo('Guidiance');
      end;
      if k = #81 then
      begin
        MakeSound(400,2);
        if WeaponList[CurWT].Class = Guiding then DrawInfo('NotGuidiance');
        if PList[CurP].CurW+1 > PList[CurP].MaxW then
          PList[CurP].CurW := 1
        else
          inc(PList[CurP].CurW);
        CurWT := PList[CurP].WeaponList[PList[CurP].CurW].WepType;
        DrawInfo('Weapon');
        if WeaponList[CurWT].Class = Guiding then DrawInfo('Guidiance');
      end;
      if k = ' ' then if PList[CurP].WeaponList[PList[CurP].CurW].Ammo <> 0 then
      begin
        FireCannon;
        if LivePlayers > 1 then BlinkArrow(CurP);
        if PList[CurP].MaxPower < 0 then
        begin
          PList[CurP].MaxPower := 0;
          PList[CurP].Power := 0;
          DrawInfo('Power');
        end;
      end;
      if (k = 'p') and (not PBut) then
      begin
        DrawArrow(CurP,Black);
        DrawCannon(CurP,White);
        ChangePlayer;
        BlinkArrow(CurP);
      end;
      if k = #27 then ShowPause;
      if round(PList[CurP].Angle*(180/pi)) > 180 then begin PList[CurP].Angle := 0; DrawInfo('Angle'); end;
      if round(PList[CurP].Angle*(180/pi)) < 0 then begin PList[CurP].Angle := pi; DrawInfo('Angle'); end;
      if PList[CurP].Power > PList[CurP].MaxPower then begin PList[CurP].Power := PList[CurP].MaxPower; DrawInfo('Power'); end;
      if PList[CurP].Power < 0 then begin PList[CurP].Power := 0; DrawInfo('Power'); end;
      if PList[CurP].MaxPower > 0 then DrawCannon(CurP,White);
      k := #0;
    end;
  until QuitGame;
  FadeOut(1);
end;

end.