angular.module('elsie.common')
.factory('Dialog', function(Location) {

  return {
    show: function(message, actions, type){
      var confirmCallback = function(buttonIndex){
        if (buttonIndex == 2){
          if (actions[buttonIndex - 1].action == 'getLocation')
            Location.refresh();
          if (actions[buttonIndex - 1].action == 'url')
            //navigator.app.loadUrl(actions[buttonIndex - 1].url, {openExternal : true});
            window.open(actions[buttonIndex - 1].url, '_system');
        }
      };
      var title = type;
      var buttonLabels = [];
      for (i = 0; i < actions.length; i++){
        buttonLabels.push(actions[i].label);
      }
      navigator.notification.confirm(message, confirmCallback, title, buttonLabels);
    }
  }

});