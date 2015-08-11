// Sparklines on hover over restarant name
// restaurant closures
// restaurant cleanliness score
// link to restaurant cleanliness 

// http://www.inspections.vcha.ca/Inspection/Show/100c94cd-01a1-41f1-8d03-5d16f8e967e7

// restaurant closures ---  pdf ?

var rootUrl = 'http://www.inspections.vcha.ca/';
var restaurantName = '';
var latestInspectionUrl = '';


function getFirstRestaurantLink(data){
	return rootUrl + $(data).find('#facilities-grid tr:nth-child(2) a').attr('href');
}

function getFirstInspectionLink(data){
	var a = $(data).find('table.tabular .left a')[1];
	return rootUrl + $(a).attr('href');
}


// Searches for the given restaurant and returns the data as a promise 
function getSearchResultsByRestaurantName(restaurantName){
	var searchUrl = rootUrl + 'Facility?report-type=ffffffff-ffff-ffff-ffff-fffffffffff1&sort-by=Name&search-term=' + encodeURIComponent(restaurantName) + '&submit-search=Search';
	console.log('making a request to: ' + searchUrl);
	return $.get(searchUrl, function(data) {
		// TODO: better search method
		// If no results, try shortening restaurant name
		// special characters
		// click on most relevant name
		// how to handle chains? - based on user location?
		console.log('got list of restaurants');
	});
}


// Given data from getSearchResultsByRestaurantName, it extracts the first restaurant result and makes a request to get the page with the inspection reports
// some restaurants don't have inspection reports
function getInspectionReports(data){
	// Extract first restaurant link
	var firstRestaurantLink = getFirstRestaurantLink(data);

	return $.get(firstRestaurantLink, function(data){
		console.log('got first restaurant');	
		//return $.when(latestInspectionLink);
	});
}

// Given page with list of inspection reports from getInspectionReports, it extracts the first inspection link and makes a get request
function getLatestInspectionReportDetail(data){
	// Extract latest inspection link
	latestInspectionUrl = getFirstInspectionLink(data);

	return $.get(latestInspectionUrl, function(data){
		//console.log('got first inspection link');	
	});
}


// inserts link to safety info page after restaurant title
function insertSafetyInfoToDOM(data){
	var totalObserv = getTotalNewObservations(data);

	var safetyDiv = $('<div class="safetyContainer"></div>');

	var pageTitleElement = $('.biz-page-header')[0];
	var restaurantSafetyLink = document.createElement("a");
	restaurantSafetyLink.text = 'Latest inspection link';
	restaurantSafetyLink.setAttribute('href', latestInspectionUrl);
	safetyDiv.append("<p>Überprüfung</p>");
	safetyDiv.append("<p>New observations: " + totalObserv + "</p>");
	safetyDiv.append(restaurantSafetyLink);
	$(pageTitleElement).after(safetyDiv);
}

// Get the page with the observation table and return total count of new observations
function getTotalNewObservations(data){
	// safety rating is calculated using the latest inspection report
	// it adds up the number of 'new observations' 
	// How to calculate the range?? 
	// Gets all of the new observations in the table
	var observations = $(data).find('.tabular td.left').next();
	// add up the total and return it
	return Array.prototype.reduce.call(observations, function(val1, val2){
		return val1 + parseInt($(val2).text().trim());
	}, 0);
}

function addSafetyRating(restaurantName){
    // Todo: Error handling!!!!!!! 
 	return getSearchResultsByRestaurantName(restaurantName)
 	.then(getInspectionReports)
 	.then(getLatestInspectionReportDetail)
 	.then(insertSafetyInfoToDOM);

}


document.onreadystatechange = function () {
     if (document.readyState == "complete") {
    	
    	restaurantName = document.getElementsByClassName('biz-page-title')[0].textContent.trim();
    	addSafetyRating(restaurantName);
   }
 }

