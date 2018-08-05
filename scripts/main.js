var logList = document.createElement('ol');
var listMode;
var log = document.querySelector('.log');
var logEmptyPara = document.createElement('p');
logEmptyPara.appendChild(document.createTextNode('No albums in the backlog. Search for an album to add it here.'));
var searchButton = document.querySelector('.searchbar button');
var searchText = document.querySelector('.searchbar input');
var body = document.querySelector('body');
searchButton.onclick = function(){
	if(searchUnderway==false){
		if (searchText.value){
			currentSearch=searchText.value;
			index=1;
			limitReached=false;
			clearDisplay(log);
			searchDisplay();
		}
	}
};
searchText.addEventListener("keyup", function(event) {
	if (event.keyCode === 13)
        searchButton.click();
});
var noResultsPara = document.createElement('p');
noResultsPara.appendChild(document.createTextNode('No Results Found!'));
var headEl = document.querySelector('head');
var listViewButton = document.getElementById("list");
var tileViewButton = document.getElementById("tile");
var viewChangeButton = document.querySelector('select[name=viewChanger]');

function viewChange(value) {
	listMode=(value=='list')?'list':'grid';
	logList.setAttribute('id', listMode);
	localStorage.setItem('viewStyle', listMode);
}

var addedTest = [];
var addedAlbumInfo;
var picLink;
var logDisplayed;
var backButton = document.createElement('button');
var backButtonDiv = document.createElement('div');
var searchBackButton = document.createElement('button');
var searchBackButtonDiv = document.createElement('div');
var searchNextButton = document.createElement('button');
var searchNextButtonDiv = document.createElement('div');
var contextHeader = document.querySelector('h2');
var contextHeaderContainer = document.querySelector('.contextHeader');
var index=1;
var resultCount;
var vidLink;
var searchUnderway = false;
var currentSearch;
var bandcampLink;
var test = false;
var infoContainer = document.createElement('div');
	infoContainer.setAttribute('class', 'moreInfo');

function removeFromLog(albumEl){
	for (var k = 0; k < addedTest.length; k++){
		if(addedTest[k]['info'] == albumEl.children[2].textContent){
			if (logDisplayed == true){
				logList.removeChild(albumEl);
				if(!(logList.hasChildNodes()))
					log.appendChild(logEmptyPara);
			}
			addedTest.splice(k, 1);
			if(addedTest.length==0){
				localStorage.removeItem('addedArray');
			}
			else{
				localStorage.setItem('addedArray', JSON.stringify(addedTest));
			}
			break;
		}
		if (k == addedTest.length-1)
	    	console.log('element to display not found!');
    }
}

function swapUp(albumEl){
	if(addedTest.length > 1){
	    for(var j = 1; j < addedTest.length; j++){
	    	if(addedTest[j]['info'] == albumEl.children[2].textContent){
	    		var tmp = addedTest[j];
	    		addedTest[j] = addedTest[j-1];
	    		addedTest[j-1] = tmp;
	    		localStorage.setItem('addedArray', JSON.stringify(addedTest));
	    		logList.insertBefore(albumEl, albumEl.previousSibling);
	    	}
	    }
	}
}

function swapDown(albumEl){
	if(addedTest.length > 1){
	    for(var l = 0; l < addedTest.length-1; l++){
	    	if(addedTest[l]['info'] == albumEl.children[2].textContent){
	    		var tmp = addedTest[l];
	    		addedTest[l] = addedTest[l+1];
	    		addedTest[l+1] = tmp;
	    		localStorage.setItem('addedArray', JSON.stringify(addedTest));
	    		logList.insertBefore(albumEl.nextSibling, albumEl);
	    		break;
	    	}
	    }
	}
}

