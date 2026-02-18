{ Includes portions of SHOW_PCX. }
{ Used by permission of ZSoft Corporation. }

unit SPCX_New;

interface

procedure Show_PCX(pcxfile:string; xpos,ypos,xm,ym:integer);
{ shows a pcx picture at coord's X,Y }
procedure LoadPalette(palfile:string);
{ Loads a palette from a .pal file }


implementation

uses crt,graph,dos;

const
   MAX_WIDTH = 4000;    { arbitrary - maximum width (in bytes) of a PCX image }
   COMPRESS_NUM = $C0;  { this is the upper two bits that indicate a count }
   MAX_BLOCK = 4096;
   RED = 0;
   GREEN = 1;
   BLUE = 2;
type
   block_array = array [0..MAX_BLOCK] of byte;
   pal_array = array [0..255, RED..BLUE] of byte;
   line_array = array [0..MAX_WIDTH] of byte;
   pcx_header =
     record
       { See descriptions in SHOW_PCX.pas }
       Manufacturer,Version,Encoding,Bits_per_pixel: byte;
       Xmin,Ymin,Xmax,Ymax,Hdpi,Vdpi: integer;
       ColorMap: array [0..15, RED..BLUE] of byte;
       Reserved,Nplanes: byte;
       Bytes_per_line_per_plane,PaletteInfo,HscreenSize,VscreenSize: integer;
       Filler: array [74..127] of byte;
     end;
var
   Name: string;                       { Name of PCX file to load }
   ImageName: string;                  { Name of PCX file - used by ReadError }
   BlockFile: file;                    { file for reading block data }
   BlockData: block_array;             { 4k data buffer }
   Header: pcx_header;                 { PCX file header }
   Palette256: pal_array;              { place to put 256 color palette }
   PCXline: line_array;                { place to put uncompressed data }
   Ymax: integer;                      { maximum Y value on screen }
   NextByte: integer;                  { index into file buffer in ReadByte }
   Index: integer;                     { PCXline index - where to put Data }
   Data: byte;                         { PCX compressed data byte }
   Reg: Registers;                     { Register set - used for int 10 calls }


  procedure Error (s: string );
  { Print out the error message then halt }
  begin
    TextMode (C80);
    write ('PCX ERROR: ',s);
    halt;
  end;   { Error }


  procedure ReadError (msg: integer);
  { Check for an i/o error }
  begin
    if IOresult <> 0 then
      case msg of
        1: Error ('Can''t open file - ' + ImageName);
        2: Error ('Error closing file - ' + ImageName + ' - disk may be full');
        3: Error ('Error reading file - ' + ImageName);
      else
        Error ('Error doing file I/O - ' + ImageName);
      end;   { case }
  end;   { ReadError }


  procedure EntireVGApalette;
  { Set the VGA's entire 256 color palette. }
  var
    i: integer;
  begin
    for i := 0 to 255 do
      begin                                          { R, G, and B must be 0..63 }
        Palette256 [i, RED]   := Palette256 [i, RED]   shr 2;
        Palette256 [i, GREEN] := Palette256 [i, GREEN] shr 2;
        Palette256 [i, BLUE]  := Palette256 [i, BLUE]  shr 2;
      end;
    Reg.ah := $10;                       { Set DAC Call }
    Reg.al := $12;                       { set a block of DAC registers }
    Reg.bx := 0;                         { first DAC register number }
    Reg.cx := 255;                       { number of registers to update }
    Reg.dx := ofs (Palette256);          { offset of block }
    Reg.es := seg (Palette256);          { segment of block }
    intr ($10, Reg);                     { call interrupt }
  end;  { EntireVGApalette }


  procedure LoadPalette(palfile:string);
  { Loads a palette from a .pal file, saves it in 256 color /JJJ }
  var
    index, rgbcol: integer;
    f: file of byte;
    intensity : byte;
  begin
    assign(f, palfile);
    reset(f);
    readerror(1);
    seek(f, 24);
    { copy rgbi code to palette, except the intensity byte, which can't
      be used in the 256 color palette) }
    for index := 0 to 255 do
    begin
      for rgbcol := 0 to 2 do read(f, palette256[index,rgbcol]);
      read(f, intensity);
    end;
    readerror(3);
    close(f);
    readerror(2);
    EntireVGApalette;
  end; { LoadPalette }


  procedure Read256palette;
  { Read in a 256 color palette at end of PCX file }
  var
    i: integer;
    b: byte;
  begin
    seek (BlockFile, FileSize (BlockFile) - 3*256-1);
    BlockRead (BlockFile, b, 1);           { read indicator byte }
    ReadError (3);

    if b <> 12 then exit;                  { no palette here... }

    BlockRead (BlockFile, Palette256, 3*256);
    ReadError (3);
    seek (BlockFile, 128);                 { go back to start of PCX data }
  end;  { Read256palette }


  procedure ReadHeader;
  { Load a picture header from a PC Paintbrush PCX file }
  label
    WrongFormat;
  begin
  {$I-}
    BlockRead (BlockFile, Header, 128);         { read 128 byte PCX header }
    ReadError (3);

    if (Header.Manufacturer <> 10) or (Header.Encoding <> 1) then
    begin
      close (BlockFile);
      Error ('Invalid PCX image file - '+imagename);
    end;

    if (Header.Nplanes = 1) then
      begin
        Ymax := 399;
        if (Header.Bits_per_pixel = 8) and (Header.Version = 5) then
          Read256palette
        else
          goto wrongformat;
      end
    else
      begin
WrongFormat:
        close (BlockFile);
        Error ('Invalid PCX file format - '+imagename);
      end;
    Index := 0;
    NextByte := MAX_BLOCK;          { indicates no data read in yet... }
  end;  { ReadHeader }


  procedure ReadByte;
  { read a single byte of data - use BlockRead because it is FAST! }
  var
    NumBlocksRead: integer;
  begin
    if NextByte = MAX_BLOCK then
      begin
        BlockRead (BlockFile, BlockData, MAX_BLOCK, NumBlocksRead);
        NextByte := 0;
      end;
    data := BlockData [NextByte];
    inc (NextByte);
  end;  { ReadByte }


  procedure ShowMCGA (Y,xpos,ypos: integer);
  { Put a line of MCGA data on the screen }
  var
    l,i: integer;
  begin
    l := Header.XMax - Header.Xmin;   { compute number of bytes to display }
    for i := 0 to l do putpixel(i+xpos,y+ypos,pcxline[i]);
  end;   { ShowMCGA }


  procedure Read_PCX_Line;
  { Read a line from a PC Paintbrush PCX file }
  var
    count: integer;
    bytes_per_line: integer;
  begin
  {$I-}
    bytes_per_line := Header.Bytes_per_line_per_plane * Header.Nplanes;
                          { bring in any data that wrapped from previous line }
                          { usually none  -  this is just to be safe          }
    if Index <> 0 then
      FillChar (PCXline [0], Index, data);{ fills a contiguous block of data }

    while (Index < bytes_per_line) do     { read 1 line of data (all planes) }
      begin
        ReadByte;
        if (data and $C0) = compress_num then
          begin
            count := data and $3F;
            ReadByte;
            FillChar (PCXline [Index], count, data);{ fills a contiguous block }
            inc (Index, count);
          end
        else
          begin
            PCXline [Index] := data;
            inc (Index);
          end;
      end;
    ReadError (3);
    Index := Index - bytes_per_line;
  {$I+}
  end;  { Read_PCX_Line }


  procedure Read_PCX (name: string; xpos,ypos,xm,ym:integer);
  { Read PC Paintbrush PCX file and put it on the screen }
  var
    k, kmax: integer;
  begin
  {$I-}
    ImageName := name;                     { used by ReadError }
    assign (BlockFile, name);
    reset (BlockFile, 1);                  { use 1 byte blocks }
    ReadError (1);
    ReadHeader;                            { read the PCX header }
    Header.xmax := xm;
    Header.ymax := ym;

{    if Header.Version = 5 then LoadPalette('megarace.pal'); { set the screen palette, if available }
{ i prefer that i deside when the palette should be loaded }
    kmax := Header.Ymin + Ymax;
                               { don't show more than the screen can display }
    if Header.Ymax < kmax then kmax := Header.ymax;

    for k := Header.Ymin to kmax do
      begin
        Read_PCX_Line;
        showmcga(k,xpos,ypos);
      end;
    close (BlockFile);
    ReadError (2);
  {$I+}
  end;  { Read_PCX }


procedure Show_PCX(pcxfile:string; xpos,ypos,xm,ym:integer);
begin
  read_pcx(pcxfile,xpos,ypos,xm,ym);
end;

end.