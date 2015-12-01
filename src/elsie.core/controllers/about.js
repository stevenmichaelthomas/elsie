angular.module('elsie.core')
.controller('AboutCtrl', ['$scope', 'Actions', function($scope, Actions) {
  (function init(){
    Actions.theme('transparent-dark');
    Actions.set({ title: '', menu: false, back: true, search: false, watchlist: false, logo: false });
  })();
}]);