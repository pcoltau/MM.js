program Mortar;

uses crt,graph,Game,Global,Colors,ReadFile,Menu,About,Options,Img_Fade;

var Gd,Choice: integer;

function DetectReqFilesExists: boolean;
var itm,gfx,wep,typ,cfg,gpal,mpal,ok: boolean;
begin
  ok := true;
  gfx := FileExists('svga256.bgi');
  wep := FileExists('wep.etx');
  typ := FileExists('type.etx');
  itm := FileExists('item.etx');
  cfg := FileExists('mortar.cfg');
  gpal := FileExists('Gfx\game.pal');
  mpal := FileExists('Gfx\menu.pal');
  if (not gfx) or (not wep) or (not typ) or (not itm) or (not cfg) or (not gpal) or (not mpal) then
  begin
    writeln('failed.');
    ok := false;
  end;
  if not gfx then writeln('File not found: svga256.bgi');
  if not wep then writeln('File not found: wep.etx');
  if not typ then writeln('File not found: type.etx');
  if not itm then writeln('File not found: item.etx');
  if not cfg then writeln('File not found: mortar.cfg');
  if not gpal then writeln('File not found: Gfx\game.pal');
  if not mpal then writeln('File not found: Gfx\menu.pal');
  DetectReqFilesExists := ok;
end;

procedure CheckParam;
var line: string;
    m: integer;
begin
  if ParamCount = 1 then
  begin
    line := ParamStr(1);
    if copy(Line,1,2) = '-m' then
    begin
      m := ord(Line[3]);
      if (m > 48) and (m < 52) then Gm := m-47;
      if m = 52 then Gm := 6;
    end;
    if (line = '-h') or (line = '/h') or
       (line = '-?') or (line = '/?') then
    begin
      writeln('Having trouble with the graphics driver?');
      writeln('Try using another resolution:');
      writeln;
      writeln('use -m[1-4] to change resolution');
      writeln;
      writeln('1) 640x480');
      writeln('2) 800x600');
      writeln('3) 1024x768');
      writeln('4) 1280x1024');
      writeln;
      writeln('ex: Mortar.exe -m3');
      writeln;
      writeln('If you are having problems please take a look at readme.txt');
      writeln('If that does not help please e-mail:');
      writeln;
      writeln('pcoltau@hotmail.com  or  ironman_@worldonline.dk');
      writeln('ооооооооооооооооооо      ооооооооооооооооооооооо');
      writeln;
      writeln('Official website at: http://mortar.address.com');
      writeln;
      halt;
    end;
  end;
end;

procedure Setup;
var i,ErrCode: integer;
begin
  writeln('MORTAR MAYHEM v'+FloatToStr(Version,0,1));
  writeln('Use -h for help.');
  writeln;
  write('Detecting required files...');
  if not DetectReqFilesExists then
  begin
    writeln('Fatal error encountered.');
    halt;
  end
  else
    writeln('ok.');
  writeln('Reading and decrypting:');
  write('- weaponslist...');
  ReadWepFile;
  write('- typelist...');
  ReadTypeDesc;
  write('- itemlist...');
  ReadItems;
  write('Loading tank.cfg...');
  LoadCFG(Gm);
  write('Initializing graphics driver svga256.bgi at ');
  if Gm = 2 then writeln('640x480.');
  if Gm = 3 then writeln('800x600.');
  if Gm = 4 then writeln('1024x768.');
  if Gm = 6 then writeln('1280x1024.');
  Gd := InstallUserDriver('svga256', nil);
  InitGraph(Gd, Gm, '');
  ErrCode := GraphResult;
  if ErrCode = grNoInitGraph then writeln('Could not install graphics drivers.');
  if ErrCode = grNotDetected then writeln('Could not detect your graphics hardware.');
  if ErrCode = grFileNotFound then writeln('Could not find the graphicsfile (svga256.bgi).');
  if ErrCode = grInvalidDriver then writeln('Your graphics driver (svga256.bgi) is invalid.');
  if ErrCode = grNoLoadMem then writeln('There was not enough free memory to load the graphics driver.');

  { When debugging: }
{  Players := 4;
  Rounds := 15;
  WinCondit := 1;
  NoWind := true;
  Tracers := true;
  TraceColAsTank := true;
  SoundOn := true;
  FastShot := true;
  LandComplex := 50;
  LandSmooth := 8;}
end;

begin
  Version := 1.0;
  Gd := 0;
  CheckParam;
  Setup;
  Choice := 1;
  if FadingOn then delay(500);
  repeat
    ShowMenu(Choice);
    SetColor(White);
    if Choice = 1 then StartGame;
    if Choice = 2 then ShowOptions;
    if Choice = 3 then ShowAbout;
  until Choice = 4;
  FadeOut(1);
  closegraph;
  writeln('Thank you for playing Mortar Mayhem v'+floattostr(version,0,1));
  writeln('Official website: http://mortar.address.com');
end.