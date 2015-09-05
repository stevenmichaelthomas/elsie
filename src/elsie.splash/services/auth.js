angular.module('elsie.splash').factory('elsie.auth',
  ['$http', 'ELSIEAPI',
  function($http, apiUrl) {

    function url(path) {
      return apiUrl + '/auth/'+ path;
    }

    return {
      login: function(payload) {
        return $http.post(url('login'), payload)
          .then(function(response) {
            return response.data;
          });
      }

    , register: function(payload) {
        return $http.post(url('signup'), payload)
          .then(function(response) {
            return response.data;
          });
      }
    };

  }]);