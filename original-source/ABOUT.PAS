unit About;

interface

procedure ShowAbout;

implementation

uses crt,graph,Drawing,MenuCols,Global,SPCX_New;

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

procedure ShowAbout;
var x1,y1,x2,y2: integer;
    P: Pointer;
    T: string;
begin
  x1 := GetMaxX div 2 - 150;
  y1 := GetMaxY div 2 - 70;
  x2 := x1 + 300;
  y2 := y1 + 140;
  if FileExists('Gfx\menuback.pcx') then
    Show_PCX('Gfx\menuback.pcx',x1,y1,x2-x1,y2-y1)
  else
  begin
    SetFillStyle(SolidFill,LightGray);
    bar(x1,y1,x2,y2);
  end;
  SetColor(BrightGray);
  Line(x1,y1,x2,y1);
  Line(x1,y1,x1,y2);
  SetColor(Gray);
  Line(x1,y2,x2,y2);
  Line(x2,y1,x2,y2);
  DrawFrame(x1+8,y1+8,x2-8,y2-8);
  SetColor(White);
  T := 'M O R T A R   M A Y H E M  v1.0';
  OutTextXY(GetMaxX div 2 - (TextWidth(T) div 2),y1+10,T);
  T := 'A game by';
  OutTextXY(GetMaxX div 2 - (TextWidth(T) div 2),y1+30,T);
  T := 'Pelle Coltau & Jens Juul Jacobsen';
  OutTextXY(GetMaxX div 2 - (TextWidth(T) div 2),y1+40,T);

  OutTextXY(x1+10,y1+60,'This game was coded in the long and');
  OutTextXY(x1+10,y1+70,'cold winter of 2001, with the words');
  OutTextXY(x1+10,y1+80,'still hanging in the air:');
  T := '"I can''t believe we coded this';
  OutTextXY(GetMaxX div 2 - (TextWidth(T) div 2),y1+100,T);
  T := ' with Turbo Pascal!"';
  OutTextXY(GetMaxX div 2 - (TextWidth(T) div 2),y1+110,T);
  readkey;
end;

end.