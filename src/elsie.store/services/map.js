angular.module('elsie.store')
.factory('Map', function(BING){

  return {
    large: function(latitude, longitude){
      var centerPoint = latitude + "," + longitude;
      var imagerySet = 'Road';
      var mapSize = ((window.innerWidth * 2)) + ',800';
      var pushpin = latitude + "," + longitude + ";75";
      var zoomLevel = 17;
      var url = "http://dev.virtualearth.net/REST/v1/Imagery/Map/" + imagerySet + "/" + centerPoint + "/"+ zoomLevel +"?mapSize=" + mapSize + "&pushpin=" + pushpin + "&key=" + BING + "&format=png";
      return url;
    },
    small: function(latitude, longitude){
      var centerPoint = latitude + "," + longitude;
      var imagerySet = 'Road';
      var mapSize = ((window.innerWidth * 2)) + ',300';
      var pushpin = latitude + "," + longitude + ";75";
      var zoomLevel = 17;
      var url = "http://dev.virtualearth.net/REST/v1/Imagery/Map/" + imagerySet + "/" + centerPoint + "/"+ zoomLevel +"?mapSize=" + mapSize + "&pushpin=" + pushpin + "&key=" + BING + "&format=png";
      return url;
    }
  };

});