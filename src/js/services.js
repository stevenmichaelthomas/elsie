angular.module('elsie.services', [])
.run(function($http, LCBO) {
  $http.defaults.headers.common.Authorization = LCBO;
})
.factory('Products', function($http) {

  var url = 'https://lcboapi.com';
  var dataCache = {};
      
  return {
    search: function(query) {
      return $http.get(url + '/products?q=' + query).then(function(response){
        if (response.status === 200){
          dataCache.searchResults = response.data.result;
          return dataCache.searchResults;
        } else {
          var text = "Elsie couldn't reach the LCBO API. It's possible that you've lost your data connection. Please try again in a few moments.";
          //Elsie.Interface.showApiError(text);
          //reject();
        }
      });
    }
  }

});
