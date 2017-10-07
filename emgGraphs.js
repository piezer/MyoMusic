//Knockout components - controls the MVVM stuff

var selectedScale = ko.observable();
// Overall viewmodel for this screen, along with initial state

function Scale(id, name, data) {
	this.scaleId = id;
	this.scaleName = name;
	this.scaleData = data;
}
var masterScales = [
    new Scale(0, "C", [48, 50, 52, 53, 55, 57, 59, 60]),
    new Scale(1, "C#", [49, 51, 53, 54, 56, 58, 60, 61]),
    new Scale(2, "D", [50, 52, 54, 55, 57, 59, 61, 62]),
    new Scale(3, "D#", [51, 53, 55, 56, 58, 60, 62, 63]),
    new Scale(4, "E", [52, 54, 56, 57, 59, 61, 63, 64]),
    new Scale(5, "F", [53, 55, 57, 58, 60, 62, 64, 65]),
    new Scale(6, "F#", [54, 56, 58, 59, 61, 63, 65, 66]),
    new Scale(7, "G", [55, 57, 59, 60, 62, 64, 66, 67]),
    new Scale(8, "G#", [56, 58, 60, 61, 63, 65, 67, 68]),
    new Scale(9, "A", [57, 59, 61, 62, 64, 66, 68, 69]),
    new Scale(10, "A#", [58, 60, 62, 63, 65, 67, 69, 70]),
    new Scale(11, "B", [59, 61, 63, 64, 66, 68, 70, 71]),
    new Scale(12, "Major Pentatonic", [54, 56, 58, 61, 63, 66]),
    new Scale(13, "Minor Pentatonic", [51, 53, 56, 58, 61, 63])
    ];

function ViewModel() {
	var self = this;

    // Non-editable catalog data - would come from the server
    self.scales = masterScales;   

    // Computed data
     

    // Operations
}

//This tells Myo.js to create the web sockets needed to communnicate with Myo Connect


Myo.on('connected', function(){
	console.log('connected');
	this.streamEMG(true);

	setInterval(function(){
		updateGraph(rawData);
	}, 500)

	
})

Myo.connect('com.myojs.emgGraphs');


var rawData = [0,0,0,0,0,0,0,0];
//var scale = [54, 56, 58, 61, 63, 66]
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

	MIDI.loadPlugin({
		soundfontUrl: "./MusyngKite/",
		instruments: ["kalimba","harpsichord"], // or the instrument code 1 (aka the default)
		onsuccess: function() { 
			MIDI.programChange(0,MIDI.GM.byName["harpsichord"].number)
			MIDI.programChange(1,MIDI.GM.byName["kalimba"].number)
			MIDI.setVolume(0, 127);
			MIDI.noteOn(0,50,127,0);	}	
		})

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

	ko.applyBindings(new ViewModel());
	
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
		for (var i = 0; i < 8  && !atRest; i+= 3){
			MIDI.noteOn(1, masterScales[$('#ddl').val()].scaleData[(128 + rawData[i]) % (masterScales[$('#ddl').val()].scaleData.length - 1)],127,0);
			MIDI.noteOn(0, masterScales[$('#ddl').val()].scaleData[(128 + rawData[i+1]) % (masterScales[$('#ddl').val()].scaleData.length - 1)],127,0);
		}
	})

}





/*




*/