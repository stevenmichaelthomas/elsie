angular.module('elsie.search')
.factory('Barcode', function($http, $q, LCBOAPI, Scheduler, Dialog) {

  var url = function(){
    return LCBOAPI;
  };
      
  return {
    scan: function() {
      var deferred = $q.defer();
      cordova.plugins.barcodeScanner.scan(
        function (result) {
          if (!result.cancelled){
            deferred.resolve(result);
          }
        }, 
        function (error) {
          var message = 'Error scanning: ' + error;
          var actions = [
            { label: 'OK' }
          ];
          var title = 'Barcode scan error';
          Dialog.show(message, actions, title);
          deferred.reject();
        }
      );
      return deferred.promise;
    }
  };

});