/* global store */
angular.module('elsie.common').factory('elsie.store',
[ function() {

  return {
    set: function(key, value) {
      store.set(key, value);
    },
    get: function(key) {
      return store.get(key);
    },
    remove: function(key) {
      store.remove(key);
    }
  };

}]);