function displayInfo(n){
	var logIndex;
	for (var i = 0; i < logList.children.length; i++){
    		if (logList.children[i] == n)
    			logIndex = i;
    }
    var artist=addedTest[logIndex]['artist'];
    artist=artist.replace('%', '%25');
    artist=artist.replace('&', '%26');
    var album=addedTest[logIndex]['name'];
    album=album.replace('%', '%25');
    album=album.replace('&', '%26');
    requestIdString = (addedTest[logIndex]['mbid'])?'&mbid='+addedTest[logIndex]['mbid']:'&artist='+
    				artist+'&album='+album;
    var requestURL = 'https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=57ee3318536b23ee81d6b27e36997cde'+requestIdString+'&format=json';
    console.log(requestURL);
    var request = new XMLHttpRequest();
	request.open('GET', requestURL);
	request.responseType = 'json';
	request.send();
	clearDisplay(log);
	showBackButton();
	

	request.onload=function(){
		var results = request.response['album'];
		if(!results){
			if (request.response['error']){
				errorPara.innerText=request.response['message'];
				log.appendChild(errorPara);
			}
		}
		else{
			var albumArt = results['image'][3]['#text'];
			var albumArtEl = document.createElement('img');
			albumArtEl.setAttribute('src', albumArt);
			var albumArtContainer = document.createElement('div');
			albumArtContainer.setAttribute('class', 'infoAlbumArt');
			albumArtContainer.appendChild(albumArtEl);

			var artist = document.createElement('div');
			artist.setAttribute('class', 'artist');
			artist.appendChild(document.createTextNode(results['artist']));
			var album = document.createElement('div');
			album.setAttribute('class', 'album');
			album.appendChild(document.createTextNode(results['name']));
			var summary = document.createElement('div');
			summary.setAttribute('class','summary');
			var summaryText=(results['wiki'])?results['wiki']['content']:'(No album summary available)';
			summary.innerHTML=summaryText;

			var nameArtistBioContainer = document.createElement('div');
			nameArtistBioContainer.setAttribute('class', 'nameArtistBio');
			
			nameArtistBioContainer.appendChild(album);
			nameArtistBioContainer.appendChild(artist);
			nameArtistBioContainer.appendChild(summary);
			var artAndInfoContainer = document.createElement('div');
			artAndInfoContainer.setAttribute('class', 'artAndInfo');

			artAndInfoContainer.appendChild(albumArtContainer);
			artAndInfoContainer.appendChild(nameArtistBioContainer);
			
			infoContainer.appendChild(artAndInfoContainer);
			var tracklist = document.createElement('ol');
			tracklist.setAttribute('id', 'tracklist');
			var tracksData = results['tracks']['track'];
			for (var i = 0; i < tracksData.length; i++){
				var track = document.createElement('li');
				var trackTitle = tracksData[i]['name'];
				var seconds = ((tracksData[i]['duration']%60)<10)?'0'+(tracksData[i]['duration']%60):(tracksData[i]['duration']%60);
				var trackDuration = Math.floor(tracksData[i]['duration']/60)+':'+seconds;
				var trackTitleContainer = document.createElement('div');
				trackTitleContainer.setAttribute('class', 'trackTitle');
				trackTitleContainer.innerText=trackTitle;
				var trackDurationContainer = document.createElement('div');
				trackDurationContainer.setAttribute('class', 'trackDuration');
				trackDurationContainer.innerText=trackDuration;
				track.appendChild(trackTitleContainer);
				track.appendChild(trackDurationContainer);
				tracklist.appendChild(track);
			}
			infoContainer.appendChild(tracklist);
			
			var requestURL2 = 'https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&api_key=57ee3318536b23ee81d6b27e36997cde&artist='+
	    				results['artist']+'&format=json';
	    	var request2 = new XMLHttpRequest();
	    	request2.open('GET', requestURL2);
			request2.responseType = 'json';
			request2.send();
			request2.onload=function(){
				var results2 = request2.response['artist'];
				var artistImage = results2['image'][4]['#text'];
				if (artistImage){
					var artistImageEl = document.createElement('img');
					artistImageEl.setAttribute('src', artistImage);
					var artistImageContainer = document.createElement('div');
					artistImageContainer.setAttribute('class', 'artistImage');
					artistImageContainer.appendChild(artistImageEl);
					(infoContainer.children[0])?infoContainer.insertBefore(artistImageContainer, infoContainer.children[0]):infoContainer.appendChild(artistImageContainer);
				}
			};
			log.appendChild(infoContainer);
		}
	};
	

}

