angular.module('elsie.common')
.factory('Suggestions', ['$http', '$q', '$mdToast', 'Products', 'Scheduler', 'elsie.session', 'ELSIEAPI', function($http, $q, $mdToast, Products, Scheduler, Session, ELSIEAPI) {

  var cache = {
    inbox: [],
    outbox: []
  };

  var url = function(path) {
    return ELSIEAPI + '/users/' + Session.get('account').id + '/' + path;
  };

  var suggestionsService = {
    inbox: function(){
      return $http.get(url('suggestions'));
    },
    outbox: function(){
      return $http.get(url('suggestions-sent'));
    },
    cache: function() {
      return cache;
    }
  };
      
  return suggestionsService;

}]);