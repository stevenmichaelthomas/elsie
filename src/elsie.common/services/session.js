angular.module('elsie.common').factory('elsie.session',
['elsie.store', '$rootScope',
function(Store, $rootScope) {

  var _storeKey = 'elsie.session';

  var Session = {
    init: function(data) {
      Store.set(_storeKey, data);
    }

  , set: function(key, value) {
      var _data = Store.get(_storeKey);
      _data[key] = value;
      Store.set(_storeKey, _data);
    }

  , get: function(key) {
      return this.active() ? Store.get(_storeKey)[key] : '';
    }

  , active: function() {
      var active = false;
      var data = Store.get(_storeKey);
      if (data) {
        active = true;
      }

      return active;
    }

  , clear: function() {
      $rootScope.$broadcast('session.end');
      Store.remove(_storeKey);
    }

  };

  return Session;

}]);