angular.module('elsie.store')
.factory('Stores', function($http, $mdToast, ELSIEAPI, Scheduler, Dialog, Locator) {

  var url = function() {
    return ELSIEAPI;
  };

  var _today = function() {
    var day;
    switch (new Date().getDay()) {
        case 0:
            day = "sunday";
            break;
        case 1:
            day = "monday";
            break;
        case 2:
            day = "tuesday";
            break;
        case 3:
            day = "wednesday";
            break;
        case 4:
            day = "thursday";
            break;
        case 5:
            day = "friday";
            break;
        case 6:
            day = "saturday";
            break;
    }
    return day;
  };

  var _hours = function(store){
    var day = _today();
    var todayOpen = day + "_open";
    var todayClose = day + "_close";
    var todaysHours = {};
    todaysHours.open = store[todayOpen];
    todaysHours.close = store[todayClose];
    return todaysHours;
  };

  var _status = function(store){
    var todaysHours = _hours(store);
    var now = new Date();
    var minutes_since_midnight = (now.getHours() * 60) + now.getMinutes();
    var result;
    if (todaysHours.open === null || todaysHours.closed === null){
      result = "closed";
      return result;
    }
    if (minutes_since_midnight >= todaysHours.open && minutes_since_midnight <= todaysHours.close) {
      result = "open";
    } else {
      result = "closed";
    }
    return result;
  };

  var _timeUntilChange = function(store){
    var todaysHours = _hours(store);
    var now = new Date();
    var minutes_since_midnight = (now.getHours() * 60) + now.getMinutes();
    var result;
    // if we are open, we want to return the amount of time until close
    if (minutes_since_midnight >= todaysHours.open && minutes_since_midnight <= todaysHours.close){
      var minutesToClose = todaysHours.close - minutes_since_midnight;
      if (minutesToClose >= 60) {
        // convert to hours
        var hoursToClose = minutesToClose / 60;
        result = hoursToClose.toFixed(1) + " hours until close"; 
      } else {
        result = minutesToClose + " minutes until close";
      }
    } else {
      // we are closed, so we want to return the amount of time until open
      if (todaysHours.open === null || todaysHours.closed === null){
        result = "due to holiday";
        return result;
      }
      var minutesToOpen;
      if (minutes_since_midnight > todaysHours.open) {
        // we are late in the night, but before midnight
        minutesToOpen = todaysHours.open + (1440 - minutes_since_midnight);
      } else {
        // we are in the wee hours of the morning
        minutesToOpen = todaysHours.open - minutes_since_midnight;
      }
      if (minutesToOpen >= 60) {
        // convert to hours
        var hoursToOpen = minutesToOpen / 60;
        result = hoursToOpen.toFixed(1) + " hours until open"; 
      } else {
        result = minutesToOpen + " minutes until open";
      }
    }
    return result;
  };

  var cache = {
    selected: null,
    query: []
  };

  return {
    select: function(item) {
      if (item){
        cache.selected = item;
      }
      return;
    },
    selected: function() {
      return cache.selected;
    },
    search: function(query) {
      var req = url() + '/stores?lat=' + Locator.current().latitude +'&lon=' + Locator.current().longitude + '&q=' + query;
      var process = $http.get(req, { timeout: 5000 }).then(function(response){
        if (response.status === 200){
          cache.query = response.data.result;
          return cache.query;
        } else {
          Dialog.showConnectionError();
          return [];
        }
      });
      Scheduler.queue(process);
      return process;
    },
    one: function(id){
      $mdToast.showSimple('Looking up store #' + id + '...'); 
      var req = url() + '/stores/' + id;
      return $http.get(req, { timeout: 5000 }).then(function(result){
        if (result.status === 200){
          cache.selected = result.data;
          return cache.selected;
        } else {
          Dialog.showConnectionError();
          return {};
        }
      });
    },
    inventory: function(query, store){
      if (!query || query === "") {
        return;
      }
      var req = url() + '/products?q=' + query + '&store_id=' + store.id;
      var process = $http.get(req, { timeout: 5000 }).then(function(result){
        if (result.status === 200){
          return result.data;
        } else {
          Dialog.showConnectionError();
          return [];
        }
      });
      Scheduler.queue(process);
      return process;
    },
    today: function(){
      return _today();
    },
    hours: function(store){
      return _hours(store);
    },
    status: function(store){
      return _status(store);
    },
    timeUntilStatusChange: function(store){
      return _timeUntilChange(store);
    }
  };

});