angular.module('elsie.common')
.factory('Location', function($q, Scheduler) {

  var location = {};
  var _sync = function(){
    localStorage["Elsie_cachedLocation"] = JSON.stringify(location);
  };
      
  return {
    initialize: function(){
      if (!localStorage["Elsie_cachedLocation"]){
        location = {
          latitude: "43.656025",
          longitude: "-79.380257"
        };
        localStorage["Elsie_cachedLocation"] = JSON.stringify(location);
      } else {
        location = JSON.parse(localStorage["Elsie_cachedLocation"]);
      }
      return location;
    },
    refresh: function(){
      var deferred = $q.defer();
      var process = deferred.promise;
      //Elsie.Interface.showLoadingAnimation("Getting your location...");
      var onSuccess = function(position) {
        //Elsie.Interface.hideLoadingAnimation();
        var newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        location = newLocation;
        _sync();
        deferred.resolve();
      };
      var onError = function() {
        //Elsie.Interface.hideLoadingAnimation();
        var text = "Elsie couldn't get your location. She won't be able to provide you with accurate information until she has it.";
        var link = { label: "Retry", action: "getLocation" };
        //Elsie.Interface.showLocationError(text, link);
        deferred.resolve();
      };
      navigator.geolocation.getCurrentPosition(onSuccess, onError, { timeout: 6500 });
      Scheduler.queue(process);
      return process;
    }
  }

})