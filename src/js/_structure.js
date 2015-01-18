(function () {
    "use strict";

    var structure = {};

    structure.homeConstructor = WinJS.UI.Pages.define("./home.html", {
        ready: function (element, options) {

            var recentsFilled = false;
            var tabsFilled = false;

            this.getAnimationElements = function(){
                var elements = [];
                //var wordmark = element.querySelector("#about");
                elements.push(element);
                return elements;
            };

            this.getAnimationElementOffsets = function(){
                var offsets = [];
                var wholepage = { top: "-50px", left: "0" };
                offsets.push(wholepage);
                return offsets;
            };

            var goBackHome = function(){
                element.querySelector("#cancel").style.opacity = '0';
                element.querySelector("#cancel").style.zIndex = '999';
                element.classList.remove("search-mode");
            }
            
            // control size adjustments
            var listHeight = window.innerHeight - 193;
            listHeight = listHeight + "px";
            element.querySelector("#productResults").style.height = listHeight;

            // searchBox bindings
            var searchBox = element.querySelector("#searchBoxId");
            searchBox.addEventListener("keyup", Elsie.Search.requestSuggestions);
            searchBox.addEventListener("focus", function(){
                document.getElementById("appBar").winControl.closedDisplayMode = 'none';
                element.querySelector("#cancel").style.opacity = '1';
                element.querySelector("#cancel").style.zIndex = '1002';
                element.classList.add("search-mode");
            });
            searchBox.addEventListener("blur", function(){
                if (!Elsie.Data.searchResults || Elsie.Data.searchResults.length === 0 || this.value === ""){
                    goBackHome();
                }
                setTimeout(function(){
                    document.getElementById("appBar").winControl.closedDisplayMode = 'minimal';
                }, 750);
            });

            var cancelButton = element.querySelector("#cancel");
            cancelButton.addEventListener("click", function(){
                searchBox.value = "";
            });

            document.getElementById("button-home").winControl.disabled = true;
            document.getElementById("button-about").winControl.disabled = false;
            document.getElementById("button-nearby").winControl.disabled = false;
            document.getElementById("appBar").winControl.closedDisplayMode = 'minimal';
            StatusBar.styleLightContent();

            // recent products bindings
            var recentProducts = element.querySelector("#recentProducts");
            recentProducts.style.height = window.innerHeight - 215 + "px";
            recentProducts.addEventListener("loadingstatechanged", function(){
                if (recentProducts.winControl.loadingState === "complete"){
                    if (recentsFilled == false) {
                        if (Elsie.Data.recentProducts) {
                            var itemList = new WinJS.Binding.List(Elsie.Data.recentProducts);
                            element.querySelector("#no-recents").style.display = "none";
                        } else {
                            var itemList = new WinJS.Binding.List([]);
                            element.querySelector("#no-recents").style.display = "block";
                        }
                        Elsie.Lists.recentProducts = itemList;
                        recentProducts.winControl.itemDataSource = Elsie.Lists.recentProducts.dataSource;
                        recentsFilled = true;
                    } else {
                        var i = -1;
                        var images = document.getElementsByClassName("listItem-Image");
                        (function fadeIn() {
                            if (i++ === images.length - 1) return;
                            setTimeout(function() {
                                if (images[i]) {
                                    images[i].style.opacity = 1;
                                    fadeIn();
                                }
                            }, 50);
                        })();
                    }
                }
            });
            recentProducts.addEventListener("iteminvoked", function(evt){
                evt.detail.itemPromise.then(function itemInvoked(item) {
                    Elsie.Search.selectSuggestion(item.data.id);
                });
            });
            recentProducts.addEventListener("contentanimating", function (e) { e.preventDefault() });  

            // tabs bindings
            var tabGrid = element.querySelector("#tabGrid");
            //tabGrid.style.height = window.innerHeight - 215 + "px";
            tabGrid.addEventListener("loadingstatechanged", function(){
                if (tabGrid.winControl.loadingState === "complete"){
                    if (tabsFilled == false) {
                        if (Elsie.Data.watchlistProducts.length > 0) {
                            element.querySelectorAll(".loader")[0].style.display = "block";
                            Elsie.Services.refreshWatchlistData().then(function() {
                              var itemList = new WinJS.Binding.List(Elsie.Data.watchlistProducts);
                              element.querySelectorAll(".loader")[0].style.display = "block";
                              element.querySelector("#no-tabs").style.display = "none";
                              Elsie.Lists.watchlistProducts = itemList;
                              tabGrid.winControl.itemDataSource = Elsie.Lists.watchlistProducts.dataSource;
                              tabsFilled = true;
                            });
                        } else {
                            var itemList = new WinJS.Binding.List([]);
                            element.querySelector("#no-tabs").style.display = "block";
                            Elsie.Lists.watchlistProducts = itemList;
                            tabGrid.winControl.itemDataSource = Elsie.Lists.watchlistProducts.dataSource;
                            tabsFilled = true;
                        }
                    } else {
                        var i = -1;
                        var images = document.getElementsByClassName("listItem-Image");
                        (function fadeIn() {
                            if (i++ === images.length - 1) return;
                            setTimeout(function() {
                                if (images[i]) {
                                    images[i].style.opacity = 1;
                                    fadeIn();
                                }
                            }, 50);
                        })();
                    }
                }
            });
            tabGrid.addEventListener("iteminvoked", function(evt){
                evt.detail.itemPromise.then(function itemInvoked(item) {
                    Elsie.Search.selectSuggestion(item.data.id);
                });
            });
            tabGrid.addEventListener("contentanimating", function (e) { e.preventDefault() });
            //element.querySelectorAll(".updated")[0].innerText = Elsie.Data.lastWatchlistRefresh;

            // results bindings
            var listView = element.querySelector("#productResults");
            listView.addEventListener("iteminvoked", function(evt){
                evt.detail.itemPromise.then(function itemInvoked(item) {
                    Elsie.Search.selectSuggestion(item.data.id);
                });
            });
            listView.addEventListener("loadingstatechanged", function(){
                if (listView.winControl.loadingState === "complete"){
                    var i = -1;
                    var images = document.getElementsByClassName("listItem-Image");
                    (function fadeIn() {
                        if (i++ === images.length - 1) return;
                        setTimeout(function() {
                            if (images[i]) {
                                images[i].style.opacity = 1;
                                fadeIn();
                            }
                        }, 50);
                    })();
                }
            });
            //listView.addEventListener("contentanimating", function (e) { e.preventDefault() });  

            if (element.style.visibility === 'hidden'){
                element.style.visibility = 'visible';
            }

        },
    });

    structure.productConstructor = WinJS.UI.Pages.define("./product.html", {

        ready: function (element, options) {
            var listViewFilled = false;
            var similarViewFilled = false;

            var handleStock = function(){
                if (Elsie.Data.nearbyStoresWithProduct.length === 0){
                    document.getElementById("noStock").style.display = "block";
                    document.getElementById("storeResults").style.display = "none";
                } else {
                    document.getElementById("noStock").style.display = "none";
                    document.getElementById("storeResults").style.display = "block";
                }
            };

            var handleSimilar = function(){
                if (Elsie.Data.similarProducts.length === 0){
                    document.getElementById("noSimilar").style.display = "block";
                    document.getElementById("storeResults").style.display = "none";
                } else {
                    document.getElementById("noSimilar").style.display = "none";
                    document.getElementById("storeResults").style.display = "block";
                }
            };

            WinJS.Binding.processAll();

            document.getElementById("button-home").winControl.disabled = false;
            document.getElementById("button-about").winControl.disabled = false;
            document.getElementById("button-nearby").winControl.disabled = false;
            document.getElementById("appBar").winControl.closedDisplayMode = 'minimal';

            var watchlist = element.querySelectorAll(".watchlist")[0];
            watchlist.addEventListener("click", function(){
                var result = Elsie.Services.changeProductWatchStatus(Elsie.Data.selectedProductWithStores);
                if (result === "added"){
                    watchlist.classList.add("on");
                } else if (result === "removed"){
                    watchlist.classList.remove("on");
                }
            });
            var result = Elsie.Services.checkWatchlistForProduct(Elsie.Data.selectedProduct);
            if (result === true){
                watchlist.classList.add("on");
            };

            element.querySelectorAll(".win-pivot-item-content")[0].addEventListener("scroll", function(){
                var end = document.querySelector("#product-end");
                if (Elsie.Interface.isInViewport(end)) {
                    document.querySelectorAll(".win-viewport")[0].style.overflowY = "auto";
                } else {
                    document.querySelectorAll(".win-viewport")[0].style.overflowY = "hidden";
                }
            });
            var listView = element.querySelector("#storeResults");
            var similarView = element.querySelector("#similarProducts");
                listView.addEventListener("iteminvoked", function(evt){
                    evt.detail.itemPromise.then(function itemInvoked(item) {
                        Elsie.Search.selectStore(item.data);
                    });
                });
                listView.addEventListener("loadingstatechanged", function (args) {
                    if (listView.winControl.loadingState === "complete" && listViewFilled == false){
                        listView.winControl.itemDataSource = Elsie.Lists.nearbyStoresWithProduct.dataSource;
                        setTimeout(function(){ 
                            listView.style.height = window.innerHeight - 180 + "px"; 
                            similarView.style.height = window.innerHeight - 170 + "px";
                            document.querySelectorAll(".win-viewport")[0].style.overflowY = "hidden";
                        }, 1000);
                        listViewFilled = true;
                    }
                });
                similarView.addEventListener("iteminvoked", function(evt){
                    evt.detail.itemPromise.then(function itemInvoked(item) {
                        Elsie.Search.selectSuggestion(item.data.id);
                    });
                });
                similarView.addEventListener("loadingstatechanged", function (args) {
                    if (similarView.winControl.loadingState === "complete"){
                        if (similarViewFilled == false) {
                            similarView.winControl.itemDataSource = Elsie.Lists.similarProducts.dataSource;
                            similarViewFilled = true;
                        } else {
                            var i = -1;
                            var images = document.getElementsByClassName("listItem-Image");
                            (function fadeIn() {
                                if (i++ === images.length - 1) return;
                                setTimeout(function() {
                                    if (images[i]) {
                                        images[i].style.opacity = 1;
                                        fadeIn();
                                    }
                                }, 50);
                            })();
                        }
                    }
                });

            handleSimilar();
            handleStock();
        },
    });

    structure.storeConstructor = WinJS.UI.Pages.define("./store.html", {
        ready: function (element, options) {
            
            Elsie.Interface.renderBingMap(element);
            
            var listViewFilled = false;

            document.getElementById("button-home").winControl.disabled = false;
            document.getElementById("button-about").winControl.disabled = false;
            document.getElementById("button-nearby").winControl.disabled = false;
            document.getElementById("appBar").winControl.closedDisplayMode = 'minimal';
            
            setTimeout(function(){
                WinJS.Binding.processAll().then(function(){
                  var facts = element.querySelectorAll(".fact");
                  /*for (var fact = 0; fact < facts.length; fact++){
                    facts[fact].style.opacity = 1;
                  }*/
                  var fact = -1;

                    (function next() {
                        if (fact++ === facts.length - 1) return;

                        setTimeout(function() {
                            facts[fact].style.opacity = 1;
                            next();
                        }, 100);
                    })();

                });
            }, 400);

            Elsie.Data.storeInventoryQuery = [];
            var itemList = new WinJS.Binding.List(Elsie.Data.storeInventoryQuery);
            Elsie.Lists.storeInventoryQuery = itemList;

            var storePivot = element.querySelector("#storePivot").winControl;
                storePivot.title =  "Store " + Elsie.Data.selectedStore.store_no + " - " + Elsie.Data.selectedStore.name;

            var inventory = element.querySelector("#storeInventory");
                inventory.style.height = window.innerHeight - 227 + "px";
                inventory.addEventListener("iteminvoked", function(evt){
                    evt.detail.itemPromise.then(function itemInvoked(item) {
                        Elsie.Search.selectSuggestion(item.data.id);
                    });
                });

            var searchBox = element.querySelector("#searchInventory");
                searchBox.addEventListener("keyup", Elsie.Search.searchInventory);
                searchBox.addEventListener("focus", function(){
                    document.getElementById("appBar").winControl.closedDisplayMode = 'none';
                    element.classList.add("search-mode");
                    var explanation = document.getElementById("explanation");
                    explanation.style.display = "none";
                    element.querySelector("#cancel").style.opacity = '1';
                    element.querySelector("#cancel").style.zIndex = '1002';
                });
                searchBox.addEventListener("blur", function(){
                    setTimeout(function(){
                        document.getElementById("appBar").winControl.closedDisplayMode = 'compact';
                    }, 750);
                    element.classList.remove("search-mode");
                    element.querySelector("#cancel").style.opacity = '0';
                    element.querySelector("#cancel").style.zIndex = '999';
                });

            var cancelButton = element.querySelector("#cancel");
            cancelButton.addEventListener("click", function(){
                searchBox.value = "";
            });
        }
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
            //StatusBar.styleLightContent();

            this.getAnimationElements = function(){
                var elements = [];
                //var wordmark = element.querySelector("#about");
                elements.push(element);
                return elements;
            };

            this.getAnimationElementOffsets = function(){
                var offsets = [];
                var wholepage = { top: "200px", left: "0" };
                offsets.push(wholepage);
                return offsets;
            };

            /*var wordmark = element.querySelector("#about");
            setTimeout(function(){
                wordmark.style.opacity = "1";
            }, 150);*/
         }
     });

    WinJS.Namespace.define("Elsie", {
        Structure: structure
    });
})();