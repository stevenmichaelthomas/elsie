var app = WinJS.Application;

var deviceReady = function(){
    services.getLocation();
    ui.init();
    app.start();
}

var onLoad = function(){
    document.addEventListener("deviceready", deviceReady);
}
