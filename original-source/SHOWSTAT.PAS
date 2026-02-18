unit ShowStat;

interface

procedure ShowStats;

implementation

uses crt,graph,Global,SPCX_New,Colors,Drawing;

type PlayerArray = array[1..8] of PlayerType;

var OverAllList: array[1..8] of integer;
    RoundList: array[1..8] of integer;
    RankList: array[1..2,1..8] of integer;
    AnimBars: boolean;

procedure DrawNames(x1,y1,x2,y2,stats: integer);
var Pl: PlayerType;
    i,P: integer;
begin
  SetFillStyle(SolidFill,DarkGray);
  for i := 1 to 8 do
    Bar(x1+11,y1+20+20*i,x2-11,y1+32+20*i);
  for P := 1 to Players do
  begin
    if stats = 1 then Pl := PList[RoundList[P]] else Pl := PList[OverAllList[P]];
    SetColor(Black);
{    OutTextXY(x1+24,y1+24+20*P,inttostr(P)+'.');}
    OutTextXY(x1+57,y1+24+20*P,Pl.Name);
    SetColor(White);
{    OutTextXY(x1+23,y1+23+20*P,inttostr(P)+'.');}
    SetColor(Pl.Color);
    OutTextXY(x1+56,y1+23+20*P,Pl.Name);
  end;
end;

procedure DrawRankNum(x1,y1,stats:integer);
var i: integer;
begin
  for i := 1 to Players do
  begin
    SetColor(Black);
    OutTextXY(x1+24,y1+24+20*i,inttostr(RankList[stats,i])+'.');
    SetColor(White);
    OutTextXY(x1+23,y1+23+20*i,inttostr(RankList[stats,i])+'.');
  end;
end;

procedure DrawStats(x1,y1,x2,y2,stats: integer);
var i : integer;

  procedure DrawPStat(P : integer);
  var str: string;
      Pl: PlayerType;
      miss,hits: integer;
  begin
    HS := 0;
    if stats = 1 then Pl := PList[RoundList[P]] else Pl := PList[OverAllList[P]];
    if Pl.Stats[stats].Shots = 0 then
    begin
      miss := 0;
      hits := 0;
    end
    else
    begin
      miss := round(Pl.Stats[stats].Misses/Pl.Stats[stats].Shots*100);
      hits := round((Pl.Stats[stats].Shots-Pl.Stats[stats].Misses)/Pl.Stats[stats].Shots*100);
    end;
    str := MakeSpaces(inttostr(Pl.Stats[stats].Points),3)+'  '+
           MakeSpaces('$'+inttostr(Pl.Stats[stats].Profit),9)+'  '+
           MakeSpaces(inttostr(Pl.Stats[stats].Shots),5)+'  '+
           MakeSpaces(inttostr(hits),4)+'% '+
           MakeSpaces(inttostr(miss),5)+'% '+
           MakeSpaces(inttostr(Pl.Stats[stats].Kills),5);
    SetColor(Black);
    OutTextXY(x1+254,y1+24+20*P,str);
    SetColor(White);
    OutTextXY(x1+253,y1+23+20*P,str);
  end;

begin
  SetFillStyle(SolidFill,DarkBlue);
  Bar(x1+11,y1+21,x2-11,y1+33);
  SetColor(White);
  if stats = 1 then
    OutTextXY(x1+13,y1+24,'Rank                         Points   Income   Shots  Hits  Misses  Frags')
  else
    OutTextXY(x1+13,y1+24,'Rank                         Points   Balance  Shots  Hits  Misses  Frags');
  OutTextXY(x1+56,y1+24,'Name');
  DrawNames(x1,y1,x2,y2,stats);
  DrawRankNum(x1,y1,stats);
  for i := 1 to Players do DrawPStat(i);
end;

