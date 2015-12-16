/* global facebookConnectPlugin */
angular.module('elsie.common')
.factory('Friends', ['$q', '$mdToast', '$http', 'ELSIEAPI', 'elsie.session', function($q, $mdToast, $http, ELSIEAPI, Session) {
    
  return {
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
            deferred.resolve(result.data);
          },
          function (error) {
            deferred.reject(error);
          });
      } else {
        deferred.reject();
      }
      return deferred.promise;
    }
  };

}]);