var logList = document.createElement('ol');
var log = document.querySelector('.log');
var para = document.querySelector('.log p');
var searchButton = document.querySelector('.searchbar button');
var searchText = document.querySelector('.searchbar input');
var body = document.querySelector('body');
var smallButton = document.getElementById('small');
smallButton.onclick = function(){
	var albumArtEl = document.querySelectorAll('.albumArt img');
	for(var i = 0; i<albumArtEl.length; i++){
		albumArtEl[i].style.height = '32px';
		
	}
	localStorage.setItem('albumArtSize', '32px');
	
};

var medButton = document.getElementById("med");
medButton.onclick = function(){
	var albumArtEl = document.querySelectorAll('.albumArt img');
	for(var i = 0; i<albumArtEl.length; i++){
		albumArtEl[i].style.height = '48px';
		
	}
	localStorage.setItem('albumArtSize', '48px');
};

var largeButton = document.getElementById("large");
largeButton.onclick = function(){
	var albumArtEl = document.querySelectorAll('.albumArt img');
	for(var i = 0; i<albumArtEl.length; i++){
		albumArtEl[i].style.height = '64px';
		
	}
	localStorage.setItem('albumArtSize', '64px');
};




searchButton.onclick = function(){
	if(searchUnderway==false){
		index=0;
		currentSearch=searchText.value;
		searchDisplay();
	}
};
searchText.addEventListener("keyup", function(event) {
	if (event.keyCode === 13) {
        searchButton.click();
    }
});


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



