angular.module('elsie.common')
.factory('Locator', function($q, Scheduler, Dialog) {

  var location = {};
  var ready = false;
  var running = false;
  var _sync = function(){
    localStorage["Elsie_cachedLocation"] = JSON.stringify(location);
  };
      
  return {
    ready: function() {
      ready = true;
    },
    initialize: function(){
      if (!localStorage["Elsie_cachedLocation"]){
        location = {
          latitude: "43.656025",
          longitude: "-79.380257"
        };
        _sync();
      } else {
        location = JSON.parse(localStorage["Elsie_cachedLocation"]);
      }
      return location;
    },
    current: function(){
      return location;
    },
    refresh: function(){
      var deferred = $q.defer();
      var process = deferred.promise;
      var onSuccess = function(position) {
        running = false;
        var newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        location = newLocation;
        _sync();
        deferred.resolve();
      };
      var onError = function() {
        running = false;
        var message = 'Elsie couldn\'t get your location. She won\'t be able to provide you with accurate information until she has it.';
        var actions = [
          { label: 'Cancel' },
          { label: 'Retry', action: 'getLocation' }
        ];
        var title = 'Location error';
        Dialog.show(message, actions, title);
        deferred.resolve();
      };
      if (!ready || running) {
        deferred.reject();
      } else {
        running = true;
        navigator.geolocation.getCurrentPosition(onSuccess, onError, { timeout: 20000 });
      }
      Scheduler.queue(process);
      return process;
    }
  };

});