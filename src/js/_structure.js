(function () {
    "use strict";

    var structure = {};

    structure.productConstructor = WinJS.UI.Pages.define("./product.html", {
        ready: function (element, options) {
            WinJS.Binding.processAll();
            document.getElementById("button-home").winControl.disabled = false;
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
        }
    });

    structure.homeConstructor = WinJS.UI.Pages.define("./home.html", {
        ready: function (element, options) {
            
            // control size adjustments
            var listHeight = window.innerHeight - 56;
            listHeight = listHeight + "px";
            element.querySelector("#productResults").style.height = listHeight;

            // searchBox bindings
            var searchBox = element.querySelector("#searchBoxId");
            searchBox.addEventListener("keyup", Elsie.Search.requestSuggestions);
            searchBox.addEventListener("focus", function(){
                element.querySelector("#searchBoxContainer").classList.add("win-searchbox-focus");
                element.querySelector("#productResults").style.display = "block";
                element.querySelector("#brand").style.display = "none";
                element.querySelector("#recent").style.display = "none";
            });
            searchBox.addEventListener("blur", function(){
                if (!Elsie.Data.searchResults || Elsie.Data.searchResults.length == 0){
                    element.querySelector("#productResults").style.display = "none";
                    element.querySelector("#brand").style.display = "block";
                    element.querySelector("#recent").style.display = "block";
                    element.querySelector("#searchBoxContainer").classList.remove("win-searchbox-focus");
                }
            });

            document.getElementById("button-home").winControl.disabled = true;

            // recent products bindings
            var recentProducts = element.querySelector("#recentProducts");
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