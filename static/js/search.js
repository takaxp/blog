// Thansk to https://www.mattwalters.net/posts/hugo-and-lunr/
var idx = null;
var resultDetails = [];
var $searchResults;
var $searchInput;
var $headerSearch;
var $path = '/blog'
var $currentpage = null;
var request = null;

// var lunr = require('lunr.js');
// require('/js/lunr-langs/lunr.stemmer.support.js')(lunr);
// require('/js/lunr-langs/tiny_segmenter.js')(lunr);
// require('/js/lunr-langs/lunr.ja.js')(lunr);
// require('/js/lunr-langs/lunr.multi.js')(lunr);

function setup (){
  var query = '';

  $currentpage   = location.href;
  $searchLangJa  = document.getElementById('search-lunr-ja');
  $searchResults = document.getElementById('search-results');
  $searchInput   = document.getElementById('search-input');
  $headerSearch  = document.getElementById('header-search');
  query          = (getParameterByName('q')) ? getParameterByName('q').trim() : '';

  if ( request == null ){
    request = new XMLHttpRequest();
    request.overrideMimeType("application/json");
    request.open("GET", $path+"/index.json", true);
  }

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      var documents = JSON.parse(request.responseText);

      idx = lunr(function () {
        // use lang support
        if( $searchLangJa && $searchLangJa.checked == true ) {
          this.use(lunr.ja);
        }

        this.ref('ref');
        this.field('title');
        this.field('excerpt');
        this.field('body');

        documents.forEach(function(doc) {
            this.add(doc);
            resultDetails[doc.ref] = {
              'title': doc.title,
              'excerpt': doc.excerpt,
              'body': doc.body
            };
        }, this);
      });

      if (query != '') {
        $searchInput.value = query;
        $headerSearch.value = query;
        renderSearchResults(search(query));
      }
    } else {
      $searchResults.innerHTML = 'Error loading search results';
    }
  };

  request.onerror = function() {
    $searchResults.innerHTML = 'Error loading search results';
  };

  if ( idx == null ){
    request.send();
  }else{
    request.onload();
  }

  registerSearchHandlers();
};

function registerSearchHandlers() {
  $searchInput.oninput = function(event) {
    var query = event.target.value;
    var results = search(query);

    $headerSearch.value = query;

    updateQueryParam(query);
    renderSearchResults(results);

    if ($searchInput.value == '') {
      $searchResults.innerHTML = '';
      if ($currentpage != null) {
        history.pushState('', '', $currentpage);
      }
    }
  }

  if ($searchInput) {
    $headerSearch.oninput = function(event) {
      var query = event.target.value;
      $searchInput.value = query;
      updateQueryParam(query);
      renderSearchResults(search(query));
    }
  }
}

window.onload = setup();

function search(query) {
  return idx.search(query);
}

function renderSearchResults(results) {
  // Create a list of results
  var ul = document.createElement('ul');
  var maxlength = 30;
  var maxlist = 5;
  if (results.length > 0) {
    for (i=0; i<maxlist; i++){
      var result = results[i];
      if (result && resultDetails[result.ref].title ){
        // Create result item
        var li = document.createElement('li');
        li.classList.add('card');
        li.innerHTML = '<div class="card-header"><a href="' + result.ref + '">' + resultDetails[result.ref].title + '</a></div><div class="card-body">' + resultDetails[result.ref].body.substring(1, maxlength) + '</div>';
        ul.appendChild(li);}
    };

    // Remove any existing content
    while ($searchResults.hasChildNodes()) {
      $searchResults.removeChild(
        $searchResults.lastChild
      );
    }
  } else {
    $searchResults.innerHTML = 'No results found';
  }

  // Render the list
  $searchResults.appendChild(ul);
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function updateQueryParam(query) {
  history.pushState('', '', $path+ '/?q=' + query);
}