procedure DrawSecStats(x1,y1,x2,y2,stats: integer);
var i,j: integer;
    Pl: PlayerType;
    TotalPDam: array[1..8] of longint;
    TotalDam,MaxPDam: longint;

  procedure DrawPStat(P : integer);
  var i,Fa: integer;
      DamPerSH: string;

    procedure DrawDamBar(L: integer);
    begin
      SetFillStyle(SolidFill,Pl.Color);
      bar(x1+207,y1+24+20*P,x1+207+L,y1+29+20*P);
      SetColor(BrightGray);
      Line(x1+207,y1+24+20*P,x1+207+L,y1+24+20*P);
      SetColor(Pl.SecColor);
      Line(x1+207,y1+29+20*P,x1+207+L,y1+29+20*P);
      Line(x1+207+L,y1+24+20*P,x1+207+L,y1+29+20*P);
    end;

    procedure DrawPer(L: integer;C: word);
    var N: integer;
    begin
      SetColor(C);
      if MaxPDam = 0 then N := 0 else
        N := round(((L*MaxPDam)/1.26)/TotalDam);
      OutTextXY(x1+214+L,y1+23+20*P,inttostr(N)+'%');
    end;

  begin
    if stats = 1 then Pl := PList[RoundList[P]] else Pl := PList[OverAllList[P]];
    if (MaxPDam = 0) then
    begin
      TotalPDam[P] := 0;
      TotalDam := 0;
      Fa := 0;
    end else
      Fa := round((TotalPDam[P]/MaxPDam)*126);
    if not AnimBars then
    begin
      for i := 0 to Fa do
      begin
        DrawPer(i,White);
        DrawDamBar(i);
        delay(1);
        DrawPer(i,DarkGray);
      end;
    end
    else
      DrawDamBar(Fa);
    DrawPer(Fa,White);
    if Pl.Stats[stats].Shots = 0 then DamPerSH := '   0.00' else
      DamPerSH := MakeSpaces(floattostr(TotalPDam[P]/Pl.Stats[stats].Shots,6,2),7);
    OutTextXY(x1+380,y1+23+20*P,MakeSpaces(inttostr(TotalPDam[P]),6));
    OutTextXY(x1+452,y1+23+20*P,DamPerSh);
    OutTextXY(x1+532,y1+23+20*P,MakeSpaces(inttostr(Pl.Stats[stats].HShots),6));
  end;

begin
  TotalDam := 0;
  MaxPDam := 0;
  for i := 1 to Players do
  begin
    if stats = 1 then Pl := PList[RoundList[i]] else Pl := PList[OverAllList[i]];
    TotalPDam[i] := Pl.Stats[stats].Damage;
    TotalDam := TotalDam + TotalPDam[i];
    if MaxPDam < TotalPDam[i] then MaxPDam := TotalPDam[i];
  end;
  SetFillStyle(SolidFill,DarkBlue);
  Bar(x1+11,y1+21,x2-11,y1+33);
  SetColor(White);
  OutTextXY(x1+13,y1+24,'Rank                    Dam. given (of total)  Damage  Dam/shot  Headshots');
  OutTextXY(x1+56,y1+24,'Name');
  DrawNames(x1,y1,x2,y2,stats);
  DrawRankNum(x1,y1,stats);
  for i := 1 to Players do DrawPStat(i);
end;

