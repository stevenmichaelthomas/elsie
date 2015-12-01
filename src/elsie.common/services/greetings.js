angular.module('elsie.common')
.factory('Greetings', ['elsie.session', function(Session) {

  var greetings = {
    en: [
      { text: 'Lovely day for a scotch.' },
      { text: 'At your service.' },
      { text: 'What are you looking for?' },
      { text: 'Hello!' },
      { text: 'Let\'s get started.' }
    ]
  };

  if (Session.active()) {
    var name = Session.get('account').firstName;
    greetings.en.push({ text: 'Hey there, ' + name + '!' });
    greetings.en.push({ text: name + ', you look great today.' });
    greetings.en.push({ text: 'How can I help, ' + name + '?' });
  }

  return {
    english: function() {
      var item = greetings.en[Math.floor(Math.random() * greetings.en.length)];
      return item;
    }
  };

}]);