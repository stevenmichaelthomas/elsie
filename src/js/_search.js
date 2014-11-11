(function () {
    "use strict";

    var search = {};

    search.requestSuggestions = function() {
        var query = document.getElementById("searchBoxId").value.toLocaleLowerCase();
        var promise = Elsie.Services.searchProducts(query);
        promise.done(function(){
            var suggestionCollection = [];
            // check that the query is at least one character & that we have data from the API
            if (query.length > 0 && Elsie.Data.searchResults) {
                Elsie.Data.searchResults.forEach(
                    function (element, index, array) {
                        var name = element.name.toLocaleLowerCase();
                        if (name.indexOf(query) > -1){
                            //suggestionCollection.appendResultSuggestion(element.name, element.package, element.id, WinJS.UI.SearchBox.createResultSuggestionImage(element.image_thumb_url), null);
                            var searchResult = {
                                name: element.name,
                                package: element.package,
                                id: element.id,
                                image: element.image_thumb_url
                            };
                            suggestionCollection.push(searchResult);
                        }
                    }
                );
                Elsie.Data.suggestionCollection = suggestionCollection;
            }
        });
        //args.detail.setPromise(promise);
        Elsie.Data.query = query;
    }

    search.selectSuggestion = function(args) {
        //we chose a product, now let's do something with it
        var productId = args.detail.tag;
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

    WinJS.Namespace.define("Elsie", {
        Search: search
    });
})();