function createLogNode(albumEl){
	var rightHalfDiv=document.createElement('div');
	rightHalfDiv.setAttribute('class', 'rightHalfDiv');
	var addButton = document.createElement('button');
	addButton.appendChild(document.createTextNode('-'));
	var addButtonDiv = document.createElement('div');
    addButtonDiv.setAttribute('class', 'addButton');
    addButtonDiv.appendChild(addButton);
    
    addButton.onclick=function(){removeFromLog(this.parentNode.parentNode)};
	var imgEl = document.createElement('img');
	var imgElDiv = document.createElement('div');
	imgElDiv.setAttribute('class', 'albumArt');
	imgEl.setAttribute('src', albumEl['pic']);

	imgElDiv.appendChild(imgEl);
	var el = document.createElement('li');
    
    el.appendChild(addButtonDiv);
    el.appendChild(imgElDiv);
    var albumInfoEl = document.createElement('div');
    albumInfoEl.setAttribute('class', 'albumInfo');
    var styleDiv1 = document.createElement('div');
    styleDiv1.setAttribute('class', 'styleDiv1');
    styleDiv1.appendChild(document.createTextNode(albumEl['info']));
    albumInfoEl.appendChild(styleDiv1);
    el.appendChild(albumInfoEl);

    var moreInfoLink = document.createElement('a');
    moreInfoLink.appendChild(document.createTextNode('[More Info]'));
    moreInfoLink.setAttribute('href', '#');
    moreInfoLink.setAttribute('class', 'moreInfoLink');
    moreInfoLink.setAttribute('onclick', 'displayInfo(this.parentNode.parentNode);');    
    rightHalfDiv.appendChild(moreInfoLink);

    var orderDiv = document.createElement('div');
    orderDiv.setAttribute('class', 'orderDiv');
    var moveUpButton = document.createElement('button');
    var moveUpButtonDiv = document.createElement('div');
    var moveDownButton = document.createElement('button');
    var moveDownButtonDiv = document.createElement('div');

    moveUpButtonDiv.setAttribute('class', 'moveUpButton');
    moveDownButtonDiv.setAttribute('class', 'moveDownButton');
    moveUpButton.appendChild(document.createTextNode('▲'));
    moveDownButton.appendChild(document.createTextNode('▼'));
    moveUpButtonDiv.appendChild(moveUpButton);
    moveDownButtonDiv.appendChild(moveDownButton);
    
    orderDiv.appendChild(moveDownButtonDiv);
    orderDiv.appendChild(moveUpButtonDiv);
    moveUpButton.onclick=function(){
    	swapUp(this.parentNode.parentNode.parentNode.parentNode);
    };
    moveDownButton.onclick=function(){
    	swapDown(this.parentNode.parentNode.parentNode.parentNode);
    };
    rightHalfDiv.appendChild(orderDiv);
    el.appendChild(rightHalfDiv);
    logList.appendChild(el);
    
}


function clearLog(){
	if(addedTest.length){
		while(logList.hasChildNodes()){
			logList.removeChild(logList.lastChild);
		}
		while(addedTest.length!=0){
			addedTest.pop();
		}
		localStorage.removeItem('addedArray');
		log.appendChild(logEmptyPara);
	}
}

function logDisplay(){
	clearDisplay(log);
	logDisplayed = true;
	var clearLogButton = document.createElement('button');
	clearLogButton.setAttribute('id', 'clearLogButton');
	clearLogButton.innerText = 'Clear Log';
	var clearLogButtonContainer = document.createElement('div');
	clearLogButtonContainer.setAttribute('class', 'clearLog');
	clearLogButtonContainer.appendChild(clearLogButton);

	clearLogButton.onclick = clearLog;

	log.appendChild(clearLogButtonContainer);
	if(localStorage.getItem('addedArray')){
		addedTest = JSON.parse(localStorage.getItem('addedArray'));
		for (var i = 0; i < addedTest.length; i++){
			createLogNode(addedTest[i]);
		}
	}
	else{
		log.appendChild(logEmptyPara)
	}
	log.appendChild(logList);
}

var limitReached=false;

searchNextButton.onclick=function(){
	if(searchUnderway==false && !limitReached){
		index+=1;
		clearDisplay(log);
		searchDisplay();
	}
};

searchBackButton.onclick=function(){
	if((index-1)>0 && searchUnderway==false && !limitReached){
		index-=1;
		clearDisplay(log);
		searchDisplay();
	}
};

function showPrevNextButtons(){
	searchBackButtonDiv.setAttribute('class', 'searchBackButton');
  	searchBackButton.innerHTML='<-';
  	searchNextButton.innerHTML='->';
	searchBackButtonDiv.appendChild(searchBackButton);
	searchNextButtonDiv.appendChild(searchNextButton);
	searchNextButtonDiv.setAttribute('class', 'searchNextButton');
	log.appendChild(searchBackButtonDiv);
	log.appendChild(searchNextButtonDiv);
}

function addToLog(albumEl, searchResults){
	addedAlbumInfo = albumEl.nextSibling.textContent;
	addedAlbumName = searchResults['name'];
	addedAlbumArtist = searchResults['artist'];
	var searchString = addedAlbumInfo.replace(' - ',' ');
	searchString=searchString.replace(/ /g, '+');
	var albummbid = searchResults['mbid'];
	picLink = albumEl.lastChild.src;
	addedTest.push({pic: picLink, info: addedAlbumInfo, name: addedAlbumName, artist: addedAlbumArtist, mbid: albummbid});
	localStorage.setItem('addedArray', JSON.stringify(addedTest));
}

