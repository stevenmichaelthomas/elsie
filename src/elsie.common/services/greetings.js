angular.module('elsie.common')
.factory('Greetings', function() {

  var greetings = {
    en: [
      { text: 'Lovely day for a scotch.' },
      { text: 'At your service.' },
      { text: 'What are you looking for?' },
      { text: 'Hello!' },
      { text: 'Let\'s get started.' }
    ]
  };

  return {
    english: function() {
      var item = greetings.en[Math.floor(Math.random() * greetings.en.length)];
      return item;
    }
  };

});