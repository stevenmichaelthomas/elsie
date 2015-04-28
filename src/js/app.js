angular.module('elsie', ['ui.router', 'ngAria', 'ngAnimate', 'ngMaterial', 'elsie.controllers', 'elsie.services'])

.run(function(){
  //
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

  /*.state('motions', {
    url: '/motions',
    abstract: true,
    templateUrl: 'templates/motions.html',
    controller: 'MotionsCtrl'
  })
  .state('motions.trending', {
    url: '/trending',
    views: {
      'trending': {
        templateUrl: 'templates/motions/trending.html'
      }
    }
  });*/

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');

});
