(function () {

    "use strict";    
  
    var ui = {};

    ui.initialize = function(){

        if (typeof Windows !== 'undefined') {
            // WinRT is available
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
            navigator.splashscreen.hide();
    	});
    }

    ui.clickLink = function(url) {
        //navigator.app.loadUrl(url, {openExternal : true});
        window.open(url, '_system');
    };

    ui.clearMessage = function(){

        var statusBox = document.getElementById("status");
        statusBox.innerHTML = "";

    };

    ui.showLocationError = function(text, link){

        var message = text;
        var confirmCallback = function(buttonIndex){
            if (buttonIndex == 2){
                if (link.action == 'getLocation'){
                    Elsie.Services.getLocation();
                }
            }
        };
        var title = "Location error";
        var buttonLabels = ["Cancel", link.label];
        navigator.notification.confirm(message, confirmCallback, title, buttonLabels);

    };

    ui.showApiError = function(text, link){

        var message = text;
        var confirmCallback = function(buttonIndex){
            //nothing
        };
        var title = "Error getting data";
        var buttonLabels = ["OK"];
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
        Elsie.Interface.showLoadingAnimation("Finding your closest stores...");
        Elsie.Services.getClosestStores().then(function(){
            Elsie.Interface.hideLoadingAnimation();
            WinJS.Navigation.navigate("./stores.html");
            document.getElementById("appBar").winControl.hide();
        });
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
            if (!document.getElementById("loading")){
                var progress = document.createElement("progress");
                progress.id = "loading";
                document.getElementById("app").parentNode.appendChild(progress);
            }
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

        var key = "AsAiyJ_zfemVuOamdfw8YgZMIT1mK7n0IxKZ9Z3Ad7GObWRKb2QV_WMjSM8rfZtd";
        var centerPoint = Elsie.Data.selectedStore.latitude + "," + Elsie.Data.selectedStore.longitude;
        var imagerySet = 'Road';
        var mapSize = ((window.innerWidth * 2) - 80) + ',400';
        var pushpin = Elsie.Data.selectedStore.latitude + "," + Elsie.Data.selectedStore.longitude + ";75";
        var zoomLevel = 17;

        var url = "http://dev.virtualearth.net/REST/v1/Imagery/Map/" + imagerySet + "/" + centerPoint + "/"+ zoomLevel +"?mapSize=" + mapSize + "&pushpin=" + pushpin + "&key=" + key + "&format=png";

        var mapObject = "<img src='" + url + "' />";
        element.querySelector("#mapDiv").innerHTML = mapObject;
    
    };

    ui.getDay = function() {
        var today;
        switch (new Date().getDay()) {
            case 0:
                today = "sunday";
                break;
            case 1:
                today = "monday";
                break;
            case 2:
                today = "tuesday";
                break;
            case 3:
                today = "wednesday";
                break;
            case 4:
                today = "thursday";
                break;
            case 5:
                today = "friday";
                break;
            case 6:
                today = "saturday";
                break;
        }
        return today;
    };

    ui.todaysHoursForStore = function(store) {

        var today = ui.getDay();
        var todayOpen = today + "_open";
        var todayClose = today + "_close";

        var todaysHours = {};
        todaysHours.open = store[todayOpen];
        todaysHours.close = store[todayClose];

        return todaysHours;

    };

    ui.isInViewport = function(element) {

        var rect = element.getBoundingClientRect();

        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
        );
        
    };

    // merge these next two functions
    ui.determineStoreOpen = WinJS.Binding.converter(function (store) {

        var todaysHours = ui.todaysHoursForStore(store);

        var now = new Date();
        var minutes_since_midnight = (now.getHours() * 60) + now.getMinutes();

        var result;

        if (todaysHours.open === null || todaysHours.closed === null){
            result = "closed today";
            return result;
        }

        if (minutes_since_midnight >= todaysHours.open && minutes_since_midnight <= todaysHours.close) {
            result = "open right now";
        } else {
            result = "closed right now";
        }

        return result;

    });

    ui.determineStoreResultOpen = WinJS.Binding.converter(function (store) {

        var todaysHours = ui.todaysHoursForStore(store);

        var now = new Date();
        var minutes_since_midnight = (now.getHours() * 60) + now.getMinutes();

        var result;

        if (minutes_since_midnight >= todaysHours.open && minutes_since_midnight <= todaysHours.close) {
            result = "Open";
        } else {
            result = "Closed";
        }

        return result;

    });

    ui.determineTimeToOpenOrClose = WinJS.Binding.converter(function (store) {

        var todaysHours = ui.todaysHoursForStore(store);

        var now = new Date();
        var minutes_since_midnight = (now.getHours() * 60) + now.getMinutes();

        var result;

        // if we are open, we want to return the amount of time until close
        if (minutes_since_midnight >= todaysHours.open && minutes_since_midnight <= todaysHours.close){
            var minutesToClose = todaysHours.close - minutes_since_midnight;
            if (minutesToClose >= 60) {
                // convert to hours
                var hoursToClose = minutesToClose / 60;
                result = hoursToClose.toFixed(1) + " hours until close"; 
            } else {
                result = minutesToClose + " minutes until close";
            }
        } else {
            // we are closed, so we want to return the amount of time until open
            if (todaysHours.open === null || todaysHours.closed === null){
                result = "due to holiday";
                return result;
            }
            if (minutes_since_midnight > todaysHours.open) {
                // we are late in the night, but before midnight
                var minutesToOpen = todaysHours.open + (1440 - minutes_since_midnight);
            } else {
                // we are in the wee hours of the morning
                var minutesToOpen = todaysHours.open - minutes_since_midnight;
            }
            if (minutesToOpen >= 60) {
                // convert to hours
                var hoursToOpen = minutesToOpen / 60;
                result = hoursToOpen.toFixed(1) + " hours until open"; 
            } else {
                result = minutesToOpen + " minutes until open";
            }
        }

        return result;

    });

    ui.determineAvailability = WinJS.Binding.converter(function (number){
        var availability;
        if (number == 0) {
            availability = "sold out";
        } 
        if (number > 0) {
            availability = "rare";
        } 
        if (number > 100) {
            availability = "limited";
        } 
        if (number > 500) {
            availability = "moderate";
        } 
        if (number > 2000) {
            availability = "high";
        } 
        return availability;
    });

    ui.convertMetersToKilometers = WinJS.Binding.converter(function (meters) {
        if (meters >= 1000){
            var kilometers = meters / 1000;
            kilometers = Math.round(kilometers * 100) / 100;
            kilometers = kilometers.toPrecision(3);
            kilometers = kilometers + " km";
            return kilometers;
        } else {
            var meters = meters;
            meters = meters + " metres";
            return meters;
        }
    });

    ui.formatNumber = WinJS.Binding.converter(function (number) {
        if (number > 999) {
            number = (number / 1000).toFixed(1) + "k";
        } else if (number > 999999) {
            number = (number / 1000000).toFixed(1) + "m";
        }
        return number;
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

    ui.formatAddress = WinJS.Binding.converter(function (store) {
        var geoLocation = store.latitude + ',' + store.longitude;
        geoLocation = "maps:" + geoLocation;
        return geoLocation;
    });

    ui.processImage = WinJS.Binding.converter(function (url) {
        if (!url || url == null){
            return 'img/nothumb.png';
        } else {
            return url;
        }
    });

    ui.returnFirstStoreDistance = WinJS.Binding.converter(function (storesArray) {
        if (storesArray.length > 0){
            var closestStore = storesArray[0];
            if (closestStore.distance_in_meters >= 1000){
                var kilometers = closestStore.distance_in_meters / 1000;
                kilometers = Math.round(kilometers * 100) / 100;
                kilometers = kilometers + " km";
                return kilometers;
            } else {
                var meters = closestStore.distance_in_meters;
                meters = meters + " m";
                return meters;
            }
        } else {
            return "none";
        }
    });

    ui.restrictMaxCharacters = WinJS.Binding.converter(function (input){
        var words = input.split(" ");
        var filtered = "";
        for (var i = 0; i < words.length; i++){
            if (i == 0 || filtered.length + words[i].length < 20){
                if (i > 0)
                    filtered = filtered + " ";
                filtered = filtered.concat(words[i]);
            }
        }
        return filtered;
    });

    WinJS.Namespace.define("Elsie", {
        Interface: ui
    });
})();