(function () {

    "use strict";    
  
    var ui = {};

    ui.initialize = function(){

    	WinJS.UI.processAll().then(function(){
    		WinJS.Navigation.navigate('./home.html');
    	});
    }

    ui.clearMessage = function(){

        var statusBox = document.getElementById("status");
        statusBox.innerHTML = "";

    };

    ui.displayMessage = function(text, link){

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

    WinJS.Namespace.define("Elsie", {
        Interface: ui
    });
})();