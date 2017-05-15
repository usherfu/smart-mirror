'use strict'
// Load in smart mirror config
var config = require("./config.json")
if(!config || !config.motion || !config.motion.enabled || !config.motion.pin || !config.general.language){
	console.log("!E:","Configuration Error! See: https://docs.smart-mirror.io/docs/configure_the_mirror.html#motion")
}

if (config.motion.enabled == true && require.resolve('johnny-five').length > 0 && require.resolve('raspi-io').length > 0 ) {

	// Configure johnny-five
	var five = require('johnny-five');
	var Raspi = require("raspi-io");
	var Relay2Switch = require("./relay2switch.js");

	var board = new five.Board({
		io: new Raspi()
	});

	board.on("ready",function() {
		
		var motion = new five.Motion(config.motion.pin);
		var relay = new five.Relay("GPIO17");
		this.repl.inject({relay:relay});
		var relay2switch = new Relay2Switch(relay, true);
		var timerHandle = null;

			// "calibrated" occurs once, at the beginning of a session,
		motion.on("calibrated", function() {
			console.log("!c:","calibrated");
		});

			// "motionstart" events are fired when the "calibrated"
			// proximal area is disrupted, generally by some form of movement
		motion.on("motionstart", function() {
			console.log("!s:","motionstart");
		});

			// "motionend" events are fired following a "motionstart" event
			// when no movement has occurred in X ms
		motion.on("motionend", function() {
			console.log("!e:","motionend");
			if( relay2switch.isLCDOn() ){
				console.log("LCD is currently on...");
				//relay2switch.switchOff();
			}else{
				console.log("LCD is currently off, switching on...");
				relay2switch.switchOn();
			}
			
			//cancel timer if already running
			if (timerHandle != null){
				clearTimeout(timerHandle);
				timerHandle = null;
				console.log("Old timer cancelled!");
			}
			//now start a new timer when new motion detected
			console.log("Start new timer...");
			timerHandle = setTimeout(function(){
				console.log("switching off upon timer");
				relay2switch.switchOff();			
			}, 10000);
		});
	});
} else if ( config.motion.enabled == true){
	console.error("!E:","Motion Dependencies are missing! Therefore despite my best efforts I'll have to disable motion, Dave. This is most embarrassing for us both.")
}
