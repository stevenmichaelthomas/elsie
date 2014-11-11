var structure = {};

structure.productConstructor = WinJS.UI.Pages.define("./product.html", {
    // This function is called after the page control contents 
    // have been loaded, controls have been activated, and 
    // the resulting elements have been parented to the DOM. 
    ready: function (element, options) {
    	 console.log('product page is go!')
        WinJS.Binding.processAll();
    }

});

structure.homeConstructor = WinJS.UI.Pages.define("./home.html", {
    ready: function (element, options) {
    	console.log('home page is go!');
        var searchBoxOptions = {
            chooseSuggestionOnEnter: true, 
            focusOnKeyboardInput: true, 
            placeholderText: 'Search for a product'
        };
        //var searchBox = new WinJS.UI.SearchBox(document.getElementById("searchBoxContainer"), searchBoxOptions);
        var searchBox = document.getElementById("searchBoxId");
        searchBox.addEventListener("change", search.requestSuggestions);
        //searchBox.addEventListener("resultsuggestionchosen", search.selectSuggestion);
        //searchBox.addEventListener("querysubmitted", search.submitQuery);
    },
});