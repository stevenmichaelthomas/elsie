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
        console.log('deviceready');
        Elsie.Services.getRecentProducts();
        Elsie.Services.loadWatchlist();
        Elsie.Interface.initialize();
        Elsie.Services.initializeLocation();
        Elsie.Services.getLocation();
        Elsie.Services.updateRunNumber();
        if (Elsie.Data.runNumber === 3){
            Elsie.Interface.showReviewDialog();
        }
        app.start();
    }

    // cordova event listeners
    window.onLoad = function(){
        document.addEventListener("deviceready", deviceReady);
        document.addEventListener("resume", Elsie.Services.getLocation);
        document.addEventListener('DOMContentLoaded', function() {
            FastClick.attach(document.body);
        }, false);
    }
    
})();