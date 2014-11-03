var statusEl = document.getElementById("status");

function onSuggestionsRequested(e)
  {
    var promise = FlickrSearchLibrary.FlickrSearcher.getHotTagsAsync(e.detail.queryText);

    promise.done(
      function (results)
      {
        e.detail.searchSuggestionCollection.appendQuerySuggestions(results);
      }
    );
    e.detail.setPromise(promise);
  }

function suggestionsRequestedHandler(args) {

    var query = args.detail.queryText.toLocaleLowerCase();

    var promise = services.searchProducts(query);

    promise.done(function(){
        // retrieve the system-supplied suggestions (i.e. previous searches performed by this user)
        var suggestionCollection = args.detail.searchSuggestionCollection;

        // check that the query is at least one character & that we have data from the API
        if (query.length > 0 && data.searchResults) {
            
            data.searchResults.forEach(
                function (element, index, array) {
                    if (element.name.substr(0, query.length).toLocaleLowerCase() === query) {
                        suggestionCollection.appendQuerySuggestion(element.name);
                    }
                });

        }
    });

    args.detail.setPromise(promise);

}

function querySubmittedHandler(eventObject) {
    var queryText = eventObject.detail.queryText;
    WinJS.log && WinJS.log(queryText, "sample", "status");
}

WinJS.log = function (msg, source, type) {
    if (type === "status") {
        statusEl.innerHTML += msg + "<br/>";
    }
}

