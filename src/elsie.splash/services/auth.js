angular.module('elsie.splash').factory('elsie.auth',
  ['$http', 'ELSIEAPI', '$mdToast',
  function($http, apiUrl, $mdToast) {

    function url(path) {
      return apiUrl + '/auth/'+ path;
    }

    return {
      facebook: function(token) {
        $mdToast.showSimple('Logging in...');
        return $http.post(url('facebook'), { access_token: token })
          .then(function(response) {
            return response.data;
          }, function() {
            $mdToast.showSimple('There was a problem authenticating with Facebook.');
          });
      }

    , facebookLink: function(token, account) {
        return $http.post(url('facebook/link'), { access_token: token, account: account })
          .then(function(response) {
            return response.data;
          });
      }

    , login: function(payload) {
        $mdToast.showSimple('Logging in...');
        return $http.post(url('login'), payload)
          .then(function(response) {
            return response.data;
          }, function() {
            $mdToast.showSimple('Login error. Check your credentials and try again!');
          });
      }

    , signup: function(payload) {
        return $http.post(url('signup'), payload)
          .then(function(response) {
            return response.data;
          }, function() {
            $mdToast.showSimple('Signup error. Did you miss a field?');
          });
      }
    };

  }]);