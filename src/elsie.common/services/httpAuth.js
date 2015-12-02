angular.module('elsie.common').factory('elsie.httpAuth',
['$q', 'elsie.session', '$injector', '$location', 'LCBO',
function($q, Session, $injector, $location, LCBO) {

  var bufferedLocation;
  var dontBuffer = ['/welcome'];

  function resetBufferedLocation() {
    bufferedLocation = null;
  }

  function hasBufferedLocation() {
    return !!bufferedLocation;
  }

  function setBufferedLocation() {
    if(hasBufferedLocation()) { return; }

    var path = $location.path();
    if(dontBuffer.indexOf(path) === -1) {
      bufferedLocation = path;
    }
  }

  function handle408(res) {
    if(res.status === 408) {
      console.log('request timed out');
    }
  }

  function handle401(res) {
    if(res.status === 401) {
      Session.clear();
      // setBufferedLocation();
      // $injector.get('$state').go('welcome');
    }
  }

  function authOrFileUrl(url) {
    return url.indexOf('/auth/') !== -1 || url.indexOf('.html') !== -1;
  }

  function addAuthHeader(req) {
    req.timeout = 5000;
    // req.headers['X-Requested-With'] = 'Elsie_iOS';
    if(Session.active()) {
      var token = Session.get('token');
      if(token) { req.headers.Authorization = 'Bearer '+ token; }
    }
    return req;
  }

  return {
    request: function(req) {
      return addAuthHeader(req);
    }
  , responseError: function(res) {
      handle401(res);
      return $q.reject(res);
    }

  , hasBufferedLocation: hasBufferedLocation
  , useBufferedLocation: function() {
      $location.path(bufferedLocation);
      resetBufferedLocation();
    }
  };

}]);