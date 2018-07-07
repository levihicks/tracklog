var logList = document.createElement('ol');
var log = document.querySelector('.log');
var para = document.querySelector('.log p');
var searchButton = document.querySelector('.searchbar button');
var searchText = document.querySelector('.searchbar input');
var body = document.querySelector('body');

function setAlbumArtSize(size){
	var albumArtEl = document.querySelectorAll('.albumArt img');
	for(var i = 0; i<albumArtEl.length; i++){
		albumArtEl[i].style.height = size;
	}
	localStorage.setItem('albumArtSize', size);
}

var smallButton = document.getElementById('small');
smallButton.onclick = function(){
	setAlbumArtSize('32px');
};
var medButton = document.getElementById("med");
medButton.onclick = function(){
	setAlbumArtSize('48px');
};
var largeButton = document.getElementById("large");
largeButton.onclick = function(){
	setAlbumArtSize('64px');
};
var xtraLargeButton = document.getElementById("xtraLarge");
xtraLargeButton.onclick = function(){
	setAlbumArtSize('128px');
};

searchButton.onclick = function(){
	if(searchUnderway==false){
		if (searchText.value){
			currentSearch=searchText.value;
			index=0;
			clearDisplay();
			searchDisplay();
		}
	}
};
searchText.addEventListener("keyup", function(event) {
	if (event.keyCode === 13)
        searchButton.click();
});

var headEl = document.querySelector('head');

var listViewButton = document.getElementById("list");
listViewButton.onclick = function(){
	headEl.children[3].href = "styles/styleList.css";
	localStorage.setItem('viewStyle', "styles/styleList.css");
};

var tileViewButton = document.getElementById("tile");
tileViewButton.onclick = function(){
	headEl.children[3].href = "styles/styleGrid.css";
	localStorage.setItem('viewStyle', "styles/styleGrid.css");
};

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
var index=0;
var resultCount;
var vidLink;
var searchUnderway = false;
var currentSearch;
var bandcampLink;
var test = false;

