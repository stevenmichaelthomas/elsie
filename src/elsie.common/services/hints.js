angular.module('elsie.common')
.factory('Hints', function() {

  var greetings = {
    en: [
      { text: 'Try "Pinot Noir" or "Saison"' },
      { text: 'Try "Dunkel" or "Single malt"' }
    ]
  };

  return {
    english: function() {
      var item = greetings.en[Math.floor(Math.random() * greetings.en.length)];
      return item;
    }
  };

});