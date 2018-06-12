var logList = document.createElement('ol');
var log = document.querySelector('.log');
var para = document.querySelector('.log p');
var searchButton = document.querySelector('.searchbar button');
var searchText = document.querySelector('.searchbar input');
var body = document.querySelector('body');

searchButton.onclick = function(){
	index=0;
	searchDisplay();
};
window.onkeydown = function(e) {
		if(searchText.value)
			index=0;
	    if (e.keyCode === 13){ // enter
	      searchDisplay();
	     }
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


function logDisplay(){
	if(localStorage.getItem('addedArray')){
		addedTest = JSON.parse(localStorage.getItem('addedArray'));
	}
	para.style.display = 'none';
	logDisplayed = true;
	for (var i = 0; i < addedTest.length; i++){
		var addButton = document.createElement('button');
		addButton.appendChild(document.createTextNode('-'));
		var addButtonDiv = document.createElement('div');
	    addButtonDiv.setAttribute('class', 'addButton');
	    addButtonDiv.appendChild(addButton);
	    addButton.onclick=function(){
	    	for (var k = 0; k < addedTest.length; k++){
	        				if(addedTest[k]['info'] == this.parentNode.parentNode.lastChild.textContent){
	        					
	        					if (logDisplayed == true){
	        						logList.removeChild(this.parentNode.parentNode.parentNode);
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
		imgEl.setAttribute('src', addedTest[i]['pic']);
		var testDiv = document.createElement('div');
	    testDiv.setAttribute('class', 'testDiv');
	    testDiv.appendChild(addButtonDiv);
	    testDiv.appendChild(imgEl);
	    var albumInfoEl = document.createElement('div');
	    albumInfoEl.setAttribute('class', 'albumInfo');
	    albumInfoEl.appendChild(document.createTextNode(addedTest[i]['info']));
	    testDiv.appendChild(albumInfoEl);
	    var el = document.createElement('li');
	    el.appendChild(testDiv)
	    logList.appendChild(el);
	    log.appendChild(logList);
	}
}

searchNextButton.onclick=function(){
	index+=9;
	clearDisplay();
	searchDisplay();
};

searchBackButton.onclick=function(){
	if((index-9)>=0){
		index-=9;
		clearDisplay();
		searchDisplay();
	}
}


function searchDisplay() {
	if (searchText.value){
		contextHeader.textContent='Results for \''+searchText.value+'\':';
		logDisplayed = false;
		para.style.display = 'none';
		var displayCount=index+10;
		var requestURL = 'http://ws.audioscrobbler.com/2.0/?method=album.search&album=' + 
						 searchText.value.replace(' ', '+') + 
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
		        		if(addedTest[j]['info'] == (searchResults[i]['name'] + ' // ' + searchResults[i]['artist'])){
		        			addText='-';
		        		}
	        		}
	        	}
	        	addButton.appendChild(document.createTextNode(addText));
	        	addButton.onclick = function(){
	        		this.innerHTML = (this.innerHTML == '-') ? '+' : '-';
	        		if(this.innerHTML == '-'){
	        			picLink = this.parentNode.nextSibling.src;
	        			addedAlbumInfo = this.parentNode.nextSibling.nextSibling.textContent;
	        			addedTest.push({pic: picLink, info: addedAlbumInfo});
	        			localStorage.setItem('addedArray', JSON.stringify(addedTest));
	        		}
	        		else{
	        			for (var k = 0; k < addedTest.length; k++){
	        				if(addedTest[k]['info'] == this.parentNode.parentNode.lastChild.textContent){
	        					
	        					if (logDisplayed == true){
	        						logList.removeChild(this.parentNode.parentNode.parentNode);
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
	        	if(searchResults[i]!=null){
	        		var albumIcon = ((searchResults[i]['image'][1]['#text']) ? 
	        			searchResults[i]['image'][1]['#text'] : "./images/defaultalbum.png");
	        		imgEl.setAttribute('src', albumIcon);
	        	}
	        	else
	        		break;
	        	var albumInfo = (searchResults[i]['name'] + ' // ' + searchResults[i]['artist']);
	        	var testDiv = document.createElement('div');
	        	testDiv.setAttribute('class', 'testDiv');
	        	testDiv.appendChild(addButtonDiv);
	        	testDiv.appendChild(imgEl);
	        	var albumInfoEl = document.createElement('div');
	        	albumInfoEl.setAttribute('class', 'albumInfo');
	        	albumInfoEl.appendChild(document.createTextNode(albumInfo));
	        	testDiv.appendChild(albumInfoEl);
	        	els[i].appendChild(testDiv);
	        	logList.appendChild(els[i]);
	        	log.appendChild(logList);
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



