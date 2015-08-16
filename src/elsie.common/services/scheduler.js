angular.module('elsie.common')
.factory('Scheduler', function($q) {

  var processes = [];
      
  return {
    queue: function(promise){
      processes.push(promise);
      return;
    },
    run: function(){
      return $q.all(processes);
    }
  }

});