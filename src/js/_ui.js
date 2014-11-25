(function () {

    "use strict";    
  
    var ui = {};

    ui.initialize = function(){

        if (typeof Windows !== 'undefined') {
            var statusBar = Windows.UI.ViewManagement.StatusBar.getForCurrentView();
            statusBar.backgroundColor = {a: 255, r: 103, g: 65, b: 114};
            statusBar.backgroundOpacity = 1;
            statusBar.showAsync();
        }

    	WinJS.UI.processAll().then(function(){
            ui.goHome();            
            document.getElementById("button-home").addEventListener("click", ui.goHome);
            document.getElementById("button-about").addEventListener("click", ui.goAbout);
            document.getElementById("button-nearby").addEventListener("click", ui.goNearbyStores);
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

    ui.goNearbyStores = function(){
        if (Elsie.Data.location){
            Elsie.Interface.showLoadingAnimation("Finding your closest stores...");
            Elsie.Services.getNearbyStores(Elsie.Data.location).then(function(){
                //Elsie.Data.nearbyStores
                var itemList = new WinJS.Binding.List(Elsie.Data.nearbyStores);
                var storesList = {
                    itemList: itemList
                };
                Elsie.Interface.hideLoadingAnimation();
                WinJS.Namespace.define("ClosestStores", storesList);
                WinJS.Navigation.navigate("./stores.html");
                document.getElementById("appBar").winControl.hide();
            });
        }
    };

    ui.showLoadingAnimation = function(text){
        if (typeof Windows !== 'undefined') {
            var statusBar = Windows.UI.ViewManagement.StatusBar.getForCurrentView();
            if (text){
                statusBar.progressIndicator.text = text;
            }
            statusBar.progressIndicator.showAsync();
        } else {
            var progress = document.createElement("progress");
            progress.id = "loading";
            document.getElementById("app").appendChild(progress);
        }
    };

    ui.hideLoadingAnimation = function(){
        if (typeof Windows !== 'undefined') {
            var statusBar = Windows.UI.ViewManagement.StatusBar.getForCurrentView();
            statusBar.progressIndicator.text = '';
            statusBar.progressIndicator.hideAsync();
        } else {
            var loader = document.getElementById("loading");
            if(loader){
                loader.parentNode.removeChild(loader);
            }
        }
    };

    ui.renderBingMap = function(element){

        var key = "AnafmzzTy228kzIf7tq7FjhJ52k1U7PmiR76KVnDdZdftx6OwmjoJs2fxTtm3DmI";
        var centerPoint = Elsie.Data.selectedStore.latitude + "," + Elsie.Data.selectedStore.longitude;
        var imagerySet = 'Road';
        var mapSize = ((window.innerWidth * 2) - 80) + ',400';
        var pushpin = Elsie.Data.selectedStore.latitude + "," + Elsie.Data.selectedStore.longitude + ";75";
        var zoomLevel = 17;

        var url = "http://dev.virtualearth.net/REST/v1/Imagery/Map/" + imagerySet + "/" + centerPoint + "/"+ zoomLevel +"?mapSize=" + mapSize + "&pushpin=" + pushpin + "&key=" + key + "&format=png";

        var mapObject = "<img src='" + url + "' />";
        element.querySelector("#mapDiv").innerHTML = mapObject;
    
    };

    ui.convertMetersToKilometers = WinJS.Binding.converter(function (meters) {
        var kilometers = meters / 1000;
        kilometers = Math.round(kilometers * 100) / 100;
        kilometers = kilometers + " km";
        return kilometers;
    });

    ui.convertABVtoPercentage = WinJS.Binding.converter(function (abv) {
        var abv_percentage = abv / 100;
        abv_percentage = abv_percentage + "%";
        return abv_percentage;
    });

    ui.convertCentsToDollars = WinJS.Binding.converter(function (cents) {
        var dollars = cents / 100;
        dollars = dollars.toFixed(2);
        dollars = "$" + dollars;
        return dollars;
    });

    ui.formatTelephoneNumber = WinJS.Binding.converter(function (rawNumber) {
        var prettyNumber = rawNumber.replace(/\D/g,'');
        prettyNumber = "tel:" + prettyNumber;
        return prettyNumber;
    });

    WinJS.Namespace.define("Elsie", {
        Interface: ui
    });
})();