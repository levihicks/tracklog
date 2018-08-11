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



var added = [];
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
var loadingPara = document.createElement('p');
loadingPara.innerText='Loading...';
function removeFromLog(albumEl){
	for (var k = 0; k < added.length; k++){
		if(added[k]['name'] == albumEl.children[2].querySelector('.album').textContent &&
			added[k]['artist'] == albumEl.children[2].querySelector('.artist').textContent){
			if (logDisplayed == true){
				logList.removeChild(albumEl);
				if(!(logList.hasChildNodes()))
					log.appendChild(logEmptyPara);
			}
			added.splice(k, 1);
			if(added.length==0){
				localStorage.removeItem('addedArray');
			}
			else{
				localStorage.setItem('addedArray', JSON.stringify(added));
			}
			break;
		}
		if (k == added.length-1)
	    	console.log('element to display not found!');
    }
}

function swapUp(albumEl){
	if(added.length > 1){
	    for(var j = 1; j < added.length; j++){
	    	if(added[j]['name'] == albumEl.children[2].querySelector('.album').textContent &&
			added[j]['artist'] == albumEl.children[2].querySelector('.artist').textContent){
	    		var tmp = added[j];
	    		added[j] = added[j-1];
	    		added[j-1] = tmp;
	    		localStorage.setItem('addedArray', JSON.stringify(added));
	    		logList.insertBefore(albumEl, albumEl.previousSibling);
	    	}
	    }
	}
}

function swapDown(albumEl){
	if(added.length > 1){
	    for(var l = 0; l < added.length-1; l++){
	    	if(added[l]['name'] == albumEl.children[2].querySelector('.album').textContent &&
			added[l]['artist'] == albumEl.children[2].querySelector('.artist').textContent){
	    		var tmp = added[l];
	    		added[l] = added[l+1];
	    		added[l+1] = tmp;
	    		localStorage.setItem('addedArray', JSON.stringify(added));
	    		logList.insertBefore(albumEl.nextSibling, albumEl);
	    		break;
	    	}
	    }
	}
}

function replaceChars(string){
	string=string.replace('%', '%25');
	string=string.replace('&', '%26');
	return string;
}

function addSummary(parent, infoSource){
	var summary = document.createElement('div');
	summary.setAttribute('class','summary');
	var summaryText=(infoSource['wiki'])?infoSource['wiki']['content']:'(No album summary available)';
	summary.innerHTML=summaryText;
	parent.appendChild(summary);
}

function addTrackList(parent, infoSource){
	var tracklist = document.createElement('ol');
	tracklist.setAttribute('id', 'tracklist');
	var tracksData = infoSource['tracks']['track'];
	for (var i = 0; i < tracksData.length; i++){
		createTrack(tracklist, tracksData[i]);
	}
	parent.appendChild(tracklist);
}

function createTrack(parent, data){
	var track = document.createElement('li');
	var trackTitle = data['name'];
	var seconds = ((data['duration']%60)<10)?'0'+(data['duration']%60):(data['duration']%60);
	var trackDuration = Math.floor(data['duration']/60)+':'+seconds;
	var trackTitleContainer = document.createElement('div');
	trackTitleContainer.setAttribute('class', 'trackTitle');
	trackTitleContainer.innerText=trackTitle;
	var trackDurationContainer = document.createElement('div');
	trackDurationContainer.setAttribute('class', 'trackDuration');
	trackDurationContainer.innerText=trackDuration;
	track.appendChild(trackTitleContainer);
	track.appendChild(trackDurationContainer);
	parent.appendChild(track);
}

function addArtistImage(request){
	var results = request.response['artist'];
	var artistImage = results['image'][4]['#text'];
	if (artistImage){
		var artistImageEl = document.createElement('img');
		artistImageEl.setAttribute('src', artistImage);
		var artistImageContainer = document.createElement('div');
		artistImageContainer.setAttribute('class', 'artistImage');
		artistImageContainer.appendChild(artistImageEl);
		(infoContainer.children[0])?infoContainer.insertBefore(artistImageContainer, 
			infoContainer.children[0]):infoContainer.appendChild(artistImageContainer);
	}
}

function displayInfo(request){
	log.removeChild(loadingPara);
	showBackButton();

	var results = request.response['album'];
	if(!results){
		if (request.response['error']){
			errorPara.innerText=request.response['message'];
			log.appendChild(errorPara);
		}
	}
	else{
		var nameArtistBioContainer = document.createElement('div');
		nameArtistBioContainer.setAttribute('class', 'nameArtistBio');
		addListInfo(nameArtistBioContainer, results);
		var artAndInfoContainer = document.createElement('div');
		artAndInfoContainer.setAttribute('class', 'artAndInfo');
		addListImage(artAndInfoContainer, results['image'][3]['#text']);
		addSummary(nameArtistBioContainer, results);
		artAndInfoContainer.appendChild(nameArtistBioContainer);
		infoContainer.appendChild(artAndInfoContainer);
		addTrackList(infoContainer, results);
		
		var requestURL2 = 'https://ws.audioscrobbler.com/2.0/?method=artist.getinfo'+
						  '&api_key=57ee3318536b23ee81d6b27e36997cde&artist='+
    					  results['artist']+'&format=json';
    	var request2 = new XMLHttpRequest();
    	request2.open('GET', requestURL2);
		request2.responseType = 'json';
		request2.send();
		request2.onload=function(){
			addArtistImage(request2);
		};
		log.appendChild(infoContainer);
	}
}


