//This tells Myo.js to create the web sockets needed to communnicate with Myo Connect


Myo.on('connected', function(){
	console.log('connected');
	this.streamEMG(true);

	setInterval(function(){
		updateGraph(rawData);
	}, 500)

	MIDI.loadPlugin({
		instrument: "acoustic_grand_piano", // or the instrument code 1 (aka the default)
		onsuccess: function() { 
			MIDI.setVolume(0, 127);
			MIDI.noteOn(0,50,127,0);	}	
	})
	
})

Myo.connect('com.myojs.emgGraphs');


var rawData = [0,0,0,0,0,0,0,0];
var scale = [54, 56, 58, 61, 63, 66]
var atRest = false;
Myo.on('rest', function(){
	atRest = !atRest;
 })
Myo.on('emg', function(data){
	rawData = data;
})


var range = 150;
var resolution = 50;
var emgGraphs;

var graphData= [
	Array.apply(null, Array(resolution)).map(Number.prototype.valueOf,0),
	Array.apply(null, Array(resolution)).map(Number.prototype.valueOf,0),
	Array.apply(null, Array(resolution)).map(Number.prototype.valueOf,0),
	Array.apply(null, Array(resolution)).map(Number.prototype.valueOf,0),
	Array.apply(null, Array(resolution)).map(Number.prototype.valueOf,0),
	Array.apply(null, Array(resolution)).map(Number.prototype.valueOf,0),
	Array.apply(null, Array(resolution)).map(Number.prototype.valueOf,0),
	Array.apply(null, Array(resolution)).map(Number.prototype.valueOf,0)
]

$(document).ready(function(){

	emgGraphs = graphData.map(function(podData, podIndex){
		return $('#pod' + podIndex).plot(formatFlotData(podData), {
			colors: ['#8aceb5'],
			xaxis: {
				show: false,
				min : 0,
				max : resolution
			},
			yaxis : {
				min : -range,
				max : range,
			},
			grid : {
				borderColor : "#427F78",
				borderWidth : 1
			}
		}).data("plot");
	});


});

var formatFlotData = function(data){
		return [data.map(function(val, index){
				return [index, val]
			})]
}


var updateGraph = function(emgData){

	graphData.map(function(data, index){
		graphData[index] = graphData[index].slice(1);
		graphData[index].push(emgData[index]);

		emgGraphs[index].setData(formatFlotData(graphData[index]));
		emgGraphs[index].draw();
		for (var i = 0; i < 8  && !atRest; i+= 3)
			MIDI.noteOn(0, scale[(128 + rawData[i]) % scale.length - 1],127,0);
	})

}

/*




*/