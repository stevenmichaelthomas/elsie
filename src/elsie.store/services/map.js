angular.module('elsie.store')
.factory('Map', function(BING){

  return {
    get: function(latitude, longitude){
      var centerPoint = latitude + "," + longitude;
      var imagerySet = 'Road';
      var mapSize = ((window.innerWidth * 2) - 80) + ',400';
      var pushpin = latitude + "," + longitude + ";75";
      var zoomLevel = 17;
      var url = "http://dev.virtualearth.net/REST/v1/Imagery/Map/" + imagerySet + "/" + centerPoint + "/"+ zoomLevel +"?mapSize=" + mapSize + "&pushpin=" + pushpin + "&key=" + BING + "&format=png";
      return url;
    }
  }

})