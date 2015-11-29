angular.module('elsie.common')
.factory('Settings', ['$http', '$q', 'Products', 'Scheduler', 'elsie.session', 'ELSIEAPI', function($http, $q, Products, Scheduler, Session, ELSIEAPI) {

  var cache = {};

  var url = function(path) {
    return ELSIEAPI + '/users/' + Session.get('account').id;
  };

  var settings = {
    get: function() {
      return $http.get(url()).then(function(response){
        return response.data;
      });
    },
    update: function(payload) {
      return $http.put(url(), payload).then(function(response){
        return response.data;
      });
    },
    cache: function() {
      return cache;
    }
  };
      
  return settings;

}]);