unit Purchase;

interface

procedure ShowPurchase;

implementation

uses crt,graph,Global,SPCX_New,Colors,Drawing,Pur_Msg,Img_Fade;

var xa,ya,xb,yb: array[1..2] of integer;
    i: integer;

procedure DrawText(y1: integer);
var x1,x2,y2: integer;
    str: string;
begin
  x1 := GetMaxX div 2 - 250;
  y1 := y1 + 5;
  x2 := x1 + 500;
  y2 := y1 + 16;
  DrawBox(x1,y1,x2,y2);
  str := 'Press space for next player or ESC to continue game.';
  SetColor(DarkGray);
  OutTextXY(GetMaxX div 2 - (TextWidth(str) div 2),y1+4,str);
end;

procedure DrawInterface;
var t: string;
begin
  t := 'P U R C H A S E / S E L L   I T E M S';
  DrawBox(GetMaxX div 2 - (TextWidth(t) div 2)-32,GetMaxY div 2 -230,
          GetMaxX div 2 + (TextWidth(t) div 2)+32,GetMaxY div 2 -210);
  SetColor(DarkGray);
  OutTextXY(GetMaxX div 2 - (TextWidth(t) div 2),GetMaxY div 2 -223,t);
  DrawBox(xa[1],ya[1],xa[2],ya[2]);
  { descp. }
  DrawBox(xb[1],yb[1],xb[2],yb[2]);

{  ya[1] := ya[1] + 10;}

  DrawFrame(xa[1]+270,ya[1]+120,xa[1]+290,ya[1]+140);

  DrawFrame(GetMaxX div 2 - 109,ya[1]+14,GetMaxX div 2 + 109,ya[1]+24);

  DrawText(yb[2]);

  SetColor(DarkGray);
  OutTextXY(GetMaxX div 2 - 107,ya[1]+6,'Name');
  OutTextXY(GetMaxX div 2 + 52,ya[1]+6,'Balance');
  OutTextXY(xa[1]+10,ya[1]+30,'Items for sale');
  OutTextXY(xa[2]-260,ya[1]+30,'Inventory');
  OutTextXY(xa[1]+12,ya[1]+246,'Press enter to buy item.');
  OutTextXY(xa[2]-257,ya[1]+246,'Press enter to sell item.');
  DrawFrame(xa[1]+10,ya[1]+40,xa[1]+260,ya[1]+242);
  DrawFrame(xa[2]-260,ya[1]+40,xa[2]-10,ya[1]+222);
  DrawFrame(xa[2]-260,ya[1]+230,xa[2]-10,ya[1]+242);
  SetFillStyle(SolidFill,DarkBlue);
  bar(xa[1]+11,ya[1]+41,xa[1]+259,ya[1]+50);
  bar(xa[2]-259,ya[1]+41,xa[2]-11,ya[1]+50);
  SetColor(Black);
  OutTextXY(xa[1]+13,ya[1]+43,'Item');
  OutTextXY(xa[1]+217,ya[1]+43,'Cost');
  OutTextXY(xa[1]+189,ya[1]+43,'#');
  OutTextXY(xa[2]-257,ya[1]+43,'Item');
  OutTextXY(xa[2]-60,ya[1]+43,'Value');
  OutTextXY(xa[2]-80,ya[1]+43,'#');
  SetColor(White);
  OutTextXY(xa[1]+12,ya[1]+42,'Item');
  OutTextXY(xa[1]+216,ya[1]+42,'Cost');
  OutTextXY(xa[1]+190,ya[1]+42,'#');
  OutTextXY(xa[2]-258,ya[1]+42,'Item');
  OutTextXY(xa[2]-61,ya[1]+42,'Value');
  OutTextXY(xa[2]-81,ya[1]+42,'#');

  SetColor(DarkGray);
  OutTextXY(xb[1]+10,yb[1]+8,'Description');
  OutTextXY(xb[2]-150,yb[1]+8,'Technical data');
  DrawFrame(xb[1]+10,yb[1]+18,xb[2]-160,yb[2]-6);
  DrawFrame(xb[2]-150,yb[1]+18,xb[2]-10,yb[2]-6);