function removeFromLog(albumEl){
	for (var k = 0; k < addedTest.length; k++){
		if(addedTest[k]['info'] == albumEl.children[2].textContent){
			if (logDisplayed == true){
				logList.removeChild(albumEl);
				if(!(logList.hasChildNodes()))
					para.style.display = 'block';
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
	if(localStorage.getItem('albumArtSize'))
		imgEl.style.height = localStorage.getItem('albumArtSize');
	else
		imgEl.style.height = '32px';
	imgEl.setAttribute('src', albumEl['pic']);

	imgElDiv.appendChild(imgEl);
	var el = document.createElement('li');
    
    el.appendChild(addButtonDiv);
    el.appendChild(imgElDiv);
    var albumInfoEl = document.createElement('div');
    albumInfoEl.setAttribute('class', 'albumInfo');
    albumInfoEl.appendChild(document.createTextNode(albumEl['info']));
    el.appendChild(albumInfoEl);

    var searchIconEl = document.createElement('img');
    var searchIconElDiv = document.createElement('div');
    searchIconElDiv.setAttribute('class', 'searchIcon');
    searchIconEl.setAttribute('src', './images/search.png');
    searchIconElDiv.appendChild(searchIconEl);
    searchIconElDiv.appendChild(document.createTextNode(':'));
    rightHalfDiv.appendChild(searchIconElDiv);

    var bandcampEl=document.createElement('a');
	var bandcampElDiv = document.createElement('div');
	bandcampElDiv.setAttribute('class', 'bandcamp')
	bandcampEl.setAttribute('href', albumEl['bandcamp']);
	var bandcampImg = document.createElement('img');
	bandcampImg.onmouseover=function(){
		this.setAttribute('src', './images/bandcampHover.png');
	};
	bandcampImg.onmouseout=function(){
		this.setAttribute('src', './images/bandcamp.png')
	};

	bandcampImg.setAttribute('src','./images/bandcamp.png');
	bandcampEl.appendChild(bandcampImg);
	bandcampElDiv.appendChild(bandcampEl);
	rightHalfDiv.appendChild(bandcampElDiv);

	var vidLinkEl=document.createElement('a');
	var vidLinkElDiv = document.createElement('div');
	vidLinkElDiv.setAttribute('class', 'youtube');
	vidLinkEl.setAttribute('href', albumEl['vid']);
	var vidImg = document.createElement('img');
	vidImg.onmouseover=function(){
		this.setAttribute('src', './images/YoutubeHover.png');
	};
	vidImg.onmouseout=function(){
		this.setAttribute('src', './images/Youtube.png')
	};
	
	vidImg.setAttribute('src','./images/Youtube.png');
	vidLinkEl.appendChild(vidImg);
	vidLinkElDiv.appendChild(vidLinkEl);
	rightHalfDiv.appendChild(vidLinkElDiv);

    var orderDiv = document.createElement('div');
    orderDiv.setAttribute('class', 'orderDiv');
    var moveUpButton = document.createElement('button');
    var moveUpButtonDiv = document.createElement('div');
    var moveDownButton = document.createElement('button');
    var moveDownButtonDiv = document.createElement('div');

    moveUpButtonDiv.setAttribute('class', 'moveUpButton');
    moveDownButtonDiv.setAttribute('class', 'moveDownButton');
    moveUpButton.appendChild(document.createTextNode('↑'));
    moveDownButton.appendChild(document.createTextNode('↓'));
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
    log.appendChild(logList);
}

function logDisplay(){
	if(localStorage.getItem('addedArray')){
		addedTest = JSON.parse(localStorage.getItem('addedArray'));
	}
	para.style.display = 'none';
	logDisplayed = true;
	for (var i = 0; i < addedTest.length; i++){
		createLogNode(addedTest[i]);
	}
}

searchNextButton.onclick=function(){
	if(searchUnderway==false){
		index+=9;
		clearDisplay();
		searchDisplay();
	}
};

searchBackButton.onclick=function(){
	if((index-9)>=0 && searchUnderway==false){
		index-=9;
		clearDisplay();
		searchDisplay();
	}
};

function showPrevNextButtons(){
	searchBackButtonDiv.setAttribute('class', 'searchBackButton');
  	searchBackButton.appendChild(document.createTextNode('<-'));
  	searchNextButton.appendChild(document.createTextNode('->'));
	searchBackButtonDiv.appendChild(searchBackButton);
	searchNextButtonDiv.appendChild(searchNextButton);
	searchNextButtonDiv.setAttribute('class', 'searchNextButton');
	log.appendChild(searchBackButtonDiv);
	log.appendChild(searchNextButtonDiv);
}

function addToLog(albumEl){
	addedAlbumInfo = albumEl.nextSibling.textContent;
	var searchString = addedAlbumInfo.replace(' - ',' ');
	searchString=searchString.replace(/ /g, '+');
	vidLink = 'https://www.youtube.com/results?search_query=' + searchString;
	bandcampLink = 'https://bandcamp.com/search?q=' + searchString;
	picLink = albumEl.lastChild.src;
	addedTest.push({pic: picLink, info: addedAlbumInfo, vid: vidLink, bandcamp: bandcampLink});
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
			addToLog(this.parentNode.nextSibling);
		}
		else
			removeFromLog(this.parentNode.parentNode);
	};
	var addButtonDiv = document.createElement('div');
	addButtonDiv.setAttribute('class', 'addButton');
	addButtonDiv.appendChild(addButton);
	var imgEl = document.createElement('img');
	if(localStorage.getItem('albumArtSize'))
		imgEl.style.height = localStorage.getItem('albumArtSize');
	else
		imgEl.style.height = '32px';
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
	albumInfoEl.appendChild(document.createTextNode(albumInfo));
	albumEl.appendChild(albumInfoEl);
	logList.appendChild(albumEl);
	log.appendChild(logList);
}

function showBackButton(){
	backButton.appendChild(document.createTextNode('Back to log'));
	backButton.onclick = goBack;
	backButtonDiv.setAttribute('class', 'backButton');
	backButtonDiv.appendChild(backButton);
	log.appendChild(backButtonDiv);
}

function searchDisplay(){
	searchUnderway=true;
	contextHeader.textContent='Results for \''+currentSearch+'\':';
	logDisplayed = false;
	para.style.display = 'none';
	var displayCount=index+10;
	var requestURL = 'https://ws.audioscrobbler.com/2.0/?method=album.search&album=' + 
	currentSearch.replace(' ', '+') + 
	'&api_key=57ee3318536b23ee81d6b27e36997cde&limit='+displayCount+'&format=json';
	var request = new XMLHttpRequest();
	request.open('GET', requestURL);
	request.responseType = 'json';
	request.send();
	clearDisplay();
	request.onload = function(){
		showBackButton();
		var els = [];
		var searchResults = request.response['results']['albummatches']['album'];
		for (var i = index; i < (index+9); i++){
			if(searchResults[i]!=null)
	    		createSearchNode(els[i], searchResults[i]);
	    	else
	    		break;
	    	if(i==index+8)
				searchUnderway=false;
	    }
	 	showPrevNextButtons();
	};
	
}

function goBack(){
	currentSearch=null;
	index=0;
	clearDisplay();
	contextHeader.textContent='Your log:';
	if (addedTest.length == 0 && (localStorage.getItem('addedArray'))==null){
		para.style.display = 'block';
	}
	else{
		logDisplay();
	}
}

function clearDisplay(){
	if(searchBackButtonDiv.hasChildNodes() && searchNextButtonDiv.hasChildNodes()){
		searchBackButton.removeChild(searchBackButton.lastChild);
		searchNextButton.removeChild(searchNextButton.lastChild);
		searchBackButton.innerHTML='';
		searchNextButton.innerHTML='';
		searchBackButtonDiv.removeChild(searchBackButton);
		searchNextButtonDiv.removeChild(searchNextButton);
		log.removeChild(searchBackButtonDiv);
		log.removeChild(searchNextButtonDiv);
	}
	if(backButtonDiv.hasChildNodes()){
		backButton.removeChild(backButton.lastChild);
		backButton.innerHTML='';
		backButtonDiv.removeChild(backButton);
		log.removeChild(backButtonDiv);
	}
	while(logList.hasChildNodes()){
			logList.removeChild(logList.lastChild);
	}
	if(logList.parentNode)
		logList.parentNode.removeChild(logList);
}

function showViewStyle(){
	if(localStorage.getItem('viewStyle')==null)
		headEl.children[3].href="styles/styleList.css";
	else{
		headEl.children[3].href=localStorage.getItem('viewStyle');
		if (localStorage.getItem('viewStyle')=="styles/styleList.css")
			listViewButton.setAttribute('selected','');
		else
			tileViewButton.setAttribute('selected','');
		switch(localStorage.getItem('albumArtSize')){
			case '48px':
				medButton.setAttribute('selected','');
				break;
			case '64px':
				largeButton.setAttribute('selected','');
				break;
			case '128px':
				xtraLargeButton.setAttribute('selected','');
				break;
		}
		
	}
}

showViewStyle();

goBack();



