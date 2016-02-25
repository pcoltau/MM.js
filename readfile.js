function readWepFile(wepFile) {
	console.log(decodeFile(wepFile));

	wepList = [];
	wep = {};
	var lines = decodeFile(wepFile).split("\r\n");
	for (var i = 0; i < lines.length; i++) {
		var parts = lines[i].split("=");
		if (parts.length == 2) {
			wep[parts[0]] = parts[1];
			//console.log(parts[0] + "=" + wep[parts[0]]);
		}
		else if (Object.keys(wep).length > 0) {
			wepList.push(wep);
			wep = {};
		}
	}

	for (i = 0; i < wepList.length; i++) {
		for (key in wepList[i]) {
			console.log(key + "=" + wepList[i][key]);
		}

	}
	// var variable = "name";
	// var value = "jens";
	// wepList.push({[variable]: value});
	// console.log(wepList[0].name);
	
/*
1
cost=0
name=Mortar
dam=10
shots=1
class=missile
info1=The mortar is a part of the tanks standard weapon equipment and has infinite supplies.
height=250
diameter=80
weight=3
img=wep01.pcx
qua=1
exponimp=false

1
cost=1500
name=Light Armour
arm=200
class=armour
img=item01.pcx
info1=This armour is the lightest and cheapest armour you can get. But hey, bad armour is better than no armour.

*/
}

function decodeFile(file) {
	var result = "";
	var factor = 10;
	var byteView = new Uint8Array(file);

    for(var i = 0; i < byteView.length; i++) {
	    var b = byteView[i] - factor;
	    if (b < 0) b += 255;

	    result += String.fromCharCode(b);

	    factor = factor + 10;
	    if (factor == 60) factor = 10;
    }
    return result;
}