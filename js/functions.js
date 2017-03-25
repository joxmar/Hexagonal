/*
By: Jorge Elvir
Description: This was a love project that came in fruition thanks frustrations in the past while trying to visit sports websites
to check Concacaf's world cup qualifiers. Visiting sites like ESPN or diez.hn full of ads and little interaction for the end 
user I came up with the idea of making my own calendar where the end user can see the latest results but also can edit the calendar 
score boards to make predictions and see the table standings.

As a developer, I also made some restrictions in order to learn fron this project, this is a pure javascript code with no library dependencies like 
jquery, mustache, ember etc. Just good ol' plain vanilla javascript.

Next stop: WORLD CUP CALENDAR!!!
*/


// Global Variables
var hexagonal = [];
var sortHex;

	// team builder object constructor
	function newTeam(name,img){
		this.name= name,
		this.img= img+'-flag.png',
		this.pj= 0,
		this.pg= 0,
		this.pe= 0,
		this.pp= 0,
		this.gf= 0,
		this.gc= 0,
		this.gd= function(){
			return this.gf - this.gc;
		},
		this.pts= function(){
			return this.pg * 3 + this.pe;
		}
	}

	// build teams
	var uSa = new newTeam("Estados Unidos","usa");
	var panama = new newTeam("Panama","pan");
	var honduras = new newTeam("Honduras","hon");
	var costaRica = new newTeam("Costa Rica","cos");
	var mexico = new newTeam("Mexico","mex");
	var trinidad = new newTeam("Trinidad & Tobago","tri");

	// include teams to the hexagonal array
	hexagonal.uSa = uSa;
	hexagonal.panama = panama;
	hexagonal.honduras = honduras;
	hexagonal.costaRica = costaRica;
	hexagonal.mexico = mexico;
	hexagonal.trinidad = trinidad;	

	// update standings
	function updateTable(teamA,teamAGoals,teamB,teamBGoals){		
		var teamA = teamA;
		var teamAGoals = teamAGoals;
		var teamB = teamB; 
		var teamBGoals = teamBGoals;

		// add goals to each team
		hexagonal[teamA]['gf'] += teamAGoals;
		hexagonal[teamA]['gc'] += teamBGoals;
		hexagonal[teamB]['gf'] += teamBGoals;
		hexagonal[teamB]['gc'] += teamAGoals;

		// Alocate pg pe pp and points
		if (teamAGoals > teamBGoals) {			
			hexagonal[teamA]['pg'] += 1; // won
			hexagonal[teamB]['pp'] += 1; // lost
		}else if (teamAGoals < teamBGoals) {
			hexagonal[teamA]['pp'] += 1; // lost
			hexagonal[teamB]['pg'] += 1; // won
		}else{
			hexagonal[teamA]['pe'] += 1; // draw
			hexagonal[teamB]['pe'] += 1; // draw
		}

		// update games played
		hexagonal[teamA]['pj'] ++;
		hexagonal[teamB]['pj'] ++;

		// call to update table positions
		sortTable();
	}

	// sort table	to display correct teams positions
	function sortTable(){
		// Have to create and push elements from hexagonal array to new array (sortHex) in order to sort and display the correct table standing positions
		sortHex = [];
		// get standings and push them to new array
		for (var teams in hexagonal) {		
			var teamName = hexagonal[teams].name;
			var teamflag = hexagonal[teams].img;
			var teamGp = hexagonal[teams].pj;
			var teamGw = hexagonal[teams].pg;
			var teamGdr = hexagonal[teams].pe;
			var teamGl = hexagonal[teams].pp;
			var teamGf = hexagonal[teams].gf;
			var teamGa = hexagonal[teams].gc;
			var teamPts = hexagonal[teams].pts();		
			var teamGd = hexagonal[teams].gd();					
			sortHex.push({name: teamName, img:teamflag, pj: teamGp, pg: teamGw, pe: teamGdr, pp: teamGl, gf: teamGf, gc: teamGa, pts: teamPts, gd: teamGd});			
		}	
		
		// sort array for correct standings positions
		sortHex.sort(function (a, b) {
			if (a.pts > b.pts) {
				return -1;	    
			}
			if (a.pts < b.pts) {
				return 1;	    
			}
		  // if teams have equal points then sort by goal difference
		  if (a.pts === b.pts) { 
		    // sort by hights gal difference
		    if (a.gd > b.gd) {
		    	return -1;
		    }
		    if (a.gd < b.gd) {
		    	return 1;
		    }
		  	// if teams have equal goal difference then sort by highest goal in favour
		  	if (a.gd == b.gd) {
		  		if (a.gf > b.gf) {
		  			return -1;
		  		}
		  		if (a.gf < b.gf) {
		  			return 1;
		  		}
		  	}
		  }
		});
		// display updated table to user
		showStandings();
	}

	// reset hexagonal object back to 0
	function resetHexagonal(){
		for (var teams in hexagonal) {
			hexagonal[teams].pj = 0;
			hexagonal[teams].pg = 0;
			hexagonal[teams].pe = 0;
			hexagonal[teams].pp = 0;
			hexagonal[teams].gf = 0;
			hexagonal[teams].gc = 0;
		}
	}

