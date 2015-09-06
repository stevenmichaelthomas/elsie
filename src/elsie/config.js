angular.module('elsie', ['ui.router', 'ngAnimate', 'ngAria', 'ngMaterial', 'elsie.common', 'elsie.splash', 'elsie.home', 'elsie.product', 'elsie.search', 'elsie.store'])

.run(['$http', '$rootScope', '$state', 'Analytics', 'Dialog', 'elsie.httpAuth', 'elsie.session', function($http, $rootScope, $state, Analytics, Dialog, HttpAuth, Session) {

  function onDeviceReady() {
    if (navigator && navigator.splashscreen){
      navigator.splashscreen.hide();
    }

    Analytics.incrementRunNumber();
    if (Analytics.runNumber() === 3){
      var message = 'If you enjoy Elsie, you can help others find out about her by leaving a review in the app store.';
      var actions = [
        { label: 'Don\'t ask again' },
        { label: 'Leave a review', action: 'url', url: 'http://www.windowsphone.com/s?appid=d1040ef2-5d48-4962-9a5b-e20c01fe1760' }
      ];
      var title = 'Please consider a review';
      Dialog.show(message, actions, title);    
    }

    if (Session.active()){
      $state.go('home');
    }
  }
  
  document.addEventListener('deviceready', onDeviceReady, false);
  window.addEventListener('native.keyboardshow', function(){
    cordova.plugins.Keyboard.disableScroll(true);
    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
  });

  $rootScope.$on('session.init', function(event, data) {
    Session.init(data);
    $state.go('home');
  });

}])

.config(function($stateProvider, $urlRouterProvider, $mdThemingProvider, $httpProvider) {

  var elsiePurple = $mdThemingProvider.extendPalette('purple', {
    '800': '674172'
  });
  $mdThemingProvider.definePalette('elsie', elsiePurple);

  var elsiePink = $mdThemingProvider.extendPalette('pink', {
    'contrastLightColors': ['300'],
    'contrastDefaultColor': 'dark'
  });
  $mdThemingProvider.definePalette('elsieAccent', elsiePink);

  var background = $mdThemingProvider.extendPalette('grey', {
    '50': 'ffffff'
  });
  $mdThemingProvider.definePalette('background', background);

  $mdThemingProvider.theme('default')
    .primaryPalette('elsie', {
      'default': '800'
    })
    .accentPalette('elsieAccent', {
      'default': '300'
    })
    .backgroundPalette('background');

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'templates/master.html',
      controller: 'HomeCtrl',
      priority: 2
    })
    .state('search', {
      url: '/search',
      controller: 'SearchCtrl',
      templateUrl: 'templates/search.html',
      priority: 3
    })
    .state('product', {
      url: '/product',
      controller: 'ProductCtrl',
      templateUrl: 'templates/product.html',
      priority: 4
    })
    .state('store', {
      url: '/store',
      controller: 'StoreCtrl',
      templateUrl: 'templates/store.html',
      priority: 5
    })
    .state('welcome', {
      url: '/welcome',
      templateUrl: 'templates/welcome.html',
      priority: 0
    })
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      priority: 1,
      controller: 'LoginCtrl'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'templates/signup.html',
      priority: 1,
      controller: 'SignupCtrl'
    });

  $httpProvider.interceptors.push('elsie.httpAuth');
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/welcome');

});
