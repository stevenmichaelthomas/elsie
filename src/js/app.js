angular.module('elsie', ['ui.router', 'ngAria', 'ngAnimate', 'ngMaterial', 'elsie.controllers', 'elsie.services', 'elsie.directives'])

.run(function($rootScope){
  //
})

.config(function($stateProvider, $urlRouterProvider, $mdThemingProvider) {

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
