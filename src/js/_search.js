(function () {
    "use strict";

    var search = {};

    search.requestSuggestions = function() {
        var query = document.getElementById("searchBoxId").value.toLocaleLowerCase();
        var promise = Elsie.Services.searchProducts(query);
        if (query.length > 0){
            Elsie.Services.searchProducts(query).then(function(){
                 // create a List object
                var itemList = new WinJS.Binding.List(Elsie.Data.searchResults);
                var productsList = {
                    itemList: itemList
                };
                WinJS.Namespace.define("SuggestedProducts", productsList);
                //itemDataSource: SuggestedProducts.itemList.dataSource
                var listView = document.getElementById("productResults").winControl;
                listView.itemDataSource = SuggestedProducts.itemList.dataSource;
            });
        }
        //args.detail.setPromise(promise);
        Elsie.Data.query = query;
    }

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