function logDisplay(){
	if(localStorage.getItem('addedArray')){
		addedTest = JSON.parse(localStorage.getItem('addedArray'));
	}
	para.style.display = 'none';
	logDisplayed = true;
	for (var i = 0; i < addedTest.length; i++){
		var rightHalfDiv=document.createElement('div');
		rightHalfDiv.setAttribute('class', 'rightHalfDiv');
		var addButton = document.createElement('button');
		addButton.appendChild(document.createTextNode('-'));
		var addButtonDiv = document.createElement('div');
	    addButtonDiv.setAttribute('class', 'addButton');
	    addButtonDiv.appendChild(addButton);
	    addButton.onclick=function(){
	    	for (var k = 0; k < addedTest.length; k++){
	        				if(addedTest[k]['info'] == this.parentNode.parentNode.children[2].textContent){
	        					
	        					if (logDisplayed == true){
	        						logList.removeChild(this.parentNode.parentNode);
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
	        }
	    };
		var imgEl = document.createElement('img');
		var imgElDiv = document.createElement('div');
		imgElDiv.setAttribute('class', 'albumArt');
		if(localStorage.getItem('albumArtSize'))
			imgEl.style.height = localStorage.getItem('albumArtSize');
		else
			imgEl.style.height = '32px';
		imgEl.setAttribute('src', addedTest[i]['pic']);

		imgElDiv.appendChild(imgEl);
		var el = document.createElement('li');
	    
	    el.appendChild(addButtonDiv);
	    el.appendChild(imgElDiv);
	    var albumInfoEl = document.createElement('div');
	    albumInfoEl.setAttribute('class', 'albumInfo');
	    albumInfoEl.appendChild(document.createTextNode(addedTest[i]['info']));
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
  		bandcampEl.setAttribute('href', addedTest[i]['bandcamp']);
  		var bandcampImg = document.createElement('img');
  		bandcampImg.onmouseover=function(){
  			if(this.getAttribute('src')=='./images/bandcamp.png')
  				this.setAttribute('src', './images/bandcampHover.png');
  		};
  		bandcampImg.onmouseout=function(){
  			if(this.getAttribute('src')=='./images/bandcampHover.png')
  				this.setAttribute('src', './images/bandcamp.png')
  		};

  		bandcampImg.setAttribute('src','./images/bandcamp.png');
  		bandcampEl.appendChild(bandcampImg);
  		bandcampElDiv.appendChild(bandcampEl);
  		rightHalfDiv.appendChild(bandcampElDiv);

  		var vidLinkEl=document.createElement('a');
  		var vidLinkElDiv = document.createElement('div');
  		vidLinkElDiv.setAttribute('class', 'youtube');
  		vidLinkEl.setAttribute('href', addedTest[i]['vid']);
  		var vidImg = document.createElement('img');
  		vidImg.onmouseover=function(){
  			if(this.getAttribute('src')=='./images/Youtube.png')
  				this.setAttribute('src', './images/YoutubeHover.png');
  		};
  		vidImg.onmouseout=function(){
  			if(this.getAttribute('src')=='./images/YoutubeHover.png')
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
	    	if(addedTest.length > 1){
	    		for(var j = 1; j < addedTest.length; j++){
	    			if(addedTest[j]['info'] == this.parentNode.parentNode.parentNode.parentNode.children[2].textContent){

	    				var tmp = addedTest[j];
	    				addedTest[j] = addedTest[j-1];
	    				addedTest[j-1] = tmp;
	    				localStorage.setItem('addedArray', JSON.stringify(addedTest));
	    				logList.insertBefore(this.parentNode.parentNode.parentNode.parentNode, this.parentNode.parentNode.parentNode.parentNode.previousSibling);
	    			}
	    		}
	    		
	    		
	    	}
	    };
	    moveDownButton.onclick=function(){
	    	if(addedTest.length > 1){
	    		for(var l = 0; l < addedTest.length-1; l++){
	    			if(addedTest[l]['info'] == this.parentNode.parentNode.parentNode.parentNode.children[2].textContent){
	    				var tmp = addedTest[l];
	    				addedTest[l] = addedTest[l+1];
	    				addedTest[l+1] = tmp;
	    				localStorage.setItem('addedArray', JSON.stringify(addedTest));
	    				logList.insertBefore(this.parentNode.parentNode.parentNode.parentNode.nextSibling, this.parentNode.parentNode.parentNode.parentNode);
	    				break;
	    			}
	    		}
	    	}
	    };
	    rightHalfDiv.appendChild(orderDiv);
	    el.appendChild(rightHalfDiv);
	    logList.appendChild(el);
	    log.appendChild(logList);
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
}


function searchDisplay() {
	if (currentSearch){
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
      	request.onload = function() {
      		
      		var els = [];
        	var searchResults = request.response['results']['albummatches']['album'];
        	for (var i = index; i < (index+9); i++){
	        	els[i] = document.createElement('li');
	        	var addButton = document.createElement('button');
	        	var addText = '+';
	        	for(var j = 0; j < addedTest.length; j++){
	        		if(searchResults[i]!=null){
		        		if(addedTest[j]['info'] == (searchResults[i]['artist'] + ' - ' + searchResults[i]['name'])){
		        			addText='-';
		        		}
	        		}
	        	}
	        	addButton.appendChild(document.createTextNode(addText));
	        	addButton.onclick = function(){
	        		this.innerHTML = (this.innerHTML == '-') ? '+' : '-';
	        		if(this.innerHTML == '-'){
						addedAlbumInfo = this.parentNode.nextSibling.nextSibling.textContent;
						var searchString = addedAlbumInfo.replace(' - ',' ');
						searchString=searchString.replace(/ /g, '+');
	        			vidLink = 'https://www.youtube.com/results?search_query=' + searchString;
	        			bandcampLink = 'https://bandcamp.com/search?q=' + searchString;
	        			
	        			picLink = this.parentNode.nextSibling.lastChild.src;
	        			addedTest.push({pic: picLink, info: addedAlbumInfo, vid: vidLink, bandcamp: bandcampLink});
	        			localStorage.setItem('addedArray', JSON.stringify(addedTest));
	        		}
	        		else{
	        			for (var k = 0; k < addedTest.length; k++){
	        				if(addedTest[k]['info'] == this.parentNode.parentNode.lastChild.textContent){
	        					
	        					if (logDisplayed == true){
	        						logList.removeChild(this.parentNode.parentNode);
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
	        	}
	        	var addButtonDiv = document.createElement('div');
	        	addButtonDiv.setAttribute('class', 'addButton');
	        	addButtonDiv.appendChild(addButton);
	        	var imgEl = document.createElement('img');
	        	if(localStorage.getItem('albumArtSize'))
					imgEl.style.height = localStorage.getItem('albumArtSize');
				else
					imgEl.style.height = '32px';
	        	if(searchResults[i]!=null){
	        		var albumIcon = ((searchResults[i]['image'][2]['#text']) ? 
	        			searchResults[i]['image'][2]['#text'] : "./images/defaultalbum.png");
	        		imgEl.setAttribute('src', albumIcon);
	        	}
	        	else
	        		break;
	        	var albumInfo = (searchResults[i]['artist'] + ' - ' + searchResults[i]['name']);
	        	els[i].appendChild(addButtonDiv);
	        	var imgElDiv=document.createElement('div');
	        	imgElDiv.setAttribute('class', 'albumArt');
	        	imgElDiv.appendChild(imgEl);
	        	els[i].appendChild(imgElDiv);
	        	var albumInfoEl = document.createElement('div');
	        	albumInfoEl.setAttribute('class', 'albumInfo');
	        	albumInfoEl.appendChild(document.createTextNode(albumInfo));
	        	els[i].appendChild(albumInfoEl);
	        	logList.appendChild(els[i]);
	        	log.appendChild(logList);
	        	if(i==index+8)
	        		searchUnderway=false;
	        }
	        
      
     		searchBackButtonDiv.setAttribute('class', 'searchBackButton');
      		searchBackButton.appendChild(document.createTextNode('<-'));
      		searchNextButton.appendChild(document.createTextNode('->'));
      		searchBackButtonDiv.appendChild(searchBackButton);
      		searchNextButtonDiv.appendChild(searchNextButton);
      		searchNextButtonDiv.setAttribute('class', 'searchNextButton');
      		log.appendChild(searchBackButtonDiv);
      		log.appendChild(searchNextButtonDiv);
      };
      backButton.appendChild(document.createTextNode('Back to log'));
      backButton.onclick = goBack;
      backButtonDiv.setAttribute('class', 'backButton');
      backButtonDiv.appendChild(backButton);
      log.appendChild(backButtonDiv);

	} 

}

function goBack(){
	currentSearch=null;
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
	if(backButtonDiv.hasChildNodes() && searchBackButtonDiv.hasChildNodes() && searchNextButtonDiv.hasChildNodes()){
		backButton.removeChild(backButton.lastChild);
		searchBackButton.removeChild(searchBackButton.lastChild);
		searchNextButton.removeChild(searchNextButton.lastChild);
		backButton.innerHTML='';
		searchBackButton.innerHTML='';
		searchNextButton.innerHTML='';
		backButtonDiv.removeChild(backButton);
		searchBackButtonDiv.removeChild(searchBackButton);
		searchNextButtonDiv.removeChild(searchNextButton);
		log.removeChild(backButtonDiv);
		log.removeChild(searchBackButtonDiv);
		log.removeChild(searchNextButtonDiv);
	}
	while(logList.hasChildNodes()){
			logList.removeChild(logList.lastChild);
	}
	if(logList.parentNode)
		logList.parentNode.removeChild(logList);
}

goBack();



