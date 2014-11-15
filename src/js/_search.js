(function () {
    "use strict";

    var search = {};
    var timer;

    search.getRecentProducts = function() {
        // create a List object
        var itemList = new WinJS.Binding.List(blob.result);
        var productsList = {
            itemList: itemList
        };
        WinJS.Namespace.define("RecentProducts", productsList);
        var listView = document.getElementById("recentProducts").winControl;
        listView.itemDataSource = RecentProducts.itemList.dataSource;
    };

    search.requestSuggestions = function() {
        clearTimeout(timer);
        timer = setTimeout(function(){
            var query = document.getElementById("searchBoxId").value.toLocaleLowerCase();
            Elsie.Services.searchProducts(query).then(function(){
                 // create a List object
                var itemList = new WinJS.Binding.List(Elsie.Data.searchResults);
                var productsList = {
                    itemList: itemList
                };
                WinJS.Namespace.define("SuggestedProducts", productsList);
                var listView = document.getElementById("productResults").winControl;
                listView.itemDataSource = SuggestedProducts.itemList.dataSource;
            });
            //args.detail.setPromise(promise);
            Elsie.Data.query = query;
        },500);
    };

    search.selectSuggestion = function(id) {
        //we chose a product, now let's do something with it
        var productId = id;
        Elsie.Services.findNearbyStoresWithProduct(productId).then(function(){
             // create a List object
            var itemList = new WinJS.Binding.List(Elsie.Data.nearbyStoresWithProduct);
            var storesList = {
                itemList: itemList
            };
            WinJS.Namespace.define("NearbyStoresWithProduct", storesList);
            WinJS.Navigation.navigate("./product.html");
        });
    }

    search.selectStore = function(data) {
        //we chose a store
        var store = data;
        Elsie.Data.selectedStore = store;
        WinJS.Navigation.navigate("./store.html");
    }

    WinJS.Namespace.define("Elsie", {
        Search: search
    });
})();