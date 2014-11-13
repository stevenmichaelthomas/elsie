(function () {
    "use strict";

    var structure = {};

    structure.productConstructor = WinJS.UI.Pages.define("./product.html", {
        // This function is called after the page control contents 
        // have been loaded, controls have been activated, and 
        // the resulting elements have been parented to the DOM. 
        ready: function (element, options) {
        	 console.log('product page is go!')
            WinJS.Binding.processAll();
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
            console.log('store page is go!');
            WinJS.Binding.processAll();
        }
    });

    structure.homeConstructor = WinJS.UI.Pages.define("./home.html", {
        ready: function (element, options) {
        	console.log('home page is go!');
            var listHeight = window.innerHeight - 56;
            listHeight = listHeight + "px";
            element.querySelector("#productResults").style.height = listHeight;
            var searchBox = element.querySelector("#searchBoxId");
            searchBox.addEventListener("keyup", Elsie.Search.requestSuggestions);
            searchBox.addEventListener("focus", function(){
                element.querySelector("#searchBoxContainer").classList.add("win-searchbox-focus");
                element.querySelector("#brand").style.display = "none";
            });
            searchBox.addEventListener("blur", function(){
                if (!Elsie.Data.searchResults){
                    element.querySelector("#brand").style.display = "block";
                    element.querySelector("#searchBoxContainer").classList.remove("win-searchbox-focus");
                }
            });
            var listView = element.querySelector("#productResults");
            listView.addEventListener("iteminvoked", function(evt){
                evt.detail.itemPromise.then(function itemInvoked(item) {
                    Elsie.Search.selectSuggestion(item.data.id);
                });
            });
        },
    });

    WinJS.Namespace.define("Elsie", {
        Structure: structure
    });
})();