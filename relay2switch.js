function Relay2Switch(relay, isLCDOn) {
	this._relay = relay;
	this._isLCDOn = isLCDOn;
}

Relay2Switch.prototype.isLCDOn = function() {
	return this._isLCDOn;
}

Relay2Switch.prototype.switchOn = function() {
	if(this._isLCDOn == false){
		triggerRelay.apply(this);
		this._isLCDOn = true;
	}
}


Relay2Switch.prototype.switchOff = function() {
	if(this._isLCDOn == true){
		triggerRelay.apply(this);
		this._isLCDOn = false;
	}
}

//private method
var triggerRelay = function () {
	var self = this;
	this._relay.toggle();
	setTimeout(function() {
		self._relay.toggle();
	}, 500);
}

// export module
module.exports = Relay2Switch;
