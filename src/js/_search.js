var search = {};

search.requestSuggestions = function(args) {
    var query = args.detail.queryText.toLocaleLowerCase();
    var promise = services.searchProducts(query);
    promise.done(function(){
        // retrieve the system-supplied suggestions (i.e. previous searches performed by this user)
        var suggestionCollection = args.detail.searchSuggestionCollection;
        // check that the query is at least one character & that we have data from the API
        if (query.length > 0 && data.searchResults) {
            data.searchResults.forEach(
                function (element, index, array) {
                    var name = element.name.toLocaleLowerCase();
                    if (name.indexOf(query) > -1){
                        suggestionCollection.appendResultSuggestion(element.name, element.package, element.id, WinJS.UI.SearchBox.createResultSuggestionImage(element.image_thumb_url), null);
                    }
                }
            );
        }
    });
    args.detail.setPromise(promise);
    data.query = query;
}

search.selectSuggestion = function(args) {
    //we chose a product, now let's do something with it
    var productId = args.detail.tag;
    services.findNearbyStoresWithProduct(productId).then(function(){
         // create a List object
        var itemList = new WinJS.Binding.List(data.nearbyStoresWithProduct);
        var storesList = {
            itemList: itemList
        };
        WinJS.Namespace.define("NearbyStoresWithProduct", storesList);
        WinJS.Navigation.navigate("./product.html");
    });
}

search.submitQuery = function(eventObject) {
    var queryText = eventObject.detail.queryText;
    //WinJS.log && WinJS.log(queryText, "sample", "status");

    var resultList = new WinJS.Binding.List(data.searchResults);
}