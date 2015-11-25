angular.module('elsie')
.filter('percentage', ['$filter', function ($filter) {
  return function (input, decimals) {
    return $filter('number')(input / 100, decimals) + '%';
  };
}])
.filter('pretty', function() {
  return function(number) {
    var abs;
    if (number !== void 0) {
      abs = Math.abs(number);
      if (abs >= Math.pow(10, 12)) {
        number = (number / Math.pow(10, 12)).toFixed(1) + "t";
      } else if (abs < Math.pow(10, 12) && abs >= Math.pow(10, 9)) {
        number = (number / Math.pow(10, 9)).toFixed(1) + "b";
      } else if (abs < Math.pow(10, 9) && abs >= Math.pow(10, 6)) {
        number = (number / Math.pow(10, 6)).toFixed(1) + "m";
      } else if (abs < Math.pow(10, 6) && abs >= Math.pow(10, 3)) {
        number = (number / Math.pow(10, 3)).toFixed(1) + "k";
      }
      return number;
    }
  };
})
.filter('distance', function () {
  return function (input) {
    if (input >= 1000) {
      return (input / 1000).toFixed(2) + 'km';
    } else {
      return input + 'm';
    }
  };
})
.filter('prettyHour', function() {
  return function(msm) {
    console.log('msm', msm);
    var msmTo24time = function(m) {
      var hour = m / 60;
      var mins = m % 60;
      if (mins.toString().length === 1){
        mins = mins.toString() + '0';
      }
      return [hour, mins];
    };
    var time = msmTo24time(msm);
    var h24  = time[0];
    var h12  = (0 === h24 ? 12 : (h24 > 12 ? (h24 - 10) - 2 : h24));
    var ampm = (h24 >= 12 ? 'pm' : 'am');
    console.log(h12 + ':' + time[1] + ampm);
    return h12 + ':' + time[1] + ampm;
  };
});