procedure ShowStats;
var i,j: integer;
    xa,ya,xb,yb: array[1..2] of integer;
    t: string;
    ColorTable: array[1..16] of word;

  procedure CalcStats;
  var i,j: integer;

  begin
    for i := 1 to Players do
    with PList[i] do
    begin
      Stats[2].Shots := Stats[2].Shots + Stats[1].Shots;
      Stats[2].HShots := Stats[2].HShots + Stats[1].HShots;
      Stats[2].Misses := Stats[2].Misses + Stats[1].Misses;
      Stats[2].Damage := Stats[2].Damage + Stats[1].Damage;
      Stats[2].Kills := Stats[2].Kills + Stats[1].Kills;
      Stats[2].Place := Stats[2].Place + Stats[1].Place;
{      Stats[1].Points := (Players-Stats[1].Place);
      Stats[2].Points := Stats[1].Points + Stats[2].Points;}
    end;
  end;

  procedure SortLists;
  type SortType = record
         Player: integer;
         Score,SecScore: real;
       end;

  var P,i,j,Po: integer;
      Done: boolean;
      PlaceScore,SecPlaceScore: array[1..8] of real;
      SortedList: array[1..9] of SortType;

      procedure SetPlace(Player,Place: integer);
      var i: integer;
      begin
        for i := Player downto Place do
          SortedList[i+1] := SortedList[i];
        SortedList[Place].Player := Player;
        SortedList[Place].Score := PlaceScore[Player];
        SortedList[Place].SecScore := SecPlaceScore[Player];
      end;

  begin
    for i := 1 to Players do
    with PList[i] do
    begin
      SortedList[i].Score := 0;
      Case WinCondit of
        1: PlaceScore[i] := Players-Stats[1].Place+1;
        2: if Stats[1].Shots = 0 then
             PlaceScore[i] := 0
           else
             PlaceScore[i] := (Stats[1].Shots-Stats[1].Misses)/Stats[1].Shots;
        3: PlaceScore[i] := Stats[1].Kills;
        4: PlaceScore[i] := Stats[1].Damage;
        5: if Stats[1].Shots = 0 then
             PlaceScore[i] := 0
           else
             PlaceScore[i] := Stats[1].Damage/Stats[1].Shots;
        6: PlaceScore[i] := Stats[1].HShots;
      end;
      P := 1;
      Done := false;
      while not Done do
        if PlaceScore[i] < SortedList[P].Score then inc(P) else Done := true;
      SetPlace(i,P);
    end;
    Po := 0;
    for i := Players downto 1 do
    begin
      RoundList[i] := SortedList[i].Player;
      if SortedList[i].Score <> SortedList[i+1].Score then
        Po := Players-i;
      PList[SortedList[i].Player].Stats[1].Points := Po;
    end;
    Po := 1;
    for i := 1 to Players do
    begin
      PList[i].Stats[2].Points := PList[i].Stats[2].Points + PList[i].Stats[1].Points;
      if SortedList[i].Score <> SortedList[i-1].Score then
        Po := i;
      RankList[1,i] := Po;
    end;

    for i := 1 to Players do
    with PList[i] do
    begin
      SortedList[i].Score := 0;
      SortedList[i].SecScore := 0;
      PlaceScore[i] := Stats[2].Points;
      Case WinCondit of
        1: SecPlaceScore[i] := Stats[2].Points;
        2: if Stats[2].Shots = 0 then
             SecPlaceScore[i] := 0
           else
             SecPlaceScore[i] := (Stats[2].Shots-Stats[2].Misses)/Stats[2].Shots;
        3: SecPlaceScore[i] := Stats[2].Kills;
        4: SecPlaceScore[i] := Stats[2].Damage;
        5: if Stats[2].Shots = 0 then
             SecPlaceScore[i] := 0
           else
             SecPlaceScore[i] := Stats[2].Damage/Stats[2].Shots;
        6: SecPlaceScore[i] := Stats[2].HShots;
      end;
      P := 1;
      Done := false;
      while not Done do
      begin
        if PlaceScore[i] < SortedList[P].Score then inc(P) else Done := true;
        if PlaceScore[i] = SortedList[P].Score then
            if SecPlaceScore[i] < SortedList[P].SecScore then inc(P) else Done := true;
      end;
      SetPlace(i,P);
    end;
    Po := 1;
    for i := 1 to Players do
    begin
      OverAllList[i] := SortedList[i].Player;
      if SortedList[i].SecScore <> SortedList[i-1].SecScore then
        Po := i;
      RankList[2,i] := Po;
    end;
  end;

  procedure DrawText(i,y1: integer);
  var x1,x2,y2: integer;
      str: string;
  begin
    x1 := GetMaxX div 2 - 250;
    y1 := y1 + 4;
    x2 := x1 + 500;
    y2 := y1 + 16;
    SetFillStyle(SolidFill,DarkGray);
    bar(x1+2,y1+2,x2+2,y2+2);
    DrawBox(x1,y1,x2,y2);
    if i = 1 then
      str := 'Press space for next statistics or ESC to continue game.'
    else
      str := 'Press space for previous statistics or ESC to continue game.';
    SetColor(DarkGray);
    OutTextXY(GetMaxX div 2 - (TextWidth(str) div 2),y1+4,str);
  end;

  procedure CalcIncome;
  var i,Fact: integer;
  begin
    for i := 1 to Players do
    begin
      case Players-PList[i].Stats[1].Points of
        1: PList[i].Stats[1].Profit := 3000;
        2: PList[i].Stats[1].Profit := 2500;
        3: PList[i].Stats[1].Profit := 2000;
        4: PList[i].Stats[1].Profit := 1750;
        5: PList[i].Stats[1].Profit := 1500;
        6: PList[i].Stats[1].Profit := 1200;
        7: PList[i].Stats[1].Profit := 1000;
        8: PList[i].Stats[1].Profit := 800;
      end;
      PList[i].Stats[1].Profit := PList[i].Stats[1].Profit + 300*PList[i].Stats[1].HShots;
      PList[i].Stats[1].Profit := PList[i].Stats[1].Profit + 500*PList[i].Stats[1].Kills;
      PList[i].Stats[1].Profit := PList[i].Stats[1].Profit + round(PList[i].Stats[1].Damage/(Players*2));
      Fact := MonFac;
      if MonFac = 3 then Fact := 4;
      if MonFac = 4 then Fact := 8;
      PList[i].Stats[1].Profit := (PList[i].Stats[1].Profit*Fact) div 2;
      PList[i].Stats[2].Profit := PList[i].Stats[2].Profit + PList[i].Stats[1].Profit;
    end;
  end;

  procedure SetStartOrder;
  var i,N,M: integer;
      PMem: PlayerType;
      NewPList: PlayerArray;
  begin
    randomize;
    case StartOrder of
      { Losers First }
      1: begin
           for i := 1 to Players do
             NewPList[i] := PList[RoundList[Players-i+1]];
           for i := 1 to Players do
             PList[i] := NewPList[i];
         end;
      { Winners First }
      2: begin
           for i := 1 to Players do
             NewPList[i] := PList[RoundList[i]];
           for i := 1 to Players do
             PList[i] := NewPList[i];
         end;
      { Random First }
      3: for i := 1 to Players do
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
  end;

