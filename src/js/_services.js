var services = {};
var data = {};

services.getLocation = function(){

	var response;

	var onSuccess = function(position) {
	    /*console.log('Latitude: '          + position.coords.latitude          + '\n' +
	          'Longitude: '         + position.coords.longitude         + '\n' +
	          'Altitude: '          + position.coords.altitude          + '\n' +
	          'Accuracy: '          + position.coords.accuracy          + '\n' +
	          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
	          'Heading: '           + position.coords.heading           + '\n' +
	          'Speed: '             + position.coords.speed             + '\n' +
	          'Timestamp: '         + position.timestamp                + '\n');*/
	    var location = {
	    	latitude: position.coords.latitude,
	    	longitude: position.coords.longitude
	    };
	    data.location = location;
	};

	// onError Callback receives a PositionError object
	//
	function onError(error) {
	    console.log('code: '    + error.code    + '\n' +
	          'message: ' + error.message + '\n');
	    response = null;
	}

	navigator.geolocation.getCurrentPosition(onSuccess, onError);

}

services.returnLocation = function(){
	return data.location;
}