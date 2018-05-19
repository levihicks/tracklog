var logList = document.createElement('ol');
var log = document.querySelector('.log');
var para = document.querySelector('.log p');


function test(){
	para.style.display = 'none';
	var el = document.createElement('li');
	el.textContent = "hi";
	logList.appendChild(el);
	log.appendChild(logList);

}