end;

procedure ShowPurchase;
type ItemOrWep = (Wep,Item);

     ShopListType = record
       Point: ItemOrWep;
       Index: integer;
     end;

var SSel,ISel,SLen,ILen,SMax,IMax: integer;
    SList: array[1..50] of ShopListType;
    ItList: array[1..6] of integer;
    Shop,Finito: boolean;
    STop,SBot,ITop,IBot: integer;

  function CalcArmVal(P,A: integer): integer;
  begin
    CalcArmVal := round((ItemList[A].Cost/2)*(PList[P].Armour/ItemList[A].Arm));
  end;

  procedure DrawDesc(P,N: integer;T: ItemOrWep;NoRestriction: boolean);
  var str1,str2: string;
      lines: array[1..10] of string[50];
      DLCount: integer;

    procedure GetDamStr(D: integer;var str1,str2: string);
    begin
      if D >= 10 then begin str1 := 'Hardly any da-'; str2 := 'mage.'; end;
      if D >= 15 then begin str1 := 'Very little'; str2 := 'damaging.'; end;
      if D >= 20 then begin str1 := 'A little dama-'; str2 := 'ging.'; end;
      if D >= 25 then begin str1 := 'A little more'; str2 := 'damaging.'; end;
      if D >= 30 then begin str1 := 'Harmful.'; str2 := ''; end;
      if D >= 40 then begin str1 := 'Very harmful.'; str2 := ''; end;
      if D >= 50 then begin str1 := 'Harmful and'; str2 := 'threatening.'; end;
      if D >= 60 then begin str1 := 'A serious'; str2 := 'threat.'; end;
      if D >= 80 then begin str1 := 'Very damaging.'; str2 := ''; end;
      if D >= 100 then begin str1 := 'Severely des-'; str2 := 'tructive.'; end;
      if D >= 120 then begin str1 := 'Immenesly po-'; str2 := 'werful.'; end;
    end;

    procedure ReadDesc(info: string);
    var cs,ce,j: integer;

      procedure FindLeftSpace(var e:integer);
      begin
        while (info[e] <> ' ') and (e > 0) do dec(e);
      end;

    begin
      j := 1;
      cs := 1;
      ce := 48;
      while ce <= length(info) do
      begin
        FindLeftSpace(ce);
        lines[j] := copy(info,cs,ce-cs+1);
        cs := ce+1;
        ce := cs+47;
        inc(j);
      end;
      lines[j] := copy(info,cs,length(info)-cs+1);
      DLCount := j;
    end;

    procedure DrawItemInfo;
    var i,j,Ty: integer;
    begin
      if T = Wep then
        ReadDesc(WeaponList[N].info)
      else
        ReadDesc(ItemList[N].info);
      SetFillStyle(SolidFill,Black);
      bar(xb[1]+11,yb[1]+21,xb[2]-161,yb[2]-7);
      SetColor(BrightGray);
      if T = Wep then
        OutTextXY(xb[1]+12,yb[1]+22,WeaponList[N].LName)
      else
        OutTextXY(xb[1]+12,yb[1]+22,ItemList[N].LName);
      SetColor(White);
      for i := 1 to DLCount do
        OutTextXY(xb[1]+20,yb[1]+22+(10*i),Lines[i]);
      inc(i,2);
      if T = Wep then
      begin
        Ty := ord(WeaponList[N].Class)+1;
        if (WeaponList[N].Class = Missile) and (WeaponList[N].Shots > 1) then Ty := 12;
        if (WeaponList[N].Class = Leap) and (WeaponList[N].Shots > 1) then Ty := 13;
        if (WeaponList[N].Class = Missile) and
           (WeaponList[N].Dam >= 60) and (WeaponList[N].Shots = 1) then Ty := 14;
        if (WeaponList[N].Class = Nitro) and (WeaponList[N].Shots > 1) then Ty := 15;
      end
      else
        Ty := ord(ItemList[N].Class)+8;
      ReadDesc(TypeDesc[Ty].Desc);
      SetColor(BrightGray);
      OutTextXY(xb[1]+12,yb[1]+21+(10*i),TypeDesc[Ty].Header);
      SetColor(White);
      for j := 1 to DLCount do
        OutTextXY(xb[1]+20,yb[1]+21+(10*j)+(10*i),Lines[j]);
    end;

  begin
    SetFillStyle(SolidFill,Black);
    bar(xb[1]+11,yb[1]+21,xb[2]-161,yb[2]-7);
    bar(xb[2]-149,yb[1]+21,xb[2]-11,yb[2]-7);
    if T = Wep then
    begin
      if (PList[P].Stats[2].Profit >= WeaponList[N].Cost) or (NoRestriction) then
      begin
        If FileExists(WeaponList[N].img) then
        begin
          Show_PCX(WeaponList[N].img,xb[2]-145,yb[1]+27,49,49);
          SetColor(DarkGray);
          Rectangle(xb[2]-146,yb[1]+26,xb[2]-95,yb[1]+76);
        end;
        SetColor(White);
        OutTextXY(xb[2]-82,yb[1]+34,inttostr(WeaponList[N].Height)+' mm.');
        OutTextXY(xb[2]-82,yb[1]+56,inttostr(WeaponList[N].Weight)+' kg.');
        OutTextXY(xb[2]-82,yb[1]+78,inttostr(WeaponList[N].Diameter)+' mm.');
        GetDamStr(WeaponList[N].Dam,str1,str2);
        OutTextXY(xb[2]-138,yb[1]+100,str1);
        OutTextXY(xb[2]-138,yb[1]+110,str2);
        SetColor(BrightGray);
        OutTextXY(xb[2]-90,yb[1]+24,'Height:');
        OutTextXY(xb[2]-90,yb[1]+46,'Weight:');
        OutTextXY(xb[2]-90,yb[1]+68,'Diameter:');
        OutTextXY(xb[2]-146,yb[1]+90,'Warhead damage:');
        DrawItemInfo;
      end
      else
      begin
        SetColor(LightRed);
        OutTextXY(xb[2]-148,yb[1]+22,'Unknown');
        OutTextXY(xb[1]+12,yb[1]+22,'Unknown');
      end;
    end
    else
      if ((PList[P].Stats[2].Profit >= ItemList[N].Cost) or (NoRestriction)) then
      begin
        If FileExists(ItemList[N].img) then
        begin
          Show_PCX(ItemList[N].img,xb[2]-145,yb[1]+27,49,49);
          SetColor(DarkGray);
          Rectangle(xb[2]-146,yb[1]+26,xb[2]-95,yb[1]+76);
          if ItemList[N].class = Armour then
          begin
            SetColor(BrightGray);
            OutTextXY(xb[2]-146,yb[1]+84,'Armour class:');
            SetColor(White);
            OutTextXY(xb[2]-138,yb[1]+94,inttostr(ItemList[N].Arm));
          end;
          if (N = 5) or (N = 7) then { Mag. Shield or Repair Kit }
          begin
            SetColor(BrightGray);
            OutTextXY(xb[2]-146,yb[1]+84,'Prerequisite:');
            SetColor(White);
            OutTextXY(xb[2]-138,yb[1]+94,'Any armour.');
          end;
          DrawItemInfo;
        end;
      end
      else
      begin
        SetColor(LightRed);
        OutTextXY(xb[2]-148,yb[1]+22,'Unknown');
        OutTextXY(xb[1]+12,yb[1]+22,'Unknown');
      end;
  end;

  procedure DrawShopList(P: integer);

    procedure DrawItems;
    var i: integer;
    begin
      for i := STop to SBot do
      begin
        if (SSel = i) and (Shop) then
          SetFillStyle(SolidFill,DarkestGreen)
        else
          SetFillStyle(SolidFill,Black);
        bar(xa[1]+13,ya[1]+52+(i-STop)*10,xa[1]+257,ya[1]+60+(i-STop)*10);
        if SList[i].Point = Wep then
        begin
          if WeaponList[SList[i].Index].Cost > PList[P].Stats[2].Profit then
            SetColor(Gray)
          else
            SetColor(White);
          OutTextXY(xa[1]+13,ya[1]+53+(i-STop)*10,WeaponList[SList[i].Index].Name);
          OutTextXY(xa[1]+174,ya[1]+53+(i-STop)*10,MakeSpaces(inttostr(WeaponList[SList[i].Index].Qua),3));
          OutTextXY(xa[1]+184,ya[1]+53+(i-STop)*10,MakeSpaces(inttostr(WeaponList[SList[i].Index].Cost),8));
        end
        else
        begin
          if ItemList[SList[i].Index].Cost > PList[P].Stats[2].Profit then
            SetColor(Gray)
          else
            SetColor(White);
          OutTextXY(xa[1]+13,ya[1]+53+(i-STop)*10,ItemList[SList[i].Index].Name);
          OutTextXY(xa[1]+190,ya[1]+53+(i-STop)*10,'1');
          OutTextXY(xa[1]+184,ya[1]+53+(i-STop)*10,MakeSpaces(inttostr(ItemList[SList[i].Index].Cost),8));
        end;
        SetColor(LightGray);
        if (i = STop) and (STop > 1) and (Shop) then
          OutTextXY(xa[1]+250,ya[1]+53,#30);
        if (i = SBot) and (SBot < SMax) and (Shop) then
          OutTextXY(xa[1]+250,ya[1]+53+(i-STop)*10,#31);
      end;
    end;

  begin
    If SSel < STop then
    begin
      STop := SSel;
      SBot := SSel+SLen-1;
    end;
    if SSel > SBot then
    begin
      SBot := SSel;
      STop := SSel-SLen+1;
    end;
    DrawItems;
    if Shop then
      DrawDesc(P,SList[SSel].Index,SList[SSel].Point,false);
  end;

  procedure DrawInvList(P: integer);

    procedure DrawItems;
    var i,WepNum,ItemNum: integer;
    begin
      for i := ITop to IBot do
      begin
        if (ISel = i) and (not Shop) then
          SetFillStyle(SolidFill,DarkestGreen)
        else
          SetFillStyle(SolidFill,Black);
        bar(xa[2]-258,ya[1]+52+(i-ITop)*10,xa[2]-13,ya[1]+61+(i-ITop)*10);
        ItemNum := i-PList[P].MaxW;
        SetColor(White);
        if ItemNum <= 0 then
        begin
          WepNum := PList[P].WeaponList[i].WepType;
          OutTextXY(xa[2]-257,ya[1]+53+(i-ITop)*10,WeaponList[WepNum].Name);
          if PList[P].WeaponList[i].Ammo > -1 then
            OutTextXY(xa[2]-89,ya[1]+53+(i-ITop)*10,MakeSpaces(inttostr(PList[P].WeaponList[i].Ammo),2))
          else
            OutTextXY(xa[2]-89,ya[1]+53+(i-ITop)*10,'99');
          OutTextXY(xa[2]-93,ya[1]+53+(i-ITop)*10,
                    MakeSpaces(inttostr(round(WeaponList[WepNum].Cost/(2*WeaponList[WepNum].Qua))),9));
        end
        else
        begin
          OutTextXY(xa[2]-257,ya[1]+53+(i-ITop)*10,ItemList[ItList[ItemNum]].Name);
          if (ItList[ItemNum] > 0) and (ItList[ItemNum] < 6) then
            OutTextXY(xa[2]-89,ya[1]+53+(i-ITop)*10,MakeSpaces('1',2));
          if ItList[ItemNum] = 6 then OutTextXY(xa[2]-89,ya[1]+53+(i-ITop)*10,MakeSpaces(inttostr(PList[P].Para),2));
          if ItList[ItemNum] > 4 then
            OutTextXY(xa[2]-93,ya[1]+53+(i-ITop)*10,MakeSpaces(inttostr(ItemList[ItList[ItemNum]].Cost div 2),9))
          else
            OutTextXY(xa[2]-93,ya[1]+53+(i-ITop)*10,MakeSpaces(inttostr(CalcArmVal(P,ord(PList[P].Armourment))),9));
        end;
        SetColor(LightGray);
        if (i = ITop) and (ITop > 1) and (not Shop) then
          OutTextXY(xa[2]-20,ya[1]+53,#30);
        if (i = IBot) and (IBot < IMax) and (not Shop) then
          OutTextXY(xa[2]-20,ya[1]+53+(i-ITop)*10,#31);
      end;
    end;

  begin
    SetFillStyle(SolidFill,Black);
    Bar(xa[2]-259,ya[1]+51,xa[2]-11,ya[1]+221);
    bar(xa[2]-259,ya[1]+231,xa[2]-11,ya[1]+241);
    SetColor(White);
{    bar(0,0,100,60);
    OutTextXY(10,10,'ISel:'+inttostr(ISel));
    OutTextXY(10,20,'ILen:'+inttostr(ILen));
    OutTextXY(10,30,'IMax:'+inttostr(IMax)); }
    if ord(PList[P].Armourment) = 0 then
    begin
      OutTextXY(xa[2]-257,ya[1]+233,'No armour');
    end
    else
    begin
      OutTextXY(xa[2]-257,ya[1]+233,ItemList[ord(PList[P].Armourment)].Name);
      OutTextXY(xa[2]-89,ya[1]+233,MakeSpaces(inttostr(PList[P].Armour)+'/'+
                                              inttostr(ItemList[ord(PList[P].Armourment)].arm),9));
    end;
    If ISel < ITop then
    begin
      ITop := ISel;
      IBot := ISel+ILen-1;
    end;
    if ISel > IBot then
    begin
      IBot := ISel;
      ITop := ISel-ILen+1;
    end;
{    OutTextXY(10,40,'ITop:'+inttostr(ITop));
    OutTextXY(10,50,'IBot:'+inttostr(IBot));}
    DrawItems;
    if not Shop then
    begin
      if ISel-PList[P].MaxW <= 0 then
        DrawDesc(P,PList[P].WeaponList[ISel].WepType,Wep,true)
      else
        DrawDesc(P,ItList[ISel-PList[P].MaxW],Item,true);
    end;
  end;

  procedure CalcRepairKitCost(P: integer);
  begin
    if ord(PList[P].Armourment) > 0 then
      ItemList[7].Cost := ItemList[ord(PList[P].Armourment)].Cost div 3
    else
      ItemList[7].Cost := 0;
  end;

  procedure CreateItList(P: integer);
  var N: integer;
  begin
    N := 1;
    if ord(PList[P].Armourment) > 0 then
    begin
      ItList[N] := ord(PList[P].Armourment);
      inc(N);
    end;
    if PList[P].Shield then
    begin
      ItList[N] := 5;
      inc(N);
    end;
    if PList[P].Para > 0 then ItList[N] := 6;
  end;

  procedure CalcSTopBot;
  begin
    STop := SSel-round(SLen/2)+1;
    SBot := SSel+round(SLen/2);
    if STop < 1 then
    begin
      STop := 1;
      SBot := SLen;
    end;
    if SBot > SMax then
    begin
      SBot := SMax;
      STop := SMax-SLen+1;
    end;
  end;

  procedure CalcITopBot;
  begin
    while (IBot - ITop) < ILen-1 do inc(IBot);
    if ITop < 1 then
    begin
      ITop := 1;
      IBot := ILen;
    end;
    if IBot > IMax then
    begin
      IBot := IMax;
      ITop := IMax-ILen+1;
    end;
  end;

  procedure DrawPName(P: integer);
  begin
    SetFillStyle(SolidFill,Black);
    bar(GetMaxX div 2 - 108,ya[1]+15,GetMaxX div 2 + 108,ya[1]+23);
    SetColor(PList[P].Color);
    OutTextXY(GetMaxX div 2 - 107,ya[1]+16,PList[P].Name);
    SetColor(White);
    OutTextXY(GetMaxX div 2 + 36,ya[1]+16,MakeSpaces(inttostr(PList[P].Stats[2].Profit),9));
  end;

  procedure CalcMoney(P,Mon: integer);
  var Bal: integer;
  begin
    if Shop then
    begin
      if SList[SSel].Point = Wep then
        Bal := -WeaponList[SList[SSel].Index].Cost
      else
        Bal := -ItemList[SList[SSel].Index].Cost;
    end
    else
      Bal := Mon;
    PList[P].Stats[2].Profit := PList[P].Stats[2].Profit + Bal;
    DrawPName(P);
  end;

  procedure BuyItem(P,We: integer);
  var i,W: integer;
      Succes: boolean;

    function IntToArm(I: integer): ArmType;
    begin
      case I of
        0: IntToArm := NoArmour;
        1: IntToArm := Light;
        2: IntToArm := Medium;
        3: IntToArm := Heavy;
        4: IntToArm := Titanium;
      end;
    end;

    procedure IncAmmo(W: integer);
    begin
      if PList[P].WeaponList[W].Ammo + WeaponList[PList[P].WeaponList[W].WepType].Qua < 100 then
        inc(PList[P].WeaponList[W].Ammo,WeaponList[PList[P].WeaponList[W].WepType].Qua)
      else
        FilledMsg;
    end;

    procedure InsertWep(Ps,W: integer);
    var i: integer;
    begin
      inc(PList[P].MaxW);
      for i := PList[P].MaxW downto Ps+1 do
        PList[P].WeaponList[i] := PList[P].WeaponList[i-1];
      inc(IMax);
      if (IMax > ILen) and (ILen < 17) then inc(ILen);
      PList[P].WeaponList[Ps].Ammo := WeaponList[W].Qua;
      PList[P].WeaponList[Ps].WepType := W;
    end;

    procedure BuyArm(P,W: integer);
    begin
      Succes := true;
      PList[P].Armourment := IntToArm(W);
      PList[P].Armour := ItemList[W].Arm;
      CalcRepairKitCost(P);
    end;

  begin
    Succes := false;
    if SList[We].Point = Wep then
    begin
      if (WeaponList[SList[We].Index].Cost <= PList[P].Stats[2].Profit) then
      begin
        Succes := true;
        W := SList[We].Index;
        i := 1;
        while (i <= PList[P].MaxW) and (W > PList[P].WeaponList[i].WepType) do
          inc(i);
        if (not (i > PList[P].MaxW)) and (W = PList[P].WeaponList[i].WepType) then
          IncAmmo(i)
        else
          InsertWep(i,W);
      end;
    end
    else
    if (ItemList[SList[We].Index].Cost <= PList[P].Stats[2].Profit) then
    begin
      W := We-39;
      if W < 5 then
      begin
        if ((IntToArm(W) = PList[P].Armourment) and (PList[P].Armour < ItemList[ord(PList[P].Armourment)].Arm)) or
            (PList[P].Armourment = NoArmour) then
          BuyArm(P,W)
        else
          if (IntToArm(W) > PList[P].Armourment) then
            BuyArm(P,W)
          else
            BetterArmMsg;
      end;
      if (W = 5) and (not PList[P].Shield) then
      begin
        if (PList[P].Armourment > NoArmour) then
        begin
          Succes := true;
          PList[P].Shield := true;
        end
        else
          NeedArmMsg;
      end;
      if (W = 6) then
      begin
        if (PList[P].Para < 9) then begin Succes := true; inc(PList[P].Para); end
        else FilledMsg;
      end;
      if (W = 7) then
      begin
        if (PList[P].Armourment > NoArmour) then
        begin
          if (PList[P].Armour < ItemList[ord(PList[P].Armourment)].Arm) then
          begin
            PList[P].Armour := PList[P].Armour + ((ItemList[ord(PList[P].Armourment)].Arm - PList[P].Armour) div 2);
            Succes := true;
          end;
        end
        else
          NeedArmMsg;
      end;
      CreateItList(P);
      IMax := PList[P].MaxW+ord(PList[P].Para > 0)+ord(PList[P].Shield)+ord(ord(PList[P].Armourment) > 0);
      if (IMax > ILen) and (ILen < 17) then ILen := IMax;
    end;
    if Succes then
    begin
      MakeSound(450,2);
      CalcMoney(P,0);
      CalcITopBot;
      DrawInvList(P);
      DrawShopList(P);
    end;
  end;

  procedure SellItem(P,We: integer);
  var Mon: integer;

    procedure RemoveWep(W: integer);
    var i: integer;
    begin
      for i := W to PList[P].MaxW-1 do
        PList[P].WeaponList[i] := PList[P].WeaponList[i+1];
      dec(PList[P].MaxW);
    end;

  begin
    if We <= PList[P].MaxW then
    begin
      If PList[P].WeaponList[We].Ammo > 1 then
        dec(PList[P].WeaponList[We].Ammo)
      else
        if PList[P].WeaponList[We].Ammo > -1 then RemoveWep(We);
      Mon := round(WeaponList[PList[P].WeaponList[We].WepType].Cost/(2*WeaponList[PList[P].WeaponList[We].WepType].Qua));
    end
    else
    begin
      We := We - PList[P].MaxW;
      if ItList[We] < 5 then
      begin
        Mon := CalcArmVal(P,ord(PList[P].Armourment));
        PList[P].Armour := 0;
        PList[P].Armourment := NoArmour;
      end;
      if ItList[We] = 5 then begin PList[P].Shield := false; Mon := ItemList[5].Cost div 2; end;
      if ItList[We] = 6 then begin dec(PList[P].Para); Mon := ItemList[6].Cost div 2; end;
      CreateItList(P);
    end;
    IMax := PList[P].MaxW+ord(PList[P].Para > 0)+ord(PList[P].Shield)+ord(ord(PList[P].Armourment) > 0);
    if ISel > IMax then ISel := IMax;
    if (ILen > IMax) then ILen := IMax;
    if Mon > 0 then
    begin
      MakeSound(450,2);
      CalcMoney(P,Mon);
      CalcITopBot;
      DrawInvList(P);
      CalcRepairKitCost(P);
      DrawShopList(P);
    end;
  end;

  procedure DrawArrow;
  begin
    if (FileExists('Gfx\l_arrow.pcx')) and (FileExists('Gfx\r_arrow.pcx')) then
      if Shop then
        Show_PCX('Gfx\r_arrow.pcx',xa[1]+271,ya[1]+121,18,18)
      else
        Show_PCX('Gfx\l_arrow.pcx',xa[1]+271,ya[1]+121,18,18);
  end;

begin
  ClearViewPort;
  LoadPalette('Gfx\game.pal');
  SetDarkPal(SMemPal);
  Finito := false;
  if FileExists('Gfx\frame.pcx') then
  begin
    Show_PCX('Gfx\frame.pcx',GetMaxX div 2 -318,GetMaxY div 2 - 235,636,235);
    Show_PCX('Gfx\frame.pcx',GetMaxX div 2 -318,GetMaxY div 2,636,235);
  end;
  xa[1] := GetMaxX div 2 - 279;
  ya[1] := GetMaxY div 2 - 199;
  xa[2] := xa[1] + 560;
  ya[2] := ya[1] + 260;
  xb[1] := GetMaxX div 2 - 279;
  yb[1] := ya[2]+9;
  xb[2] := xb[1] + 560;
  yb[2] := yb[1] + 146;
  for i := 1 to 39 do
  begin
    SList[i].Point := Wep;
    SList[i].Index := i+1;
  end;
  for i := 1 to 7 do
  begin
    SList[i+39].Point := Item;
    SList[i+39].Index := i;
  end;
  DrawInterface;
  FadeIn(1,SMemPal);
  i := 1;
  repeat
{    SetFillStyle(SolidFill,Black);
    Bar(xa[2]-259,ya[1]+51,xa[2]-11,ya[1]+221);}
    DrawArrow;
    DrawPName(i);
    CreateItList(i);
    Shop := true;

    { Inv List }
    IMax := PList[i].MaxW+ord(PList[i].Para > 0)+ord(PList[i].Shield)+ord(ord(PList[i].Armourment) > 0);
    ILen := 17;
    if ILen > IMax then ILen := IMax;
    ISel := 1;
    CalcITopBot;
    DrawInvList(i);

    { Shop List }
    SSel := 1;
    SLen := 19;
    SMax := 46;
    CalcSTopBot;
    CalcRepairKitCost(i);
    DrawShopList(i);
    repeat
      k := readkey;
      if k = #80 then
      begin
        MakeSound(400,2);
        if Shop then
        begin
          inc(SSel);
          if SSel > SMax then SSel := SMax else DrawShopList(i);
        end
        else
        begin
          inc(ISel);
          if ISel > IMax then ISel := IMax else DrawInvList(i);
        end;
      end;
      if k = #72 then
      begin
        MakeSound(400,2);
        if Shop then
        begin
          dec(SSel);
          if SSel < 1 then SSel := 1 else DrawShopList(i);
        end
        else
        begin
          dec(ISel);
          if ISel < 1 then ISel := 1 else DrawInvList(i);
        end;
      end;
      if k = #71 then if Shop then begin SSel := 1; DrawShopList(i); end
        else begin ISel := 1; DrawInvList(i); end;
      if k = #79 then if Shop then begin SSel := SMax; DrawShopList(i); end
        else begin ISel := IMax; DrawInvList(i); end;
      if k = #81 then
      begin
        MakeSound(450,2);
        if Shop then
        begin
          SSel := SSel+SLen;
          if SSel > SMax then SSel := SMax;
          DrawShopList(i);
        end
        else
        begin
          ISel := ISel+ILen;
          if ISel > IMax then ISel := IMax;
          DrawInvList(i);
        end;
      end;
      if k = #73 then
      begin
        MakeSound(450,2);
        if Shop then
        begin
          SSel := SSel-SLen;
          if SSel < 1 then SSel := 1;
          DrawShopList(i);
        end
        else
        begin
          ISel := ISel-ILen;
          if ISel < 1 then ISel := 1;
          DrawInvList(i);
        end;
      end;
      if k = #77 then
      begin
        Shop := false;
        DrawArrow;
        DrawShopList(i);
{        CalcITopBot;}
        DrawInvList(i);
      end;
      if k = #75 then
      begin
        Shop := true;
        DrawArrow;
        DrawInvList(i);
{        CalcSTopBot;}
        DrawShopList(i);
      end;
      if k = #13 then
      begin
        if Shop then
          BuyItem(i,SSel)
        else
          SellItem(i,ISel);
      end;
      if (k = ' ') or (k = #27) then
        if (PList[i].Shield) and (PList[i].Armourment = NoArmour) then
        begin
          k := #0;
          MagShieldMsg;
        end;
      if k = #27 then Finito := WantToEndMsg;
    until (k = ' ') or Finito;
    k := #0;
    if i < Players then inc(i) else i := 1;
  until Finito;
  FadeOut(1);
end;

end.