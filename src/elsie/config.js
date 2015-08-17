angular.module('elsie', ['ui.router', 'ngAria', 'ngAnimate', 'ngMaterial', 'elsie.common', 'elsie.home', 'elsie.product', 'elsie.search', 'elsie.store'])

.run(function($http, LCBO, Analytics, Dialog) {
  $http.defaults.headers.common.Authorization = LCBO;
  //TODO: move this after app init
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

})

.config(function($stateProvider, $urlRouterProvider, $mdThemingProvider) {

  //todo: update with elsie colours. #674172

  $mdThemingProvider.theme('default')
    .primaryPalette('purple', {
      'default': '800',
      'hue-1': '100',
      'hue-2': '600',
      'hue-3': '50'
    })
    .accentPalette('pink', {
      'default': '500'
    })
    .backgroundPalette('grey', {
      'default': '50'
    });

  $stateProvider
    .state('home', {
      url: '/home',
      abstract: true,
      templateUrl: 'home.html',
      controller: 'HomeCtrl'
    })
    .state('home.watchlist', {
      url: '/watchlist',
      views: {
        'watchlist': {
          templateUrl: 'watchlist.html',
          controller: 'WatchlistCtrl'
        }
      }
    })
    .state('search', {
      url: '/search',
      controller: 'SearchCtrl',
      templateUrl: 'search.html'
    })
    .state('product', {
      url: '/product',
      controller: 'ProductCtrl',
      templateUrl: 'product.html'
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/home/watchlist');

});
