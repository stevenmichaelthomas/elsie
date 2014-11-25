(function () {
    "use strict";

    var search = {};
    var timer;

    search.displayRecentProducts = function() {
        if (Elsie.Data.recentProducts){
            document.getElementById("recent").style.display = "block";
            var itemList = new WinJS.Binding.List(Elsie.Data.recentProducts);
            var productsList = {
                itemList: itemList
            };
            WinJS.Namespace.define("RecentProducts", productsList);
            var listView = document.getElementById("recentProducts").winControl;
            listView.itemDataSource = RecentProducts.itemList.dataSource;
        }
    };

    search.requestSuggestions = function() {
        Elsie.Interface.hideLoadingAnimation();
        clearTimeout(timer);
        timer = setTimeout(function(){
            Elsie.Interface.showLoadingAnimation("Searching LCBO product...");
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
                Elsie.Interface.hideLoadingAnimation();
            });
            //args.detail.setPromise(promise);
            Elsie.Data.query = query;
        },500);
    };

    search.selectSuggestion = function(id) {
        //we chose a product, now let's do something with it
        clearTimeout(timer);
        var productId = id;
        Elsie.Interface.showLoadingAnimation("Getting product details...");
        Elsie.Services.findNearbyStoresWithProduct(productId).then(function(){
             // create a List object
            var itemList = new WinJS.Binding.List(Elsie.Data.nearbyStoresWithProduct);
            var storesList = {
                itemList: itemList
            };
            Elsie.Interface.hideLoadingAnimation();
            WinJS.Namespace.define("NearbyStoresWithProduct", storesList);
            WinJS.Navigation.navigate("./product.html");
        });
    }

    search.selectStore = function(data) {
        //we chose a store
        Elsie.Interface.showLoadingAnimation("Looking up that store...");
        var store = data;
        Elsie.Data.selectedStore = store;
        var storeLocation = {
            latitude: Elsie.Data.selectedStore.latitude,
            longitude: Elsie.Data.selectedStore.longitude,
        };
        Elsie.Services.getNearbyStores(storeLocation).then(function(){
            //Elsie.Data.nearbyStores
            var itemList = new WinJS.Binding.List(Elsie.Data.nearbyStores);
            var storesList = {
                itemList: itemList
            };
            Elsie.Interface.hideLoadingAnimation();
            WinJS.Namespace.define("NearbyStoresToStore", storesList);
            WinJS.Navigation.navigate("./store.html");
        });
    }

    WinJS.Namespace.define("Elsie", {
        Search: search
    });
})();