begin
  for i := 1 to 100 do
    ClearKeys;
  ColorTable[1]  := Blue;
  ColorTable[2]  := LightRed;
  ColorTable[3]  := Green;
  ColorTable[4]  := Yellow;
  ColorTable[5]  := Magenta;
  ColorTable[6]  := Cyan;
  ColorTable[7]  := White;
  ColorTable[8]  := LightGray;
  CalcStats;
  SortLists;
  CalcIncome;
  xa[1] := GetMaxX div 2 - 312;
  ya[1] := GetMaxY div 2 - 216;
  xa[2] := xa[1] + 624;
  ya[2] := ya[1] + 210;
  xb[1] := GetMaxX div 2 - 312;
  yb[1] := GetMaxY div 2 + 6;
  xb[2] := xb[1] + 624;
  yb[2] := yb[1] + 210;
  DrawBox(xa[1],ya[1],xa[2],ya[2]);
  DrawBox(xb[1],yb[1],xb[2],yb[2]);
  SetColor(DarkGray);
  Line(xa[1]+2,ya[2]+1,xa[2]+2,ya[2]+1); Line(xa[1]+2,ya[2]+2,xa[2]+2,ya[2]+2);
  Line(xa[2]+1,ya[1]+2,xa[2]+1,ya[2]+2); Line(xa[2]+2,ya[1]+2,xa[2]+2,ya[2]+2);
  Line(xb[1]+2,yb[2]+1,xb[2]+2,yb[2]+1); Line(xb[1]+2,yb[2]+2,xb[2]+2,yb[2]+2);
  Line(xb[2]+1,yb[1]+2,xb[2]+1,yb[2]+2); Line(xb[2]+2,yb[1]+2,xb[2]+2,yb[2]+2);
  DrawFrame(xa[1]+10,ya[1]+20,xa[2]-10,ya[2]-10);
  DrawFrame(xb[1]+10,yb[1]+20,xb[2]-10,yb[2]-10);
  SetColor(DarkGray);
  t := 'S T A T I S T I C S   F O R   R O U N D   '+inttostr(CurR);
  OutTextXY((GetMaxX div 2)-(TextWidth(t) div 2),ya[1]+6,t);
  t := 'O V E R A L L   S T A T I S T I C S';
  OutTextXY((GetMaxX div 2)-(TextWidth(t) div 2),yb[1]+6,t);
  AnimBars := false;
  repeat
    DrawStats(xa[1],ya[1],xa[2],ya[2],1);
    DrawStats(xb[1],yb[1],xb[2],yb[2],2);
    DrawText(1,yb[2]);
    repeat
      k := readkey;
    until (k = #27) or (k = ' ');
    if k <> #27 then
    begin
      DrawSecStats(xa[1],ya[1],xa[2],ya[2],1);
      DrawSecStats(xb[1],yb[1],xb[2],yb[2],2);
      AnimBars := true;
      DrawText(2,yb[2]);
      repeat
        k := readkey;
      until (k = #27) or (k = ' ');
    end;
  until k = #27;
  SetStartOrder;
end;

end.