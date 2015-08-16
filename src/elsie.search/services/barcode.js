angular.module('elsie.search')
.factory('Barcode', function($http, ApiUrl, Location, Scheduler, Dialog) {

  var url = function(){
    return ApiUrl;
  };
      
  return {
    scan = function() {
      cordova.plugins.barcodeScanner.scan(
        function (result) {
          if (!result.cancelled){
            return result;
          }
        }, 
        function (error) {
          var message = 'Error scanning: ' + error;
          var actions = [
            { label: 'OK' }
          ];
          var title = 'Barcode scan error';
          Dialog.show(message, actions, title);
        }
      );
    }
  }

});