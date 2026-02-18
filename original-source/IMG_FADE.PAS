unit img_fade;

interface

uses Global;

type ColorType = record
       Red,Green,Blue:byte;
     end;

procedure FadeOut(Speed: integer);
procedure FadeIn(Speed: integer;SMemPal: array of SignedColorType);
procedure SetDarkPal(var SMemPal: array of SignedColorType);
procedure SetPalette(ColorNumber: byte;AColor: ColorType);
procedure GetPalette(ColorNumber: byte;var TheColor:ColorType);

implementation

uses crt;

procedure SetPalette(ColorNumber: byte;AColor: ColorType);
begin
  asm
    mov dx,3c8h
    mov al,[ColorNumber]
    out dx,al
    inc dx
    mov al,[AColor.Red]
    out dx,al
    mov al,[AColor.Green]
    out dx,al
    mov al,[AColor.Blue]
    out dx,al
  end;
end;

procedure GetPalette(ColorNumber:byte;var TheColor:ColorType);
var Rt,Gt,Bt:byte;
begin
  Rt := TheColor.Red;
  Gt := TheColor.Green;
  Bt := TheColor.Blue;
  asm
    mov   dx, 3c7h
    mov   al, [ColorNumber]
    out   dx, al
    inc   dx
    inc   dx
    in    al, dx
    mov   [Rt],al
    in    al, dx
    mov   [Gt],al
    in    al, dx
    mov   [Bt],al
  end;
  TheColor.Red := Rt;
  TheColor.Green := Gt;
  TheColor.Blue := Bt;
end;

procedure FadeOut(Speed: integer);
var HaveChangedSomething: boolean;
    CurrentColor: ColorType;
    x,Counter: integer;
begin
  if FadingOn then
  begin
    HaveChangedSomething := true;
    while HaveChangedSomething do
    begin
      delay(Speed*3);
      HaveChangedSomething := false;
      for x := 0 to 255 do
      begin
        GetPalette(x,CurrentColor);
        if CurrentColor.Red <> 0 then
        begin
          dec(CurrentColor.Red);
          HaveChangedSomething := true;
        end;
        if CurrentColor.Green <> 0 then
        begin
          dec(CurrentColor.Green);
          HaveChangedSomething := true;
        end;
        if CurrentColor.Blue <> 0 then
        begin
          dec(CurrentColor.Blue);
          HaveChangedSomething := true;
        end;
        SetPalette(x,CurrentColor);
      end;
    end;
  end;
end;

procedure FadeIn(Speed: integer;SMemPal: array of SignedColorType);
var i,j: integer;
    MemPal: array[0..255] of ColorType;
    Col: ColorType;
begin
  if FadingOn then
    for i := 1 to 63 do
    begin
      Delay(Speed*4);
      for j := 0 to 255 do
      begin
        inc(SMemPal[j].Red);
        inc(SMemPal[j].Green);
        inc(SMemPal[j].Blue);
        if SMemPal[j].Red < 0 then
          Col.Red := 0
        else
          Col.Red := SMemPal[j].Red;
        if SMemPal[j].Green < 0 then
          Col.Green := 0
        else
          Col.Green := SMemPal[j].Green;
        if SMemPal[j].Blue < 0 then
          Col.Blue := 0
        else
          Col.Blue := SMemPal[j].Blue;
        SetPalette(j,Col);
      end;
    end;
end;

procedure SetDarkPal(var SMemPal: array of SignedColorType);
var i: integer;
    MemPal: array[0..255] of ColorType;
    Col: ColorType;
begin
  if FadingOn then
  begin
    Col.Red := 0;
    Col.Green := 0;
    Col.Blue := 0;
    for i := 0 to 255 do
    begin
      GetPalette(i,MemPal[i]);
      SMemPal[i].Red := MemPal[i].Red-63;
      SMemPal[i].Green := MemPal[i].Green-63;
      SMemPal[i].Blue := MemPal[i].Blue-63;
      SetPalette(i,Col);
    end;
  end;
end;

end.