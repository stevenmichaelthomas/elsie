(function () {
    "use strict";

    var structure = {};

    structure.productConstructor = WinJS.UI.Pages.define("./product.html", {
        ready: function (element, options) {
            var listViewFilled = false;
            WinJS.Binding.processAll();
            document.getElementById("button-home").winControl.disabled = false;
            document.getElementById("button-about").winControl.disabled = false;
            document.getElementById("button-nearby").winControl.disabled = false;
            document.getElementById("appBar").winControl.closedDisplayMode = 'minimal';
            var listView = element.querySelector("#storeResults");
                listView.style.height = window.innerHeight + "px";
                setTimeout(function(){ 
                    listView.style.height = window.innerHeight - 355 + "px";
                    //listView.winControl.forceLayout();
                }, 750);
                listView.addEventListener("iteminvoked", function(evt){
                    evt.detail.itemPromise.then(function itemInvoked(item) {
                        Elsie.Search.selectStore(item.data);
                    });
                });
                listView.addEventListener("loadingstatechanged", function (args) {
                    if (listView.winControl.loadingState === "complete" && listViewFilled == false){
                        listView.winControl.itemDataSource = Elsie.Lists.nearbyStoresWithProduct.dataSource;
                        listViewFilled = true;
                    }
                });
        },
    });

    structure.storeConstructor = WinJS.UI.Pages.define("./store.html", {
        ready: function (element, options) {
            WinJS.Binding.processAll();
            var listViewFilled = false;

            document.getElementById("button-home").winControl.disabled = false;
            document.getElementById("button-about").winControl.disabled = false;
            document.getElementById("button-nearby").winControl.disabled = false;
            document.getElementById("appBar").winControl.closedDisplayMode = 'minimal';
            
            Elsie.Interface.renderBingMap(element);

            var listView = element.querySelector("#nearbyStores");
                listView.style.height = window.innerHeight - 155 + "px";
                listView.addEventListener("iteminvoked", function(evt){
                    evt.detail.itemPromise.then(function itemInvoked(item) {
                        Elsie.Search.selectStore(item.data);
                    });
                });
                listView.addEventListener("loadingstatechanged", function (args) {
                    if (listView.winControl.loadingState === "complete" && listViewFilled == false){
                        listView.winControl.itemDataSource = Elsie.Lists.nearbyStores.dataSource;
                        listViewFilled = true;
                    }
                });
        }
    });

    structure.aboutConstructor = WinJS.UI.Pages.define("./about.html", {
        ready: function (element, options) {
            document.getElementById("button-home").winControl.disabled = false;
            document.getElementById("button-about").winControl.disabled = true;
            document.getElementById("button-nearby").winControl.disabled = false;
            document.getElementById("appBar").winControl.closedDisplayMode = 'minimal';
        }
    });

    structure.homeConstructor = WinJS.UI.Pages.define("./home.html", {
        ready: function (element, options) {
            
            // control size adjustments
            var listHeight = window.innerHeight - 145;
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
                    document.getElementById("appBar").winControl.closedDisplayMode = 'minimal';

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
            document.getElementById("button-nearby").winControl.disabled = false;
            document.getElementById("appBar").winControl.closedDisplayMode = 'minimal';

            // recent products bindings
            var recentProducts = element.querySelector("#recentProducts");
            recentProducts.style.height = window.innerHeight - 220 + "px";
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

    structure.storesConstructor = WinJS.UI.Pages.define("./stores.html", {
        ready: function (element, options) {
            var listViewFilled = false;

            document.getElementById("button-home").winControl.disabled = false;
            document.getElementById("button-about").winControl.disabled = false;
            document.getElementById("button-nearby").winControl.disabled = true;
            document.getElementById("appBar").winControl.closedDisplayMode = 'minimal';

            // control size adjustments
            var listHeight = window.innerHeight - 75 + "px";
            element.querySelector("#closestStores").style.height = listHeight;

            var listView = element.querySelector("#closestStores");
                listView.addEventListener("iteminvoked", function(evt){
                    evt.detail.itemPromise.then(function itemInvoked(item) {
                        Elsie.Search.selectStore(item.data);
                    });
                });
                listView.addEventListener("loadingstatechanged", function (args) {
                    if (listView.winControl.loadingState === "complete" && listViewFilled == false){
                        listView.winControl.itemDataSource = Elsie.Lists.closestStores.dataSource;
                        listViewFilled = true;
                        //listView.winControl.forceLayout();
                    }
                });
        }
    });

    WinJS.Namespace.define("Elsie", {
        Structure: structure
    });
})();