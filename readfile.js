"use strict";

function readEncodedFile(file) {
	let resultList = [];
	let item = {};
	let lines = decodeFile(file).split("\r\n");
	for (let i = 0; i < lines.length; i++) {
		let parts = lines[i].split("=");
		if (parts.length == 2) {
			let value = parts[1];
			let intValue = parseInt(value);
			if (!isNaN(intValue)) {
				value = intValue;
			} 
			else if (value === "true") {
				value = true;
			} 
			else if (value === "false") {
				value = false;
			} 
			item[parts[0]] = value;
		}
		else if (Object.keys(item).length > 0) {
			resultList.push(item);
			item = {};
		}
	}
	return resultList;
}

function readEncodedTypeFile(file) {
	let resultList = [];
	let lines = decodeFile(file).split("\r\n");
	for (let i = 0; i < lines.length; i += 3) {
		let item = {};
		item.header = lines[i];
		item.desc = lines[i+1];
		resultList.push(item);
	}
	return resultList;
}

function decodeFile(file) {
	let result = "";
	let factor = 10;
	let byteView = new Uint8Array(file);

    for(let i = 0; i < byteView.length; i++) {
	    let b = byteView[i] - factor;
	    if (b < 0) b += 255;

	    result += String.fromCharCode(b);

	    factor = factor + 10;
	    if (factor == 60) factor = 10;
    }
    return result;
}

function readConfigFile(file) {
	let resultList = {};
	let lines = file.split("\r\n");
	for (let i = 0; i < lines.length; i++) {
		let parts = lines[i].split("=");
		if (parts.length == 2) {
			resultList[parts[0]] = parts[1];
		}
	}
	return resultList;
}