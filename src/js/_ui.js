(function () {

    "use strict";    
  
    var ui = {};

    ui.initialize = function(){

        if (typeof Windows !== 'undefined') {
            Windows.UI.ViewManagement.StatusBar.getForCurrentView().showAsync();
        }

    	WinJS.UI.processAll().then(function(){
            ui.goHome();            
            document.getElementById("button-home").addEventListener("click", ui.goHome);
            document.getElementById("button-about").addEventListener("click", ui.goAbout);
    	});
    }

    ui.clearMessage = function(){

        var statusBox = document.getElementById("status");
        statusBox.innerHTML = "";

    };

    ui.displayDialog = function(text, link){

        var message = text;
        var confirmCallback = function(buttonIndex){
            if (buttonIndex == 2){
                if (link.action == 'getLocation'){
                    Elsie.Services.getLocation();
                }
            } else {
                //var homeText = "Elsie couldn't get your location. :(";
                //var homeLink = { label: "Retry", action: Elsie.Services.getLocation };
                //ui.displayHomeMessage(homeText, homeLink);
            }
        };
        var title = "Location error";
        var buttonLabels = ["Cancel", link.label];
        navigator.notification.confirm(message, confirmCallback, title, buttonLabels);

    };

    ui.displayHomeMessage = function(text, link){

        ui.clearMessage();

        var statusBox = document.getElementById("status");
        var message = document.createElement("p");
        var messageText = document.createTextNode(text);
        message.appendChild(messageText);

        // link: label, link: action
        var linkButton = document.createElement("button");
        linkButton.innerText = link.label;
        linkButton.addEventListener("click", link.action);

        statusBox.appendChild(message);
        statusBox.appendChild(linkButton);

    };

    ui.goHome = function(){
        WinJS.Navigation.navigate('./home.html');
        document.getElementById("appBar").winControl.hide();
    };

    ui.goAbout = function(){
        WinJS.Navigation.navigate('./about.html');
        document.getElementById("appBar").winControl.hide();
    };

    ui.showLoadingAnimation = function(){
        // this will probably not work on platforms other than winRT
        var progress = document.createElement("progress");
        progress.id = "loading";
        document.getElementById("app").appendChild(progress);
    };

    ui.hideLoadingAnimation = function(){
        if(document.getElementById("loading")){
            document.getElementById("loading").remove();
        }
    };

    ui.convertMetersToKilometers = WinJS.Binding.converter(function (meters) {
        var kilometers = meters / 1000;
        kilometers = Math.round(kilometers * 100) / 100;
        kilometers = kilometers + " km";
        return kilometers;
    });

    WinJS.Namespace.define("Elsie", {
        Interface: ui
    });
})();