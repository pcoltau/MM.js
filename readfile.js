"use strict";

function readEncodedFile(file) {
	var resultList = [];
	var item = {};
	var lines = decodeFile(file).split("\r\n");
	for (var i = 0; i < lines.length; i++) {
		var parts = lines[i].split("=");
		if (parts.length == 2) {
			item[parts[0]] = parts[1];
		}
		else if (Object.keys(item).length > 0) {
			resultList.push(item);
			item = {};
		}
	}
}

function readEncodedTypeFile(file) {
	var resultList = [];
	var lines = decodeFile(file).split("\r\n");
	for (var i = 0; i < lines.length; i += 3) {
		var item = {};
		item.header = lines[i];
		item.desc = lines[i+1];
		resultList.push(item);
	}
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

function readConfigFile(file) {
	var resultList = {};
	var lines = file.split("\r\n");
	for (var i = 0; i < lines.length; i++) {
		var parts = lines[i].split("=");
		if (parts.length == 2) {
			resultList[parts[0]] = parts[1];
		}
	}
	return resultList;
}