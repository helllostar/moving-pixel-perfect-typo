;(function() {
    'use strict';

    var search, results, allStars = [];

    var hello = function() {
        search = new JsSearch.Search('serial');
        search.tokenizer = new JsSearch.StemmingTokenizer(stemmer, search.tokenizer);
        // search.tokenizer = new JsSearch.StopWordsTokenizer(search.tokenizer);
        // search.searchIndex = new JsSearch.TfIdfSearchIndex('id');
        search.addIndex('id');
        search.addIndex('name');
        search.addIndex('dept');
        search.addIndex('intake');
        search.addDocuments(allStars);
        searchStars();
    }

    var indexedStarsTable = document.getElementById('indexedStarsTable');
    var indexedStarsTBody = indexedStarsTable.tBodies[0];
    var searchInput = document.getElementById('searchInput');
    var starCountBadge = document.getElementById('starCountBadge');

    var updateStarsTable = function(stars) {
      indexedStarsTBody.innerHTML = '';

      var tokens = search.tokenizer.tokenize(searchInput.value);

      for (var i = 0, length = stars.length; i < length; i++) {
        var star = stars[i];

        var serialColumn = document.createElement('td');
        serialColumn.innerText = star.serial;

        var nameColumn = document.createElement('td');
        nameColumn.innerHTML = star.name;

        var idColumn = document.createElement('td');
        idColumn.innerHTML = star.id;

        var deptColumn = document.createElement('td');
        deptColumn.innerHTML = star.dept;

        var intakeColumn = document.createElement('td');
        intakeColumn.innerHTML = star.intake;


        var tableRow = document.createElement('tr');
        tableRow.appendChild(serialColumn);
        // tableRow.appendChild(idColumn);
        tableRow.appendChild(nameColumn);
        tableRow.appendChild(deptColumn);
        tableRow.appendChild(intakeColumn);

        indexedStarsTBody.appendChild(tableRow);
      }
    };

    var updateStarCountAndTable = function() {
      updateStarCount(results.length);

      if (results.length > 0) {
        updateStarsTable(results);
      } else if (!!searchInput.value) {
        updateStarsTable([]);
      } else {
        updateStarCount(allStars.length);
        updateStarsTable(allStars);
      }
    };

    var searchStars = function() {
      results = search.search(searchInput.value);
      updateStarCountAndTable();
    };

    searchInput.oninput = searchStars;

    var updateStarCount = function(numStars) {
      starCountBadge.innerText = numStars;
    };

    // show / hide function
    var hideElement  = function(element) {
      element.className += ' hidden';
    };
    var showElement = function(element) {
      element.className = element.className.replace(/\s*hidden/, '');
    };

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var json = JSON.parse(xmlhttp.responseText);

        // json file array name
        allStars = json.joinStars;


        // Total Tickets
        // Avaiable
        var totalStar = document.getElementById('TotalStar');
        var avaiableTickets = document.getElementById('AvaiableTickets');

        var totalTickets = 50;
        var bookedTickets = allStars.length;
        var avaiable = totalTickets - bookedTickets;

        totalStar.innerText = bookedTickets;
        avaiableTickets.innerText = avaiable;


        updateStarCount(allStars.length);

        var loadingProgressBar = document.getElementById('loadingProgressBar');
        hideElement(loadingProgressBar);
        showElement(indexedStarsTable);

        // rebuildSearchIndex();
        hello();
        updateStarsTable(allStars);
      }
    }
    xmlhttp.open('GET', 'join.json', true);
    xmlhttp.send();


})();
