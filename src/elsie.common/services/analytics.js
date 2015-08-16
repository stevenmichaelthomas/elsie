angular.module('elsie.common')
.factory('Analytics', function() {

  var cache = {
    runNumber: 0
  };

  return {
    incrementRunNumber = function(){
      if (!localStorage["Elsie_numberOfRuns"]){
        cache.runNumber = 1;
        localStorage["Elsie_numberOfRuns"] = 1;
      } else {
        var existingNumber = parseInt(localStorage["Elsie_numberOfRuns"]);
        var newNumber = existingNumber + 1;
        cache.runNumber = newNumber;
        localStorage["Elsie_numberOfRuns"] = newNumber;
      }
    },
    runNumber = function(){
      return cache.runNumber;
    }
  }

})