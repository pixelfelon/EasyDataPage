function freq(data) {
	var frequency = {};
	for (var station in data) {
		frequency[station] = {};
		for (var i = 1; i <= 5; i++) {
			frequency[station][i] = 0;
		}
		
		for (var i = 0; i < data[station].length; i++) {
			frequency[station][data[station][i]]++;
		}
	}
	return frequency;
}

function normalize(data) {
	var max = -999999999;
	for (var i in data) {
		max = Math.max(max, data[i]);
	}
	var out = {};
	for (var i in data) {
		if (max == 0) {
			out[i] = 0;
			continue;
		}
		out[i] = (data[i] / max) * 100;
	}
	return out;
}

var graphs = {};
var titles = {};
var keys = {};
var bars = {};
var values = {};

function getStationLabel(nameOrId) {
	for (var i = 0; i < stations.length; i++) {
		if (stations[i].id == nameOrId || stations[i].name == nameOrId) {
			return stations[i].label;
		}
	}
}

function setup(data) {
	var graphcont = $("#graphs");
	for (var station in data) {
		graphs[station] = $("<div class=\"graph\"></div>").appendTo(graphcont);
		//var titlecont = $("<div class=\"titlecont\"></div>").appendTo(graphs[station]);
		titles[station] = $("<h1>"+getStationLabel(station)+"</h1>").appendTo(graphs[station]);;
		var barcont = $("<div class=\"bars\"></div>").appendTo(graphs[station]);
		var keycont = $("<div class=\"keys\"></div>").appendTo(graphs[station]);
		keys[station] = {};
		bars[station] = {};
		values[station] = {};
		for (var i = 1; i <= 5; i++) {
			bars[station][i] = $("<div class=\"bar\"></div>").appendTo(barcont);
		}
		for (var i = 1; i <= 5; i++) {
			values[station][i] = $("<span class=\"value\"></span>").appendTo(bars[station][i]);
		}
		for (var i = 1; i <= 5; i++) {
			keys[station][i] = $("<div class=\"key k"+i+"\"></div>").appendTo(keycont);
		}
	}
}

function populate(data) {
	data = freq(data);
	for (var station in data) {
		pctHt = normalize(data[station]);
		for (var i = 1; i <= 5; i++) {
			bars[station][i].css('height', pctHt[i]+'%');
		}
		for (var i = 1; i <= 5; i++) {
			values[station][i].html(data[station][i]);
		}
	}
}

$(function(){
	setup(preload);
	populate(preload);
	window.setInterval(getData, 1000);
});

function getData(){
	$.ajax({
		dataType: "json",
		method: "POST",
		url: "/catchup",
		
		success: function(data){
			if (data.error) {
				console.error("Server error: "+data.error);
			} else {
				populate(data);
			}
		}
	});
}