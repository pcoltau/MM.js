unit ReadFile;

interface

procedure ReadWepFile;
procedure ReadTypeDesc;
procedure LoadCFG(var Gm: integer);
procedure ReadItems;
procedure SaveCFG;

implementation

uses crt,Global;

var f: file of byte;
    txt: string;

function ReadEnkLine(si,x,y: integer;var factor,pr: integer): string;
{ si    : source filesize.
  x     : cursor pos x.
  y     : cursor pos y.
  factor: decrypt factor.
  pr    : progress.       }
var txt: string;
    ch: char;
    b: byte;
begin
  txt := '';
  ch := #0;
  while (not EOF(f)) and (ch <> #13) do
  begin
    read(f,b);
    inc(pr);
    gotoxy(x,y);
    write(round(100-((si-pr)/si)*100),'%');
    b := b - factor;
    if b < 0 then b := b + 255;
    ch := chr(b);
    if ch <> #13 then txt := txt + ch;
    factor := factor + 10;
    if factor = 60 then factor := 10;
  end;
  if not EOF(f) then
  begin
    read(f,b);
    inc(pr);
    gotoxy(x,y);
    write(round(100-((si-pr)/si)*100),'%');
    factor := factor + 10;
    if factor = 60 then factor := 10;
  end;
  ReadEnkLine := txt;
end;

function GetType(L: string): string;
var tmp: string;
    i: integer;
begin
  i := 1;
  tmp := '';
  while (i < length(L)) and (L[i] <> '=') do
  begin
    tmp := tmp + L[i];
    inc(i);
  end;
  if i = length(L) then tmp := '';
  GetType := tmp;
end;

procedure ReadWepFile;
var i,Num,factor,pr,si,x,y: integer;
    error: boolean;

    procedure SortLine;
    var N,c: integer;
        tmp,T: string;
    begin
      val(txt,N,c);
      if c = 0 then
        Num := N
      else
      begin
        T := GetType(txt);
        if (T = '') or (Num < 1) then
          error := true
        else
        begin
          if T = 'cost' then  val(copy(txt,6,length(txt)),WeaponList[Num].Cost,c);
          if T = 'name' then
          begin
            WeaponList[Num].Name := copy(txt,6,length(txt));
            WeaponList[Num].LName := WeaponList[Num].Name;
          end;
          if T = 'lname' then    WeaponList[Num].LName := copy(txt,7,length(txt));
          if T = 'info1' then    WeaponList[Num].Info := copy(txt,7,length(txt));
          if T = 'height' then   val(copy(txt,8,length(txt)),WeaponList[Num].Height,c);
          if T = 'diameter' then val(copy(txt,10,length(txt)),WeaponList[Num].Diameter,c);
          if T = 'weight' then   val(copy(txt,8,length(txt)),WeaponList[Num].Weight,c);
          if T = 'img' then      WeaponList[Num].Img := 'Gfx\'+copy(txt,5,length(txt));
          if T = 'dam' then      val(copy(txt,5,length(txt)),WeaponList[Num].Dam,c);
          if T = 'qua' then      val(copy(txt,5,length(txt)),WeaponList[Num].Qua,c);
          if T = 'shots' then    val(copy(txt,7,length(txt)),WeaponList[Num].Shots,c);
          if T = 'leaps' then    val(copy(txt,7,length(txt)),WeaponList[Num].Leaps,c);
          if T = 'class' then
          begin
            tmp := copy(txt,7,length(txt));
            if tmp = 'missile' then WeaponList[Num].Class := Missile;
            if tmp = 'roller' then WeaponList[Num].Class := Roller;
            if tmp = 'leap' then WeaponList[Num].Class := Leap;
            if tmp = 'nitro' then WeaponList[Num].Class := Nitro;
            if tmp = 'multishot' then WeaponList[Num].Class := MultiShot;
            if tmp = 'piercing' then WeaponList[Num].Class := Piercing;
            if tmp = 'guiding' then WeaponList[Num].Class := Guiding;
          end;
          if T = 'exponimp' then
          begin
            tmp := copy(txt,10,length(txt));
            if tmp = 'false' then WeaponList[Num].ExpOnImp := false;
            if tmp = 'true' then WeaponList[Num].ExpOnImp := true;
            Num := -1;
          end;
        end;
      end;
    end;

begin
  i := 0;
  Num := -1;
  error := false;
  Assign(f,'wep.etx');
  reset(f);
  factor := 10;
  si := FileSize(f);
  pr := 0;
  x := wherex;
  y := wherey;
  while (not EOF(f)) and (not error) do
  begin
    txt := ReadEnkLine(si,x,y,factor,pr);
    SortLine;
  end;
  close(f);
  if error then
  begin
    writeln;
    writeln('Error reading or decrypting file: wep.etx');
    halt;
  end
  else
  begin
    gotoxy(x,y);
    writeln('done.');
  end;
end;

procedure ReadTypeDesc;
var n,factor,pr,si,x,y: integer;
    freeline: string[1];

begin
  n := 1;
  assign(F,'type.etx');
  reset(F);
  factor := 10;
  si := FileSize(f);
  pr := 0;
  x := wherex;
  y := wherey;
  while not EOF(F) do
  begin
    TypeDesc[n].Header := ReadEnkLine(si,x,y,factor,pr);
    TypeDesc[n].Desc := ReadEnkLine(si,x,y,factor,pr);
    Freeline := ReadEnkLine(si,x,y,factor,pr);
{    ReadLn(F,WepType[n].Header);
    ReadLn(F,WepType[n].Desc);
    ReadLn(F,freeline);}
    inc(n);
  end;
  gotoxy(x,y);
  writeln('done.');
end;

procedure LoadCFG(var Gm: integer);
var f: text;
    txt: string;
    error: boolean;

    function GetBoolean(L: integer): boolean;
    var tmp: string;
        bool: boolean;
    begin
      tmp := copy(txt,L,length(txt));
      if tmp = 'false' then bool := false;
      if tmp = 'true' then bool := true;
      GetBoolean := bool;
    end;

    function GetInteger(L: integer): integer;
    var tmp: string;
        inte,c: integer;
    begin
      tmp := copy(txt,L,length(txt));
      val(tmp,inte,c);
      if c <> 0 then error := true else GetInteger := inte;
    end;

    procedure SortLine;
    var T: string;
    begin
      T := GetType(txt);
      if (T = '') then
        error := true
      else
      begin
        if T = 'NoWind' then NoWind := GetBoolean(length(T)+2);
        if T = 'FastShot' then FastShot := GetBoolean(length(T)+2);
        if T = 'Tracers' then Tracers := GetBoolean(length(T)+2);
        if T = 'TraceColAsTank' then TraceColAsTank := GetBoolean(length(T)+2);
        if T = 'SoundOn' then SoundOn := GetBoolean(length(T)+2);
        if T = 'Players' then Players := GetInteger(length(T)+2);
        if T = 'Rounds' then Rounds := GetInteger(length(T)+2);
        if T = 'LandComplex' then LandComplex := GetInteger(length(T)+2);
        if T = 'LandSmooth' then LandSmooth := GetInteger(length(T)+2);
        if (T = 'Resolution') and (Gm = 0) then Gm := GetInteger(length(T)+2);
        if T = 'CommentDelay' then CommentDelay := GetInteger(length(T)+2);
        if T = 'StartOrder' then StartOrder := GetInteger(length(T)+2);
        if T = 'FStartOrder' then FRoundRandom := GetBoolean(length(T)+2);
        if T = 'Economy' then MonFac := GetInteger(length(T)+2);
        if T = 'WinCondit' then WinCondit := GetInteger(length(T)+2);
        if T = 'PBut' then PBut := GetBoolean(length(T)+2);
        if T = 'Fading' then FadingOn := GetBoolean(length(T)+2);
      end;
    end;

begin
  error := false;
  assign(F,'mortar.cfg');
  reset(F);
  while not EOF(F) do
  begin
    ReadLn(F,txt);
    SortLine;
  end;
  if error then
  begin
    writeln('failed.');
    writeln('Error reading file: tank.cfg');
    halt;
  end
  else
    writeln('done.');
end;

procedure ReadItems;
var i,Num,factor,pr,si,x,y: integer;
    error: boolean;

    procedure SortLine;
    var N,c: integer;
        tmp,T: string;
    begin
      val(txt,N,c);
      if c = 0 then
        Num := N
      else
      begin
        T := GetType(txt);
        if (T = '') or (Num < 1) then
          error := true
        else
        begin
          if T = 'cost' then  val(copy(txt,6,length(txt)),ItemList[Num].Cost,c);
          if T = 'name' then
          begin
            ItemList[Num].Name := copy(txt,6,length(txt));
            ItemList[Num].LName := ItemList[Num].Name;
          end;
          if T = 'lname' then ItemList[Num].LName := copy(txt,7,length(txt));
          if T = 'arm' then   val(copy(txt,5,length(txt)),ItemList[Num].Arm,c);
          if T = 'img' then   ItemList[Num].Img := 'Gfx\'+copy(txt,5,length(txt));
          if T = 'class' then
          begin
            tmp := copy(txt,7,length(txt));
            if tmp = 'armour' then ItemList[Num].Class := Armour;
            if tmp = 'shield' then ItemList[Num].Class := Shield;
            if tmp = 'parachute' then ItemList[Num].Class := Parachute;
            if tmp = 'repair' then ItemList[Num].Class := Repair;
          end;
          if T = 'info1' then
          begin
            ItemList[Num].Info := copy(txt,7,length(txt));
            Num := -1;
          end;
        end;
      end;
    end;

begin
  i := 0;
  Num := -1;
  error := false;
  Assign(f,'item.etx');
  reset(f);
  factor := 10;
  si := FileSize(f);
  pr := 0;
  x := wherex;
  y := wherey;
  while (not EOF(f)) and (not error) do
  begin
    txt := ReadEnkLine(si,x,y,factor,pr);
    SortLine;
  end;
  close(f);
  if error then
  begin
    writeln;
    writeln('Error reading or decrypting file: item.etx');
    halt;
  end
  else
  begin
    gotoxy(x,y);
    writeln('done.');
  end;
end;

procedure SaveCFG;
var F: text;

  function BoolToStr(B: boolean): string;
  begin
    if B then
      BoolToStr := 'true'
    else
      BoolToStr := 'false';
  end;

begin
  assign(F,'mortar.cfg');
  rewrite(F);
  writeln(F,'NoWind='+BoolToStr(NoWind));
  writeln(F,'FastShot='+BoolToStr(FastShot));
  writeln(F,'Tracers='+BoolToStr(Tracers));
  writeln(F,'TraceColAsTank='+BoolToStr(TraceColAsTank));
  writeln(F,'SoundOn='+BoolToStr(SoundOn));
  writeln(F,'Players='+IntToStr(Players));
  writeln(F,'Rounds='+IntToStr(Rounds));
  writeln(F,'LandComplex='+IntToStr(LandComplex));
  writeln(F,'LandSmooth='+IntToStr(LandSmooth));
  writeln(F,'Resolution='+IntToStr(Gm));
  writeln(F,'CommentDelay='+IntToStr(CommentDelay));
  writeln(F,'StartOrder='+IntToStr(StartOrder));
  writeln(F,'FStartOrder='+BoolToStr(FRoundRandom));
  writeln(F,'Economy='+IntToStr(MonFac));
  writeln(F,'WinCondit='+IntToStr(WinCondit));
  writeln(F,'PBut='+BoolToStr(PBut));
  writeln(F,'Fading='+BoolToStr(FadingOn));
  close(F);
end;

end.