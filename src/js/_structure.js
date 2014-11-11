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
        }

    });

    structure.homeConstructor = WinJS.UI.Pages.define("./home.html", {
        ready: function (element, options) {
        	console.log('home page is go!');
            var searchBox = document.getElementById("searchBoxId");
            searchBox.addEventListener("keyup", Elsie.Search.requestSuggestions);
            searchBox.addEventListener("focus", function(){
                document.getElementById("searchBoxContainer").classList.add("win-searchbox-focus");
                document.getElementById("brand").style.display = "none";
            });
            searchBox.addEventListener("blur", function(){
                if (!Elsie.Data.searchResults){
                    document.getElementById("brand").style.display = "block";
                    document.getElementById("searchBoxContainer").classList.remove("win-searchbox-focus");
                }
            });
            var listView = document.getElementById("productResults").winControl;
            listView.addEventListener("iteminvoked", function(evt){
                    //console.log(evt.detail.itemPromise);
                    //console.log(evt.detail.itemPromise._value.data.id);
                    //Elsie.Search.selectSuggestion(evt.detail.itemPromise._value.data.id);
                    evt.detail.itemPromise.then(function itemInvoked(item) {
                        Elsie.Search.selectSuggestion(item.data.id)
                    });
                });
            //searchBox.addEventListener("resultsuggestionchosen", search.selectSuggestion);
        },
    });

    WinJS.Namespace.define("Elsie", {
        Structure: structure
    });
})();