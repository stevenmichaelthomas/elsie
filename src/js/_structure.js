(function () {
    "use strict";

    var structure = {};

    structure.homeConstructor = WinJS.UI.Pages.define("./home.html", {
        ready: function (element, options) {

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
                if (!Elsie.Data.recentProducts) {
                    element.querySelector("#recent").style.display = "none";
                    element.querySelector("#explanation").style.display = "block";
                } else {
                    element.querySelector("#recent").style.display = "block";
                    element.querySelector("#explanation").style.display = "none";
                }
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
                    document.getElementById("appBar").winControl.closedDisplayMode = 'compact';
                }, 750);
            });

            var cancelButton = element.querySelector("#cancel");
            cancelButton.addEventListener("click", function(){
                searchBox.value = "";
                goBackHome();
            });

            document.getElementById("button-home").winControl.disabled = true;
            document.getElementById("button-about").winControl.disabled = false;
            document.getElementById("button-nearby").winControl.disabled = false;
            document.getElementById("appBar").winControl.closedDisplayMode = 'compact';
            StatusBar.styleLightContent();

            //first run handling
            if (!Elsie.Data.recentProducts) {
                element.querySelector("#recent").style.display = "none";
                element.querySelector("#explanation").style.display = "block";
            } else {
                element.querySelector("#recent").style.display = "block";
                element.querySelector("#explanation").style.display = "none";
            }

            // recent products bindings
            var recentProducts = element.querySelector("#recentProducts");
            recentProducts.style.height = window.innerHeight - 215 + "px";
            recentProducts.addEventListener("loadingstatechanged", function(){
                if (recentProducts.winControl.loadingState === "complete"){
                    var i = -1;
                    var images = document.getElementsByClassName("listItem-Image");
                    (function fadeIn() {
                        if (i++ === images.length - 1) return;
                        setTimeout(function() {
                            images[i].style.opacity = 1;
                            fadeIn();
                        }, 50);
                    })();
                }
            });
            recentProducts.addEventListener("iteminvoked", function(evt){
                evt.detail.itemPromise.then(function itemInvoked(item) {
                    Elsie.Search.selectSuggestion(item.data.id);
                });
            });
            recentProducts.addEventListener("contentanimating", function (e) { e.preventDefault() });  

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
                            images[i].style.opacity = 1;
                            fadeIn();
                        }, 50);
                    })();
                }
            });
            //listView.addEventListener("contentanimating", function (e) { e.preventDefault() });  


            if (element.style.visibility === 'hidden'){
                element.style.visibility = 'visible';
            }

            Elsie.Search.displayRecentProducts();

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
                            listView.style.height = window.innerHeight - 355 + "px"; 
                            similarView.style.height = window.innerHeight - 155 + "px";
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
                                    images[i].style.opacity = 1;
                                    fadeIn();
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
                        if (fact++ >= facts.length) return;

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

            var inventory = element.querySelector("#storeInventory");
                inventory.style.height = window.innerHeight - 227 + "px";
                inventory.addEventListener("iteminvoked", function(evt){
                    evt.detail.itemPromise.then(function itemInvoked(item) {
                        Elsie.Search.selectSuggestion(item.data.id);
                    });
                });

            var searchBox = element.querySelector("#searchInventory");
                searchBox.addEventListener("keyup", Elsie.Search.searchInventory);
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

    WinJS.Namespace.define("Elsie", {
        Structure: structure
    });
})();