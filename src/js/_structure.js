(function () {
    "use strict";

    var structure = {};

    structure.productConstructor = WinJS.UI.Pages.define("./product.html", {
        ready: function (element, options) {
            WinJS.Binding.processAll();
            document.getElementById("button-home").winControl.disabled = false;
            document.getElementById("button-about").winControl.disabled = false;
            document.getElementById("appBar").winControl.closedDisplayMode = 'compact';
            var listView = element.querySelector("#storeResults");
                listView.addEventListener("iteminvoked", function(evt){
                    evt.detail.itemPromise.then(function itemInvoked(item) {
                        Elsie.Search.selectStore(item.data);
                    });
                });
        }
    });

    structure.storeConstructor = WinJS.UI.Pages.define("./store.html", {
        ready: function (element, options) {
            WinJS.Binding.processAll();

            document.getElementById("button-home").winControl.disabled = false;
            document.getElementById("button-about").winControl.disabled = false;
            document.getElementById("appBar").winControl.closedDisplayMode = 'compact';
            
            Elsie.Interface.renderBingMap(element);

            var listView = element.querySelector("#nearbyStores");
                listView.style.height = window.innerHeight - 130 + "px";
                listView.addEventListener("iteminvoked", function(evt){
                    evt.detail.itemPromise.then(function itemInvoked(item) {
                        Elsie.Search.selectStore(item.data);
                    });
                });
        }
    });

    structure.aboutConstructor = WinJS.UI.Pages.define("./about.html", {
        ready: function (element, options) {
            document.getElementById("button-home").winControl.disabled = false;
            document.getElementById("button-about").winControl.disabled = true;
            document.getElementById("appBar").winControl.closedDisplayMode = 'compact';
        }
    });

    structure.homeConstructor = WinJS.UI.Pages.define("./home.html", {
        ready: function (element, options) {
            
            // control size adjustments
            var listHeight = window.innerHeight * 0.895035;
            listHeight = listHeight + "px";
            element.querySelector("#productResults").style.height = listHeight;

            // searchBox bindings
            var searchBox = element.querySelector("#searchBoxId");
            searchBox.addEventListener("keyup", Elsie.Search.requestSuggestions);
            searchBox.addEventListener("focus", function(){
                // global elements
                document.getElementById("appBar").winControl.closedDisplayMode = 'none';

                // home elements
                element.querySelector("#searchBoxContainer").classList.add("win-searchbox-focus");
                element.querySelector("#productResults").style.display = "block";
                element.querySelector("#brand-container").style.display = "none";
                element.querySelector("#mini-brand").style.display = "block";
                element.querySelector("#recent").style.display = "none";
            });
            searchBox.addEventListener("blur", function(){
                if (!Elsie.Data.searchResults || Elsie.Data.searchResults.length == 0){
                    // global elements
                    document.getElementById("appBar").winControl.closedDisplayMode = 'compact';

                    // home elements
                    element.querySelector("#productResults").style.display = "none";
                    element.querySelector("#brand-container").style.display = "block";
                    element.querySelector("#mini-brand").style.display = "none";
                    element.querySelector("#recent").style.display = "block";
                    element.querySelector("#searchBoxContainer").classList.remove("win-searchbox-focus");
                }
            });

            document.getElementById("button-home").winControl.disabled = true;
            document.getElementById("button-about").winControl.disabled = false;
            document.getElementById("appBar").winControl.closedDisplayMode = 'compact';

            // recent products bindings
            var recentProducts = element.querySelector("#recentProducts");
            recentProducts.style.height = window.innerHeight - 200 + "px";
            recentProducts.addEventListener("iteminvoked", function(evt){
                evt.detail.itemPromise.then(function itemInvoked(item) {
                    Elsie.Search.selectSuggestion(item.data.id);
                });
            });

            // results bindings
            var listView = element.querySelector("#productResults");
            listView.addEventListener("iteminvoked", function(evt){
                evt.detail.itemPromise.then(function itemInvoked(item) {
                    Elsie.Search.selectSuggestion(item.data.id);
                });
            });

            Elsie.Search.displayRecentProducts();

        },
    });

    WinJS.Namespace.define("Elsie", {
        Structure: structure
    });
})();