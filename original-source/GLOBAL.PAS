unit Global;

interface

type PlayerWeapon = record
       Ammo: integer;
       WepType: integer;
     end;

     WepClass  = (Missile,Roller,Leap,Nitro,MultiShot,Piercing,Guiding);
     ItemClass = (Armour,Shield,Parachute,Repair);

     WeaponListType = record
       Cost: integer;
       Name: string[20];
       LName: string[40];
       Info: string;
       Height,Diameter,Weight: integer;
       img: string[16];
       Dam: integer;
       Qua: byte;
       Shots,Leaps,Jumps: integer;
       Class: WepClass;
       ExpOnImp: boolean;
     end;

     ItemType = record
       Cost: integer;
       Name: string[20];
       LName: string[32];
       Info: string;
       Arm: integer;
       img: string[16];
       Class: ItemClass;
     end;

     StatType = record
       Shots: integer;
       HShots: integer;
       Misses: integer;
       Damage: longint;
       Kills: integer;
       Place: byte;
       Points: integer;
       Profit: longint;
     end;

     ArmType = (NoArmour,Light,Medium,Heavy,Titanium);

     PlayerType = record
       Name: string[18];
       Power: integer;
       MaxPower: integer;
       Armour: integer;
       Para: byte;
       Shield: boolean;
       Angle: real;
       PosX,PosY: integer;
       Color: word;
       SecColor: word;
       WeaponList: array[1..42] of PlayerWeapon;
       Armourment: ArmType;
       CurW: integer;
       MaxW: integer;
       Stats: array[1..2] of StatType;
     end;

     DescType = record
       Header: string[30];
       Desc: string;
     end;

     SignedColorType = record
       Red,Green,Blue: integer;
     end;

var LandTop: array[1..1281] of integer;
    PList: array[1..8] of PlayerType;
    WeaponList: array[1..42] of WeaponListType;
    ItemList: array[1..7] of ItemType;
    TypeDesc: array[1..15] of DescType;
    MonFac,StartOrder,Players,CurP,Wind,CurWT,Rounds,CurR,LandComplex,LandSmooth,CommentDelay,WinCondit,Gm: integer;
    DirtColor,DirtColor2: word;
    LivePlayers: byte;
    Version: single;
    FadingOn,PBut,FRoundRandom,NoWind,FastShot,QuitGame,Quit,Tracers,TraceColAsTank,SoundOn: Boolean;
    k: char;
    Hs: integer;
    hole: array[2..1280] of boolean;
    SMemPal: array[0..255] of SignedColorType;

procedure ClearKeys;
procedure MakeSound(Hz,M: integer);
function IntToStr(I: Longint): String;
function FloatToStr(I: Real;W,D: integer): String;
function FileExists(filename: string): boolean;
function MakeSpaces(Str: string;C: integer): string;
function CalcHeadShot: integer;

implementation

uses crt,dos,graph;

procedure ClearKeys;
begin
 if keypressed then
 begin
   k := readkey;
   k := #0;
 end;
end;

procedure MakeSound(Hz,M: integer);
begin
  if SoundOn then
  begin
    Sound(Hz);
    Delay(M);
    NoSound;
  end;
end;

function IntToStr(I: Longint): String;
{ Converting of any integer type to a string }
var S: string[11];
begin
 Str(I, S);
 IntToStr := S;
end;

function FloatToStr(I: Real;W,D: integer): String;
{ Converting of any real type to a string }
var S: string[11];
begin
 Str(I:W:D, S);
 FloatToStr := S;
end;

function FileExists(filename: string): boolean;
{ Checking of the existence of a file }
var s: string;
    found: boolean;
begin
  s := fsearch(filename,'.');
  if s = '' then found := false else found := true;
  FileExists := found;
end;

function MakeSpaces(Str: string;C: integer): string;
var R: string;
begin
  R := Str;
  while Length(R) < C do
    R := ' ' + R;
  MakeSpaces := R;
end;

function CalcHeadShot: integer;
begin
  CalcHeadShot := 1000+WeaponList[CurWT].Dam*10;
end;

end.