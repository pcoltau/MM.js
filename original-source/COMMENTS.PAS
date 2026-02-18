unit Comments;

interface

procedure DrawComment(L1,L2,H: integer;P: integer;C: word);

implementation

uses graph,Global,Colors;

procedure DrawComment(L1,L2,H: integer;P: integer;C: word);
var tmp,person,str1,str2: string;
    StartP: integer;

  procedure WritePlayer(N: string;P: integer;C: word);
  begin
    if (C <> Gray) and (C <> DarkMagenta) and (C <> DarkGreen) and
       (C <> DarkBrown) and (C <> Blue) and (C <> Red) and (C <> Magenta) then
      SetColor(Gray)
    else
      SetColor(Black);
    OutTextXY(P+1,25,N);
    SetColor(C);
    OutTextXY(P,24,N);
  end;

  procedure MakeBox(P: integer);
  begin
    SetFillStyle(SolidFill,DarkGray);
    bar(StartP-8,22,GetMaxX-StartP,34);
    SetColor(Gray);
    Rectangle(StartP-8,22,GetMaxX-StartP,34)
  end;

  function GetRanCom: string;
  var r: integer;
  begin
    r := random(15);
    if r =  0 then GetRanCom := ' badly.';
    if r =  1 then GetRanCom := ' to pieces.';
    if r =  2 then GetRanCom := ' as oil starts to flow.';
    if r =  3 then GetRanCom := ' removing tons of metal.';
    if r =  4 then GetRanCom := ' making it unreconizable.';
    if r =  5 then GetRanCom := ' like a silly bug.';
    if r =  6 then GetRanCom := ' making sparks fly.';
    if r =  7 then GetRanCom := ' shattering delicate machinery.';
    if r =  8 then GetRanCom := ' crumbling the bodywork.';
    if r =  9 then GetRanCom := ' almost tipping it over.';
    if r = 10 then GetRanCom := ' messing up its paintjob.';
    if r = 11 then GetRanCom := ' wrecking its camouflage.';
    if r = 12 then GetRanCom := ' almost breaking its cannon.';
    if r = 13 then GetRanCom := ' making it really pissed off.';
    if r = 14 then GetRanCom := ' fragments flying everywhere.';
  end;