// display sorted table
function showStandings(){
		// print sorted table
		var hexTable = document.getElementById('hexagonal-table');	
		// remove old standings
		var oldtbody = document.getElementsByTagName('tbody')[0];	
		oldtbody.parentNode.removeChild(oldtbody);

		// create and populate new standings
		var tbody = hexTable.appendChild(document.createElement('tbody'));	

		for (team in sortHex) {
			var teamRow = document.createElement('tr');			
			teamRow.innerHTML = '<td><img src="images/'+sortHex[team].img+'" alt="' + sortHex[team].name + '" width="30" height="30">' + sortHex[team].name + '</td>' +
			'<td>' + sortHex[team].pj + '</td>' +
			'<td>' + sortHex[team].pg + '</td>' +
			'<td>' + sortHex[team].pe + '</td>' +
			'<td>' + sortHex[team].pp + '</td>' +
			'<td>' + sortHex[team].gf + '</td>' +
			'<td>' + sortHex[team].gc + '</td>' +
			'<td>' + sortHex[team].gd + '</td>' +
			'<td>' + sortHex[team].pts + '</td>';				
			tbody.appendChild(teamRow);
		}
	}

	// function to get team and scores from input fields and send to update table
	function matchDay(teamPerfomance){
		// Normally teamPerformance is the parent div or node that holds the game's
		// input fields for easy access to each one.

		// get all input fields in the game
		var results = teamPerfomance.getElementsByTagName('input');
		// get local team name and results	
		var localT = results[0].getAttribute('data-team');
		var localTScore = Number(results[0].value);
		// get visitor team name and results
		var visitorT = results[1].getAttribute('data-team');
		var visitorTScore = Number(results[1].value);
		// update table
		updateTable(localT,localTScore,visitorT,visitorTScore);
	}

	// get scores from all games already played in the past when page is loaded
	function tableToday(){
		// create array to save all the match results
		var matches = [];

		// find every single match in the page and push it to the array
		// for loop i <= 30 becuase it is 30 games in total
		for (var i = 1; i <= 30; i++) {	
			matches[i] = document.getElementById('match-score-'+i);						
		}		
		
		// get each team name and score on every match
		for(matchResult in matches){
			var teams = matches[matchResult];
			// only get games scores that have been already played
			if (teams.hasAttribute('data-game')) {
				matchDay(teams);				
			}else{
				sortTable();
			}
		}		
	}	

	// get scores when a game is updated by user from the input fields
	function updateGame(game){
		// get parent div that holds the teams in match
		var thisMatch = game.parentNode;
		// get both teams scores from input fields
		var gameScores = thisMatch.getElementsByTagName('input');
		
		// Update match only if Both teams values have been placed in the field
		if (gameScores[0].value !== '' && gameScores[1].value !== '') {
			// if this has already been played then it is only an update
			if (thisMatch.hasAttribute('data-game')) {
				// reset everything to 0 in hexagonal calculate everything again with new numbers.
				resetHexagonal();
				tableToday();
			}else{
				// if this is a game result added for the first time then make it already played 
				// and update table only
				thisMatch.setAttribute('data-game','played');
				matchDay(thisMatch);
			};
		}else{
			// if user is removing scores and leaves the game empty, remove data-game and reset and recalculate the table
			thisMatch.removeAttribute('data-game');
			resetHexagonal();
			tableToday();
		}
	}

	// back to top button
	var winHeight  = window.innerHeight;
	var backTotopBtn = document.getElementById('back-to-top');
	window.onscroll = function(){
		if (window.pageYOffset > winHeight) {
			backTotopBtn.className = 'show-back-to-top';
		} else if(window.pageYOffset < (winHeight / 2)){
			backTotopBtn.removeAttribute('class');
		}
	}

	function TopscrollTo(e) {
		if(window.scrollY!=0)
		{
		  setTimeout(function() {
			  window.scrollTo(0,window.scrollY-30);
		  	TopscrollTo();
		  }, 0);
		}
	}
	backTotopBtn.addEventListener('click', TopscrollTo, false);

	// Show table on mobile devices
	function showTableMobile(){
		var leftCol = document.getElementById('standings-container');
		leftCol.classList.toggle('open-table-mobile');
		showTableBtn.classList.toggle('close-nav');
	}
	var showTableBtn = document.getElementById('mobile-table');
	showTableBtn.addEventListener('click',showTableMobile,false);
	
	// load document and rock & roll baby!
	document.addEventListener('DOMContentLoaded', function(){ 
		tableToday();
	}, false);

	/* Local Storage
	when input triggers onblur event
	grab the value and store it in a variable
	the variable should match its correspondent input field so it goes in the correct place when loaded
	when the page loads it looks for these variables, if they exist they should then be loaded on their 
	respective input fields and then run table today

		localStorage.setItem('myStorage', game.value);
		console.log(localStorage.getItem('myStorage'));
	*/

	// Things to update on my own after each game:
	// team scores
	// add data-game="played" to every played game in the past
	// add live-match to team score for live scores

	