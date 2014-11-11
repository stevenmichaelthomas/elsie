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
                document.getElementById("searchBoxContainer").classList.add("win-searchbox-focus")
            });
            searchBox.addEventListener("blur", function(){
                document.getElementById("searchBoxContainer").classList.remove("win-searchbox-focus")
            });
            //searchBox.addEventListener("resultsuggestionchosen", search.selectSuggestion);
        },
    });

    WinJS.Namespace.define("Elsie", {
        Structure: structure
    });
})();