function loadInfo(n){
	var logIndex;
	for (var i = 0; i < logList.children.length; i++){
    		if (logList.children[i] == n)
    			logIndex = i;
    }
    var artist=replaceChars(added[logIndex]['artist']);
    var album=replaceChars(added[logIndex]['name']);
    requestIdString = (added[logIndex]['mbid'])?'&mbid='+added[logIndex]['mbid']:'&artist='+
    				artist+'&album='+album;
    var requestURL = 'https://ws.audioscrobbler.com/2.0/?method=album.getinfo&'+
    				 'api_key=57ee3318536b23ee81d6b27e36997cde'+requestIdString+'&format=json';
    console.log(requestURL);
    var request = new XMLHttpRequest();
	request.open('GET', requestURL);
	request.responseType = 'json';
	request.send();
	clearDisplay(log);
	log.appendChild(loadingPara);
	request.onload=function(){
		displayInfo(request);
	};
	

}

function addAddButton(parent, searchResults){
    var addButton = document.createElement('button');
	var addText = '+';
	if (searchResults==false)
		addText = '-';
	else{
		for(var j = 0; j < added.length; j++){
			if(searchResults!=null){
	    		if(added[j]['artist'] == searchResults['artist'] && added[j]['name'] == searchResults['name']){
	    			addText='-';
	    		}
			}
		}
	}
	addButton.innerText = addText;
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
	parent.appendChild(addButtonDiv);
}

function addMoreInfoLink(parent){
	var moreInfoLink = document.createElement('a');
    moreInfoLink.appendChild(document.createTextNode('[More Info]'));
    moreInfoLink.setAttribute('href', '#');
    moreInfoLink.setAttribute('class', 'moreInfoLink');
    moreInfoLink.setAttribute('onclick', 'loadInfo(this.parentNode.parentNode);');    
    parent.appendChild(moreInfoLink);
}

function addOrderDiv(parent){
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
    parent.appendChild(orderDiv);
}

function createLogNode(albumEl){
	var rightHalfDiv=document.createElement('div');
	rightHalfDiv.setAttribute('class', 'rightHalfDiv');
    
	var el = document.createElement('li');
	addAddButton(el, false);
    addListImage(el, albumEl['pic']);
    
    
    addListInfoContainer(el, albumEl);
    addMoreInfoLink(rightHalfDiv);
    addOrderDiv(rightHalfDiv);
    el.appendChild(rightHalfDiv);
    logList.appendChild(el);
}


function clearLog(){
	if(added.length){
		while(logList.hasChildNodes()){
			logList.removeChild(logList.lastChild);
		}
		while(added.length!=0){
			added.pop();
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
		added = JSON.parse(localStorage.getItem('addedArray'));
		for (var i = 0; i < added.length; i++){
			createLogNode(added[i]);
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
	addedAlbumName = searchResults['name'];
	addedAlbumArtist = searchResults['artist'];
	var searchString = addedAlbumName + ' ' + addedAlbumArtist;
	searchString=searchString.replace(/ /g, '+');
	var albummbid = searchResults['mbid'];
	picLink = albumEl.lastChild.src;
	added.push({pic: picLink, name: addedAlbumName, artist: addedAlbumArtist, mbid: albummbid});
	localStorage.setItem('addedArray', JSON.stringify(added));
}

function createSearchNode(albumEl, searchResults){
	albumEl = document.createElement('li');
	addAddButton(albumEl, searchResults);
	var albumIcon = ((searchResults['image'][2]['#text']) ? 
		searchResults['image'][2]['#text'] : "./images/defaultalbum.png");
	addListImage(albumEl, albumIcon);
	addListInfoContainer(albumEl, searchResults);
	logList.appendChild(albumEl);
	log.appendChild(logList);
}

function addListImage(parent, source){
	var imgEl = document.createElement('img');
	imgEl.setAttribute('src', source);	
	var imgElDiv=document.createElement('div');
	imgElDiv.setAttribute('class', 'albumArt');
	imgElDiv.appendChild(imgEl);
	parent.appendChild(imgElDiv);
}

function addListInfo(parent, infoSource){
	var albumNameContainer = document.createElement('div');
    albumNameContainer.setAttribute('class', 'album');
    albumNameContainer.innerText = infoSource['name'];
    albumNameContainer.setAttribute('title', infoSource['name']);
    var artistContainer = document.createElement('div');
    artistContainer.setAttribute('class', 'artist');
    artistContainer.innerText=infoSource['artist'];
    artistContainer.setAttribute('title', infoSource['artist']);
    parent.appendChild(albumNameContainer);
    parent.appendChild(artistContainer);
}

function addListInfoContainer(parent, infoSource){
	var albumInfoEl = document.createElement('div');
	albumInfoEl.setAttribute('class', 'albumInfo');
	var styleDiv1 = document.createElement('div');
	styleDiv1.setAttribute('class', 'styleDiv1');
	addListInfo(styleDiv1, infoSource);
	albumInfoEl.appendChild(styleDiv1);
	parent.appendChild(albumInfoEl);
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
	'&api_key=57ee3318536b23ee81d6b27e36997cde&limit=12&page='+index+'&format=json';
	console.log(requestURL);
	var request = new XMLHttpRequest();
	request.open('GET', requestURL);
	request.responseType = 'json';
	request.send();
	clearDisplay(log);
	log.appendChild(loadingPara);
	request.onload = function(){
		log.removeChild(loadingPara);
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
			for (var i = 0; i < 12; i++){
				if(searchResults[i]!=null)
		    		createSearchNode(els[i], searchResults[i]);
		    	else{
		    		if (index==1 && i==0)
		    			log.appendChild(noResultsPara);
		    		searchUnderway=false;
		    		limitReached=true;
		    		break;
		    	}
		    	if(i==11)
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