begin
  str1 := '';
  str2 := '';
  if H <> 0 then HS := H;
  if L1 > 0 then
  begin
    if L1+L2 >  100 then begin str1 := 'scratched ';      str2 := '.'; end;
    if L1+L2 >  150 then begin str1 := 'bruised ';        str2 := '.'; end;
{    if L1+L2 >  175 then begin str1 := 'damaged ';        str2 := '.'; end;}
    if L1+L2 >  200 then begin str1 := 'injured ';        str2 := '.'; end;
    if L1+L2 >  250 then begin str1 := 'wounded ';        str2 := '.'; end;
{    if L1+L2 >  225 then begin str1 := 'flogged ';        str2 := '.'; end;}
    if L1+L2 >  300 then begin str1 := 'cracked ';        str2 := '.'; end;
{    if L1+L2 >  275 then begin str1 := 'crumbled ';       str2 := '.'; end;}
{    if L1+L2 >  300 then begin str1 := 'crushed ';        str2 := '.'; end;}
{    if L1+L2 >  325 then begin str1 := 'wrecked ';        str2 := '.'; end;}
    if L1+L2 >  400 then begin str1 := 'fractured ';      str2 := '.'; end;
    if L1+L2 >  450 then begin str1 := 'fractured ';      str2 := GetRanCom; end;
    if L1+L2 >  500 then begin str1 := 'shredded ';       str2 := '.'; end;
    if L1+L2 >  550 then begin str1 := 'shredded ';       str2 := GetRanCom; end;
    if L1+L2 >  600 then begin str1 := 'smashed ';        str2 := '.'; end;
    if L1+L2 >  700 then begin str1 := 'smashed ';        str2 := GetRanCom; end;
{    if L1+L2 >  650 then begin str1 := 'mutilated ';      str2 := '.'; end;
    if L1+L2 >  700 then begin str1 := 'mutilated ';      str2 := GetRanCom; end;}
    if L1+L2 >  800 then begin str1 := 'slaughtered ';    str2 := '.'; end;
    if L1+L2 >  900 then begin str1 := 'slaughtered ';    str2 := GetRanCom; end;
{    if L1+L2 >  850 then begin str1 := 'neutralized ';    str2 := '.'; end;
    if L1+L2 > 900 then begin str1 := 'neutralized ';    str2 := GetRanCom; end;}
    if L1+L2 > 1000 then begin str1 := 'butchered ';      str2 := '.'; end;
    if L1+L2 > 1100 then begin str1 := 'butchered ';      str2 := GetRanCom; end;
    if L1+L2 > 1200 then begin str1 := 'massacred ';      str2 := '.'; end;
    if L1+L2 > 1300 then begin str1 := 'massacred ';      str2 := GetRanCom; end;
    if L1+L2 > 1400 then begin str1 := 'obliterated ';    str2 := '.'; end;
    if L1+L2 > 1500 then begin str1 := 'obliterated ';    str2 := GetRanCom; end;
{    if L1+L2 > 1250 then begin str1 := 'demolished ';     str2 := '.'; end;
    if L1+L2 > 1300 then begin str1 := 'demolished ';     str2 := GetRanCom; end;
    if L1+L2 > 1350 then begin str1 := 'exterminated ';   str2 := '.'; end;
    if L1+L2 > 1400 then begin str1 := 'exterminated ';   str2 := GetRanCom; end;
    if L1+L2 > 1450 then begin str1 := 'abolished ';      str2 := '.'; end;
    if L1+L2 > 1500 then begin str1 := 'abolished ';      str2 := GetRanCom; end;
    if L1+L2 > 1550 then begin str1 := 'annulled ';       str2 := '.'; end;
    if L1+L2 > 1600 then begin str1 := 'annulled ';       str2 := GetRanCom; end;}
    if L1+L2 > 1600 then begin str1 := 'annihilated ';    str2 := '.'; end;
    if L1+L2 > 1700 then begin str1 := 'annihilated ';    str2 := GetRanCom; end;
{    if L1+L2 > 1750 then begin str1 := 'disintegrated ';  str2 := '.'; end;
    if L1+L2 > 1800 then begin str1 := 'disintegrated ';  str2 := GetRanCom; end;
    if L1+L2 > 1850 then begin str1 := 'nullified ';      str2 := '.'; end;
    if L1+L2 > 1900 then begin str1 := 'nullified ';      str2 := GetRanCom; end;}
    if L1+L2 > 1800 then begin str1 := 'atomized ';       str2 := '.'; end;
    if L1+L2 > 1900 then begin str1 := 'atomized ';       str2 := GetRanCom; end;
    if L1+L2 > 2000 then begin str1 := 'vaporized ';      str2 := '.'; end;
    if L1+L2 > 2250 then begin str1 := 'vaporized ';      str2 := ' into dust.'; end;
    if L1+L2 > 2500 then begin str1 := 'vaporized ';      str2 := ' into oblivion.'; end;
    if L1+L2 > 3000 then begin str1 := 'vaporized ';      str2 := ' into pure nothing.'; end;
    if L1+L2 <= 100 then begin str1 := 'dented ';         str2 := '.'; end;
    if L1+L2 <=  75 then begin str1 := 'almost scared ';  str2 := '.'; end;
    if L1+L2 <=  50 then begin str1 := 'barely touched '; str2 := '.'; end;
  end
  else
  begin
    if L2 <= 100 then begin str1 := 'made the dust collapse under '; str2 := '.'; end;
    if L2 <= 50 then begin str1 := 'made '; str2 := ' float gently like a feather.'; end;
    if L2 > 100 then begin str1 := 'made '; str2 := ' land hard.'; end;
    if L2 > 200 then begin str1 := 'made '; str2 := ' dive like a stone.'; end;
    if L2 > 300 then begin str1 := 'made '; str2 := ' stumble down the rocks.'; end;
    if L2 > 400 then begin str1 := 'made '; str2 := ' tumble down irretrievably.'; end;
    if L2 > 500 then begin str1 := 'made '; str2 := ' lunge towards hell.'; end;
    if L2 > 600 then begin str1 := 'made '; str2 := ' go supersonic.'; end;
    if L2 > 700 then begin str1 := 'made '; str2 := ' go warp 2.'; end;
    if L2 > 800 then begin str1 := 'made '; str2 := ' go warp 5.'; end;
    if L2 > 900 then begin str1 := 'made '; str2 := ' go warp 9.'; end;
    if L2 > 1000 then begin str1 := 'made '; str2 := ' plunge towards The Grim Reaper.'; end;
  end;
  if L1+L2 =  0 then str1 := '';
  if H <> 0 then inc(PList[CurP].Stats[1].HShots,H);
  if H = 1 then begin str1 := 'made a HEADSHOT on '; str2 := '.'; end;
  if H = 2 then begin str1 := 'made a double HEADSHOT on '; str2 := '.'; end;
  if H = 3 then begin str1 := 'made a triple HEADSHOT on '; str2 := '.'; end;
  if H = 4 then begin str1 := 'made a quadruple HEADSHOT on '; str2 := '.'; end;
  if H = 5 then begin str1 := 'made a quintuple HEADSHOT on '; str2 := '.'; end;
  if H >= 6 then begin str1 := 'made incomprehensible many HEADSHOT on '; str2 := '.'; end;
  if C <> Black then
  begin
    SetColor(White);
    if (P = CurP) and (PList[CurP].MaxPower < 1) then
    begin
      StartP := (GetMaxX div 2) - (length(PList[CurP].Name+' suicided!')*8 div 2);
      MakeBox(StartP);
      WritePlayer(PList[CurP].Name,StartP,PList[CurP].Color);
      SetColor(White);
      OutTextXY(StartP+length(PList[CurP].Name)*8,24,' suicided!')
    end
    else
    begin
      if P = CurP then Person := 'itself' else Person := PList[P].Name;
      StartP := (GetMaxX div 2)-(length(PList[CurP].Name+' '+Str1+Person+Str2)*8 div 2);
      MakeBox(StartP);
      WritePlayer(PList[CurP].Name,StartP,PList[CurP].Color);
      SetColor(White);
      OutTextXY(StartP+8+length(PList[CurP].Name)*8,24,str1);
      OutTextXY(StartP+8+length(PList[CurP].Name)*8+length(str1)*8+length(Person)*8,24,str2);
      WritePlayer(Person,StartP+8+length(PList[CurP].Name)*8+length(str1)*8,C);
    end;
  end;
end;



end.