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
            listView.forceLayout();
        }
    };

    search.requestSuggestions = function() {
        Elsie.Interface.hideLoadingAnimation();
        clearTimeout(timer);
        timer = setTimeout(function(){
            Elsie.Interface.showLoadingAnimation("Searching LCBO products...");
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
        //clearTimeout(timer);
        var productId = id;
        Elsie.Interface.showLoadingAnimation("Getting product details...");
        Elsie.Services.findNearbyStoresWithProduct(productId).then(function(){
            Elsie.Search.determineSimilar().then(function(){
                Elsie.Services.querySimilarProducts(Elsie.Data.similarProductsSearchString).then(function(){
                    Elsie.Interface.hideLoadingAnimation();
                    WinJS.Navigation.navigate("./product.html");
                })
            });
        });
    }

    /*  so this method is kind of silly. but its intended purpose is to serve
        as a stopgop until LCBO API v2 launches in all its glory with a similarProducts endpoint. */
    search.determineSimilar = function(){
        return new WinJS.Promise(function (complete) {
            if (Elsie.Data.selectedProduct){
                var tags = Elsie.Data.selectedProduct.tags;
                tags = tags.split(" ");

                var productName = Elsie.Data.selectedProduct.name;
                productName = productName.toLocaleLowerCase();

                for (var i = tags.length; i--; ) {
                   // refine!
                   // remove silly, short tags
                   if (tags[i].length < 4) tags.splice(i, 1);

                   // remove tags which are part of the product name
                   if (productName.search(tags[i]) !== -1) tags.splice(i, 1);

                   // arbitrarily, remove all these other generic tags
                   if (tags[i] === 'beer') tags.splice(i, 1);
                   if (tags[i] === 'wine') tags.splice(i, 1);
                   if (tags[i] === 'lager') tags.splice(i, 1);
                   if (tags[i] === 'bottle') tags.splice(i, 1);
                   if (tags[i] === 'natural') tags.splice(i, 1);
                   if (tags[i] === 'ontario') tags.splice(i, 1);
                   if (tags[i] === 'canada') tags.splice(i, 1);
                   if (tags[i] === 'region') tags.splice(i, 1);
                   if (tags[i] === 'specified') tags.splice(i, 1);
                }
            }
            if (tags.length > 0){
                Elsie.Data.similarProductsSearchString = tags.join(" ") || "";
            } else {
                Elsie.Data.similarProductsSearchString = "";
            }
            complete();
        });
    };

    search.selectStore = function(data) {
        //we chose a store
        Elsie.Interface.showLoadingAnimation("Looking up that store...");
        var store = data;
        Elsie.Data.selectedStore = store;
        var storeLocation = {
            latitude: Elsie.Data.selectedStore.latitude,
            longitude: Elsie.Data.selectedStore.longitude,
        };
        Elsie.Services.getNearbyStoresForProduct(storeLocation).then(function(){
            Elsie.Interface.hideLoadingAnimation();
            WinJS.Navigation.navigate("./store.html");
        });
    }

    WinJS.Namespace.define("Elsie", {
        Search: search
    });
})();