function createSearchNode(albumEl, searchResults){
	albumEl = document.createElement('li');
	var addButton = document.createElement('button');
	var addText = '+';
	for(var j = 0; j < addedTest.length; j++){
		if(searchResults!=null){
    		if(addedTest[j]['info'] == (searchResults['artist'] + ' - ' + searchResults['name'])){
    			addText='-';
    		}
		}
	}
	addButton.appendChild(document.createTextNode(addText));
	addButton.onclick = function(){
		this.innerHTML = (this.innerHTML == '-') ? '+' : '-';
		if(this.innerHTML == '-'){
			addToLog(this.parentNode.nextSibling, searchResults);
		}
		else
			removeFromLog(this.parentNode.parentNode);
	};
	var addButtonDiv = document.createElement('div');
	addButtonDiv.setAttribute('class', 'addButton');
	addButtonDiv.appendChild(addButton);
	var imgEl = document.createElement('img');
	var albumIcon = ((searchResults['image'][2]['#text']) ? 
		searchResults['image'][2]['#text'] : "./images/defaultalbum.png");
	imgEl.setAttribute('src', albumIcon);
	var albumInfo = (searchResults['artist'] + ' - ' + searchResults['name']);
	albumEl.appendChild(addButtonDiv);
	var imgElDiv=document.createElement('div');
	imgElDiv.setAttribute('class', 'albumArt');
	imgElDiv.appendChild(imgEl);
	albumEl.appendChild(imgElDiv);
	var albumInfoEl = document.createElement('div');
	albumInfoEl.setAttribute('class', 'albumInfo');
	var styleDiv1 = document.createElement('div');
	styleDiv1.setAttribute('class', 'styleDiv1');
	styleDiv1.appendChild(document.createTextNode(albumInfo));
	albumInfoEl.appendChild(styleDiv1);
	albumInfoEl.style.marginTop = '0';
	albumEl.appendChild(albumInfoEl);
	logList.appendChild(albumEl);
	log.appendChild(logList);
}

function showBackButton(){
	backButton.innerHTML='Back to log';
	backButton.onclick = goBack;
	backButtonDiv.setAttribute('class', 'backButton');
	backButtonDiv.appendChild(backButton);
	log.appendChild(backButtonDiv);
}

var errorPara = document.createElement('p');


function searchDisplay(){
	searchUnderway=true;
	contextHeader.textContent='Results for \''+currentSearch+'\':';
	logDisplayed = false;
	var requestURL = 'https://ws.audioscrobbler.com/2.0/?method=album.search&album=' + 
	currentSearch.replace('&', '%26') + 
	'&api_key=57ee3318536b23ee81d6b27e36997cde&limit=9&page='+index+'&format=json';
	console.log(requestURL);
	var request = new XMLHttpRequest();
	request.open('GET', requestURL);
	request.responseType = 'json';
	request.send();
	clearDisplay(log);
	request.onload = function(){
		showBackButton();
		var els = [];
		if (!request.response['results'] || request.response['error']){
			errorPara.innerText=(request.response['error'])?request.response['message']:'Unknown error occurred';
			log.appendChild(errorPara);
	    	searchUnderway=false;
	    	limitReached=true;
		}
		else{
			var searchResults = request.response['results']['albummatches']['album'];
			for (var i = 0; i < 9; i++){
				if(searchResults[i]!=null)
		    		createSearchNode(els[i], searchResults[i]);
		    	else{
		    		if (index==1 && i==0)
		    			log.appendChild(noResultsPara);
		    		searchUnderway=false;
		    		limitReached=true;
		    		break;
		    	}
		    	if(i==8)
					searchUnderway=false;
		    }
		 	showPrevNextButtons();
		 }
	};
}

function goBack(){
	currentSearch=null;
	index=1;
	clearDisplay(log);
	contextHeader.textContent='Your log:';
	
	
		logDisplay();
	
}

function clearDisplay(n){
	for (var i = n.children.length-1; i >= 0; i--){
		if (n.children[i]!=contextHeaderContainer){
			if (n.children[i].hasChildNodes())
				clearDisplay(n.children[i]);
			n.removeChild(n.children[i]);
		}
	}

}


function showViewStyle(){
	if(localStorage.getItem('viewStyle')==null){
		listMode = 'list';
		logList.setAttribute('id', listMode);
	}
	else{
		listMode=(localStorage.getItem('viewStyle')=="list")?'list':'grid';
		logList.setAttribute('id', listMode)
		if (localStorage.getItem('viewStyle')=="list")
			listViewButton.setAttribute('selected','');
		else
			tileViewButton.setAttribute('selected','');
	}
}

showViewStyle();

goBack();



