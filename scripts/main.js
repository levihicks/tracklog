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

var test = false;



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
	        				if(addedTest[k]['info'] == this.parentNode.parentNode.lastChild.previousSibling.previousSibling.textContent){
	        					
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
		imgEl.setAttribute('src', addedTest[i]['pic']);
		var el = document.createElement('li');
	    
	    el.appendChild(addButtonDiv);
	    el.appendChild(imgEl);
	    var albumInfoEl = document.createElement('div');
	    albumInfoEl.setAttribute('class', 'albumInfo');
	    albumInfoEl.appendChild(document.createTextNode(addedTest[i]['info']));
	    el.appendChild(albumInfoEl);

  		var vidLinkEl=document.createElement('a');
  		vidLinkEl.setAttribute('href', addedTest[i]['vid']);
  		var vidImg = document.createElement('img');
  		vidImg.setAttribute('src','../images/YouTube.png')
  		vidLinkEl.appendChild(vidImg);
  		el.appendChild(vidLinkEl);

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
	    			if(addedTest[j]['info'] == this.parentNode.parentNode.parentNode.lastChild.previousSibling.previousSibling.textContent){

	    				var tmp = addedTest[j];
	    				addedTest[j] = addedTest[j-1];
	    				addedTest[j-1] = tmp;
	    				localStorage.setItem('addedArray', JSON.stringify(addedTest));
	    				logList.insertBefore(this.parentNode.parentNode.parentNode, this.parentNode.parentNode.parentNode.previousSibling);
	    			}
	    		}
	    		
	    		
	    	}
	    };
	    moveDownButton.onclick=function(){
	    	if(addedTest.length > 1){
	    		for(var l = 0; l < addedTest.length-1; l++){
	    			if(addedTest[l]['info'] == this.parentNode.parentNode.parentNode.lastChild.previousSibling.previousSibling.textContent){
	    				var tmp = addedTest[l];
	    				addedTest[l] = addedTest[l+1];
	    				addedTest[l+1] = tmp;
	    				localStorage.setItem('addedArray', JSON.stringify(addedTest));
	    				logList.insertBefore(this.parentNode.parentNode.parentNode.nextSibling, this.parentNode.parentNode.parentNode);
	    				break;
	    			}
	    		}
	    	}
	    };
	    el.appendChild(orderDiv);
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
		var requestURL = 'https://ws.audioscrobbler.com/2.0/?method=album.search&album=' + 
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
		        		if(addedTest[j]['info'] == (searchResults[i]['artist'] + ' - ' + searchResults[i]['name'])){
		        			addText='-';
		        		}
	        		}
	        	}
	        	addButton.appendChild(document.createTextNode(addText));
	        	addButton.onclick = function(){
	        		this.innerHTML = (this.innerHTML == '-') ? '+' : '-';
	        		if(this.innerHTML == '-'){

	        			var requestURL1 = 'https://api.discogs.com/database/search?q=' + 
										 this.parentNode.nextSibling.nextSibling.textContent + 
										 '&key=vDlPrOQJMWWnHLxXNifp&secret=ZHunDCQtCTcijXBwMwyNGxhUMMoZFagF&page=1&per_page=100';
				      	var request1 = new XMLHttpRequest();

				      	request1.open('GET', requestURL1);
				      	request1.responseType = 'json';
				      	request1.send();

				      	request1.onload = function() {
				      		var discogResults = this.response['results'];
				      		for(var k = 0; k < 100; k++){
				      			for (var i = 0; i < addedTest.length; i++){
					      			if(discogResults[k]['title'] == addedTest[i]['info']){

					      				var requestURL2 = discogResults[k]['resource_url'];

					      				var request2 = new XMLHttpRequest();
					      				request2.open('GET', requestURL2);
					      				request2.responseType = 'json';
					      				request2.send();
					      				request2.onload = function() {
					      					var vidLink = request2.response['videos'][0]['uri'];
					      					
					      					for (var i = 0; i < addedTest.length; i++){

					      						if((request2.response['artists'][0]['name']+' - '+request2.response['title']) == 
					      							addedTest[i]['info']){
					      							
					      							addedTest[i]['vid'] = vidLink;
					      							localStorage.setItem('addedArray', JSON.stringify(addedTest));
					      							
					      							break;
					      						}
					 
					      					}
					      				};
					      				test = true;
					      				break;
					      				
					      			}
				      			}
					      		if (test == true)
					      			break;
					      		
				      		}	
				      	};
				      
	        			picLink = this.parentNode.nextSibling.src;
	        			addedAlbumInfo = this.parentNode.nextSibling.nextSibling.textContent;
	        			addedTest.push({pic: picLink, info: addedAlbumInfo});
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
	        	if(searchResults[i]!=null){
	        		var albumIcon = ((searchResults[i]['image'][1]['#text']) ? 
	        			searchResults[i]['image'][1]['#text'] : "./images/defaultalbum.png");
	        		imgEl.setAttribute('src', albumIcon);
	        	}
	        	else
	        		break;
	        	var albumInfo = (searchResults[i]['artist'] + ' - ' + searchResults[i]['name']);
	        	els[i].appendChild(addButtonDiv);
	        	els[i].appendChild(imgEl);
	        	var albumInfoEl = document.createElement('div');
	        	albumInfoEl.setAttribute('class', 'albumInfo');
	        	albumInfoEl.appendChild(document.createTextNode(albumInfo));
	        	els[i].appendChild(albumInfoEl);
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



