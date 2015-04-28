angular.module('elsie', ['ui.router', 'ngAria', 'ngAnimate', 'ngMaterial', 'elsie.controllers', 'elsie.services'])

.run(function(){
  console.log('init success');
})

.config(function($stateProvider, $urlRouterProvider, $mdThemingProvider) {

  $mdThemingProvider.theme('default')
    .primaryPalette('deep-purple', {
      'default': '500'
    })
    .accentPalette('pink', {
      'default': '500'
    });

  $stateProvider
    .state('home', {
      url: '/home',
      abstract: true,
      templateUrl: 'home.html',
      controller: 'HomeCtrl'
    })
    .state('home.search', {
      url: '/search',
      views: {
        'search': {
          templateUrl: 'search.html'
        }
      }
    })
    .state('home.watchlist', {
      url: '/watchlist',
      views: {
        'watchlist': {
          templateUrl: 'watchlist.html'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/home/search');

});
