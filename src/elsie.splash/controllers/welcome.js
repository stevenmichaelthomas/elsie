angular.module('elsie.splash')
.controller('WelcomeCtrl', ['$scope', 'Actions', 'elsie.session', '$state', function($scope, Actions, Session, $state){
  (function(){
    if (Session.active()){
      console.log('session is active, going home');
      //$state.go('home');
      return;
    }
    Actions.light(false);
    Actions.search(false);
    Actions.set({ menu: false, back: false });
    Actions.backGoesHome(false);
  })();
}]);