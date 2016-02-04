
var R = 60;
var bgImg = new Image(); //whole bg;
var RLmit = null; //limit of R for circle
var point = {}; // position for circle
var mousePoint = {}; // position of mouse
var isShowAll = false; // if display all image
var isReset = false; // if click reset button
var tapCount = 0; // prevent user keep clicking show all button;
var co = getId('canvas');
var cxtO = co.getContext("2d");
var cxtF = null;
var myTimer = null;
var stars = new Stars();

window.onload = function(){
	co.width = document.body.clientWidth;
	co.height = document.body.clientHeight;
	cxtO.m_drawBg("test.jpg",co.width,co.height);
	stars.init(cxtO,"star.png",co.width,co.height,100);
  co.addEventListener("mousemove",move,false);
}

CanvasRenderingContext2D.prototype.m_drawBg = function(src){
	bgImg.src = src;
	bgImg.onload = function(){
  	// var scale = bgImg.height/cxtO.canvas.height;
  	co.width = bgImg.width*canvas.height/bgImg.height;
  	drawBg();
  	createFrontCanvas();
  	bindClick();
  }
}

function drawBg(){
	cxtO.clearRect(0,0,cxtO.canvas.width,cxtO.canvas.height);
	// cxtO.beginPath();
	// cxtO.drawImage(bgImg,0,0,cxtO.canvas.width,cxtO.canvas.height);
	// var imageData = cxtO.getImageData(0,0,cxtO.canvas.width,cxtO.canvas.height);
	// imageData.data = reverseEffect(imageData.data);
	// cxtO.putImageData(imageData,0,0,0,0,cxtO.canvas.width,cxtO.canvas.height);
}

function getId(id){
	return document.getElementById(id);
}

function getPosition(x,y){
	var data = canvas.getBoundingClientRect();
	data.x = Math.floor(x-data.left);
	data.y = Math.floor(y-data.top);
	return ({x:(data.x < 0 || data.x > data.width?-1:data.x),y:(data.y < 0 || data.y > data.height?-1:data.y)});
}

function createFrontCanvas(){
	var temp = document.createElement('canvas');
	temp.width = co.width;
	temp.height = co.height;
	cxtF = temp.getContext("2d");
	cxtF.drawImage(bgImg,0,0,temp.width,temp.height);
	drawFrontBg();
}

function drawFrontBg(){
	drawBg();
	cxtO.save();
	cxtO.beginPath();
	if(!point.x || !isShowAll && isReset){
		point.x = Math.random()*(cxtO.canvas.width-2*R)+R;
		point.y = Math.random()*(cxtO.canvas.height-2*R)+R;
	}
	cxtO.arc(point.x,point.y,R,0,2*Math.PI);
	cxtO.clip();
	cxtO.drawImage(cxtF.canvas,point.x-R,point.y-R,2*R,2*R,point.x-R,point.y-R,2*R,2*R);
	cxtO.closePath();
	cxtO.restore();
}

function reverseEffect(data){
	for(var i =0; i<cxtO.canvas.width*cxtO.canvas.height;i++){
		data[4*i+0] = 255 - data[4*i+0];
		data[4*i+1] = 255 - data[4*i+1];
		data[4*i+2] = 255 - data[4*i+2];
	}
	return data;
}

function bindClick(){
	RLmit = Math.sqrt(co.width*co.width+co.height*co.height);
	getId("resetBtn").onclick = function(){
		resetPIC();
	}
	getId("showBtn").onclick = function(){
		if(tapCount == 1){return;}
		tapCount++;
		isShowAll = true;
		startShow();
	}
}

function startShow(){
	if(!isShowAll){return;}
	myTimer = setInterval(function(){
		if(R >= RLmit){
			clearInterval(myTimer); // cann't use clearInterval(this);
			isShowAll = false;
			// myTimer = null;
			tapCount = 0;
			return;
		}
		R += 50;
		drawFrontBg();
	},50);
}

function resetPIC(){
	R = 60;
	tapCount = 0;
	if(isShowAll == true){
		clearInterval(myTimer);
	}
	isShowAll = false;
	isReset = true;
	drawFrontBg();
	stars.load();
}

function move(e){
	mousePoint = getPosition((e.clientX?e.clientX:e.pageX),(e.clientY?e.clientY:e.pageY));
	if(mousePoint.x == -1 || mousePoint.y == -1){return;}
	isReset = false;
	// stars.isAllOut = false;
	lightling();
}

function lightling(){
	if(isReset){return;}
	drawFrontBg();
	stars.update();

	window.requestAnimFrame(lightling);
}

window.requestAnimFrame = (function() {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
		function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
			return window.setTimeout(callback, 1000 / 60);
		};
})();
