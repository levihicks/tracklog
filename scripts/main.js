var logList = document.createElement('ol');
var log = document.querySelector('.log');
var para = document.querySelector('.log p');
var searchButton = document.querySelector('.searchbar button');
var searchText = document.querySelector('.searchbar input');

searchButton.onclick = searchDisplay;
window.onkeydown = function(e) {
	    if (e.keyCode === 13) // enter
	      searchDisplay();
};

function searchDisplay() {
	if (searchText.value){
		para.style.display = 'none';
		var requestURL = 'http://ws.audioscrobbler.com/2.0/?method=album.search&album=' + 
						 searchText.value.replace(' ', '+') + 
						 '&api_key=57ee3318536b23ee81d6b27e36997cde&format=json';
      	var request = new XMLHttpRequest();
      	request.open('GET', requestURL);
      	request.responseType = 'json';
      	request.send();
      	request.onload = function() {
      		while(logList.hasChildNodes()){
			logList.removeChild(logList.lastChild);
			}
      		var els = [];
        	var searchResults = request.response['results']['albummatches']['album'];
        	for (var i = 0; i < 10; i++){
	        	els[i] = document.createElement('li');
	        	var imgEl = document.createElement('img');
	        	if(searchResults[i]!=null){
	        		var albumIcon = ((searchResults[i]['image'][0]['#text']) ? 
	        			searchResults[i]['image'][0]['#text'] : "./images/defaultalbum.png");
	        		imgEl.setAttribute('src', albumIcon);
	        	}
	        	else
	        		break;
	        	var albumInfo = (searchResults[i]['name'] + ' - ' + searchResults[i]['artist']);
	        	var testDiv = document.createElement('div');
	        	testDiv.setAttribute('class', 'testDiv');
	        	testDiv.appendChild(imgEl);
	        	var albumInfoEl = document.createElement('div');
	        	albumInfoEl.setAttribute('class', 'albumInfo');
	        	albumInfoEl.appendChild(document.createTextNode(albumInfo));
	        	testDiv.appendChild(albumInfoEl);
	        	els[i].appendChild(testDiv);
	        	logList.appendChild(els[i]);
	        	log.appendChild(logList);
	        }
      };
	} else {
		goBack();
	}

}

function goBack(){
	while(logList.hasChildNodes()){
			logList.removeChild(logList.lastChild);
		}
		if(logList.parentNode)
			logList.parentNode.removeChild(logList);
		para.style.display = 'block';
}
