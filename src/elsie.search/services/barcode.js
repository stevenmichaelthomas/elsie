angular.module('elsie.search')
.factory('Barcode', function($http, ApiUrl, Location, Scheduler) {

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
          //handle error
          //Elsie.Interface.showBarcodeError(error);
        }
      );
    }
  }

});