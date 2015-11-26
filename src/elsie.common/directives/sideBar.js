angular.module('elsie.common')
.directive('sideBar', ['Navigator', 'elsie.session', 'Actions', '$mdSidenav', function(Navigator, Session, Actions, $mdSidenav) {
  return {
    replace: true,
    scope: {},
    templateUrl: 'templates/side-bar.html',
    link: function($scope, $element, $attrs) {
      $scope.go = function(destination){
        $mdSidenav('menu').close();
        Navigator.go(destination);
      };
      $scope.close = function () {
        $mdSidenav('menu').close();
      };
      $scope.back = function(){
        if (Actions.backGoesHome()){
          Navigator.go('home', 'back');
        } else {
          Navigator.back();
        }
      };
      $scope.logout = function(){
        Session.clear();
        $mdSidenav('menu').close();
        Navigator.go('welcome', 'back');
      };
      $scope.$on('session.init', function(event, data){
        $scope.user = data.account;
        $scope.session = true;
      });
      $scope.$on('session.end', function(event, data){
        delete $scope.user;
        $scope.session = false;
      });
      if (Session.active()){
        $scope.user = Session.get('account');
        $scope.session = true;
      }
    }
  };
}]);