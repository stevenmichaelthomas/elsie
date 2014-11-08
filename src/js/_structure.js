var structure = {};

structure.productConstructor = WinJS.UI.Pages.define("./product.html", {
    // This function is called after the page control contents 
    // have been loaded, controls have been activated, and 
    // the resulting elements have been parented to the DOM. 
    ready: function (element, options) {
    	 console.log('product page is go!')
        options = options || {};

        // bind List object to the listView control
        var resultsEl = document.getElementById("storeResults");
        resultsEl.winControl.itemDataSource = NearbyStoresWithProduct.itemList.dataSource;

        var pivotEl = document.getElementById("productPivot");
        pivotEl.winControl.title = data.selectedProduct.name;
    },
});

structure.homeConstructor = WinJS.UI.Pages.define("./home.html", {
    // This function is called after the page control contents 
    // have been loaded, controls have been activated, and 
    // the resulting elements have been parented to the DOM. 
    ready: function (element, options) {
    	 console.log('home page is go!')
        options = options || {};
        var searchBox = document.getElementById("searchBoxId");
        searchBox.addEventListener("suggestionsrequested", search.requestSuggestions);
        searchBox.addEventListener("resultsuggestionchosen", search.selectSuggestion);
        //searchBox.addEventListener("querysubmitted", search.submitQuery);
    },
});