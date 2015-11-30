angular.module('elsie.splash').factory('elsie.auth',
  ['$http', 'ELSIEAPI',
  function($http, apiUrl) {

    function url(path) {
      return apiUrl + '/auth/'+ path;
    }

    return {
      facebook: function(token) {
        return $http.post(url('facebook'), { access_token: token })
          .then(function(response) {
            return response.data;
          });
      }

    , facebookLink: function(token, account) {
        return $http.post(url('facebook/link'), { access_token: token, account: account })
          .then(function(response) {
            return response.data;
          });
      }

    , login: function(payload) {
        return $http.post(url('login'), payload)
          .then(function(response) {
            return response.data;
          });
      }

    , signup: function(payload) {
        return $http.post(url('signup'), payload)
          .then(function(response) {
            return response.data;
          });
      }
    };

  }]);