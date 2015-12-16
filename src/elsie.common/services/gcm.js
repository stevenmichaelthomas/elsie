angular.module('elsie.common')
.factory('GCM', ['$q', '$mdToast', '$http', 'ELSIEAPI', 'elsie.session', function($q, $mdToast, $http, ELSIEAPI, Session) {
    
  var url = function(path) {
    return ELSIEAPI + '/users/' + Session.get('account').id + '/token';
  };

  var syncToken = function(token) {
    $http.put(url(), { gcmToken: token });
  };

  var successHandler = function(result) {
    syncToken(result.gcm);
  };

  var errorHandler = function(error) {
    $mdToast.showSimple('Unable to enable notifications. Check your system settings.');
  };

  window.onNotification = function(notification){
    $mdToast.showSimple(notification.body); 
  };

  return {
    initialize: function(){
      window.GcmPushPlugin.register(successHandler, errorHandler, {
        'badge': 'true',
        'sound': 'true',
        'alert': 'true',
        'usesGCM': true,
        'jsCallback': 'onNotification'
      });
    }
  };

}]);