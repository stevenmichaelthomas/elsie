(function () {

    "use strict";

    var app = WinJS.Application;

    WinJS.Namespace.define("Elsie", {
        Data: {
        },
        Lists: {
        }
    });

    var deviceReady = function(){
        Elsie.Services.getRecentProducts();
        Elsie.Interface.initialize();
        Elsie.Services.initializeLocation();
        Elsie.Services.getLocation();
        app.start();
    }

    // cordova event listeners
    window.onLoad = function(){
        document.addEventListener("deviceready", deviceReady);
        document.addEventListener("resume", Elsie.Services.getLocation);
    }
    
})();