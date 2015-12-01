angular.module('elsie.common')
.factory('Settings', ['$http', '$q', '$mdToast', 'Scheduler', 'elsie.session', 'ELSIEAPI', function($http, $q, $mdToast, Scheduler, Session, ELSIEAPI) {

  var cache = {};

  var url = function(path) {
    return ELSIEAPI + '/users/' + Session.get('account').id;
  };

  var settings = {
    get: function() {
      return $http.get(url(), { timeout: 5000 }).then(function(response){
        cache = response.data;
        return cache;
      });
    },
    update: function(payload) {
      return $http.put(url(), payload, { timeout: 5000 }).then(function(response){
        cache = response.data;
        return cache;
      });
    },
    home: function() {
      if (cache.settings && cache.settings.store) {
        return cache.settings.store;
      } else {
        return;
      }
    },
    updateProfile: function(profile) {
      return $http.put(url(), { firstName: profile.firstName, lastName: profile.lastName }, { timeout: 5000 }).then(function(response){
        cache = response.data;
        return cache;
      });
    },
    unsetHomeStore: function(store) {
      $mdToast.showSimple('Removing your home store...'); 
      var settings = {};
      if (!cache.settings){
        return this.get().then(function(){
          settings = cache.settings;
          if (!settings){
            settings = {};
          }
          settings.store = {};
          return $http.put(url(), { settings: settings }, { timeout: 5000 }).then(function(response){
            cache = response.data;
            return cache.settings;
          });
        });
      } else {
        settings = cache.settings;
        settings.store = {};
        return $http.put(url(), { settings: settings }, { timeout: 5000 }).then(function(response){
          cache = response.data;
          return cache.settings;
        });
      }
    },
    setHomeStore: function(store) {
      $mdToast.showSimple('Updating your home store...'); 
      var settings = {};
      if (!cache.settings){
        return this.get().then(function(){
          settings = cache.settings;
          if (!settings){
            settings = {};
          }
          settings.store = store;
          return $http.put(url(), { settings: settings }, { timeout: 5000 }).then(function(response){
            cache = response.data;
            return cache.settings;
          });
        });
      } else {
        settings = cache.settings;
        settings.store = store;
        return $http.put(url(), { settings: settings }, { timeout: 5000 }).then(function(response){
          cache = response.data;
          return cache.settings;
        });
      }
    },
    isHome: function(store) {
      if (!cache.settings || !cache.settings.store) {
        return false;
      }
      if (store.store_no === cache.settings.store.store_no) {
        return true;
      } else {
        return false;
      }
    },
    cache: function() {
      return cache;
    }
  };
      
  return settings;

}]);