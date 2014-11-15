(function () {

    "use strict";

    var app = WinJS.Application;

    WinJS.Namespace.define("Elsie", {
        Data: {}
    });

    var deviceReady = function(){
        Elsie.Services.getLocation();
        Elsie.Interface.initialize();
        app.start();
    }

    // cordova event listeners
    window.onLoad = function(){
        document.addEventListener("deviceready", deviceReady);
        document.addEventListener("resume", Elsie.Services.getLocation);
    }
    
})();