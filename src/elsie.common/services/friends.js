/* global facebookConnectPlugin */
angular.module('elsie.common')
.factory('Friends', ['$q', '$mdToast', '$http', 'ELSIEAPI', 'elsie.session', function($q, $mdToast, $http, ELSIEAPI, Session) {
    
  var url = function(path) {
    return ELSIEAPI + '/users/' + Session.get('account').id + '/' + path;
  };

  var cache = {};

  var service = {
    enabled: function(){
      if (!Session.active()) {
        return false;
      } else if (!Session.get('account').facebookId) {
        return false;
      } else {
        return true;
      }
    },
    get: function(){
      var deferred = $q.defer();
      var id = Session.get('account').facebookId;
      if (id) {
        facebookConnectPlugin.api(id + '/friends', ['user_friends'],
          function (result) {
            service.fulfill(result.data).then(function(response){
              cache = {};
              angular.forEach(response.data, function(friend){
                cache[friend.id] = friend;
              });
              deferred.resolve(response.data);
            });
          },
          function (error) {
            deferred.reject(error);
          });
      } else {
        deferred.reject();
      }
      return deferred.promise;
    },
    fulfill: function(friends){
      return $http.post(url('friends'), { friends: friends });
    },
    suggest: function(product, friend){
      var suggestion = {
        productNumber: product.product_no,
        facebookId: friend.facebookId
      };
      return $http.post(url('suggestions'), suggestion);
    },
    fromCache: function(key){
      if (cache[key]){
        return cache[key];
      } else {
        return undefined;
      }
    }
  };

  return service;

}]);