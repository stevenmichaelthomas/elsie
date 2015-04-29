angular.module('elsie.services', [])
.run(function($http, LCBO) {
  $http.defaults.headers.common.Authorization = LCBO;
});