
var R = 60;
var bgImg = new Image(); //whole bg;
var RLmit = null; //limit of R for circle
var point = {}; // position for circle
var mousePoint = {}; // position of mouse
var isShowAll = false; // if display all image
var isReset = false; // if click reset button
var tapCount = 0; // prevent user keep clicking show all button;
var co = getId('canvas');
var bgImage = getId('bgImage');
var controller = getId('controller');
var cxtO = co.getContext("2d");
var cxtF = null;
var myTimer = null;
var stars = new Stars();

window.onload = function(){
	cxtO.m_drawBg("test.jpg");
	
	co.addEventListener("mousemove",move,false);
	//alert(navigator.userAgent.toLowerCase());
}

window.addEventListener("resize", function() {
	console.log('resizeHV');
	setCanvasWH(function(){
		drawFrontBg();
		drawStar();
	});
}, false);

CanvasRenderingContext2D.prototype.m_drawBg = function(src){
	bgImg.src = src;
	bgImg.onload = function(){	
		setCanvasWH(function(){
			//drawBg();
			createFrontCanvas();
			drawStar();
			bindClick();
		});
		
	}
}

function setCanvasWH(cb){
	co.width = document.body.clientWidth;
	co.height = document.body.clientHeight;
	if(bgImg.width != 0){
		var scale1 = bgImg.width/bgImg.height;
		var scale2 = co.width/co.height;
		if(scale1 >=　scale2){
			co.height = bgImg.height*canvas.width/bgImg.width;
			bgImage.style.width = '100%';
			bgImage.style.height = 'auto';
			co.style.marginLeft = '-'+co.width/2+'px';
			co.style.marginTop = '-'+co.height/2+'px';
		}
		else{
			co.width = bgImg.width*canvas.height/bgImg.height;
			bgImage.style.height = '100%';
			bgImage.style.width = 'auto';
			co.style.marginLeft = '-'+co.width/2+'px';
			co.style.marginTop = '-'+co.height/2+'px';		
		}
		if(cxtF){
			cxtF.canvas.width = co.width;
			cxtF.canvas.height = co.height;
			cxtF.canvas.style.marginLeft = '-'+co.width/2+'px';
			cxtF.canvas.style.marginTop = '-'+co.height/2+'px';
			cxtF.drawImage(bgImg,0,0,cxtF.canvas.width,cxtF.canvas.height);
		}
	}
	if(cb){cb();}
}

function drawStar(){
	if(stars.cxt){
		stars.load(co.width,co.height);
	}else{
		stars.init(cxtO,"star.png",co.width,co.height,100);
	}
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
	temp.style.marginLeft = '-'+co.width/2+'px';
	temp.style.marginTop = '-'+co.height/2+'px';
	cxtF = temp.getContext("2d");
	cxtF.drawImage(bgImg,0,0,temp.width,temp.height);
	drawFrontBg();
}

function drawFrontBg(){
	cxtO.clearRect(0,0,cxtO.canvas.width,cxtO.canvas.height);
	//drawBg();
	cxtO.save();
	cxtO.beginPath();
	if(!point.x || !isShowAll && isReset){
		point.x = Math.random()*(cxtO.canvas.width-2*R)+R;
		point.y = Math.random()*(cxtO.canvas.height-2*R)+R;
	}
	cxtO.arc(point.x,point.y,R,0,2*Math.PI);
	cxtO.clip();
	var sx = point.x - R;
	var sy = point.y - R;
	cxtO.drawImage(cxtF.canvas,sx,sy,2*R,2*R,sx,sy,2*R,2*R);
	//cxtO.drawImage(cxtF.canvas,point.x-R,point.y-R,2*R,2*R,point.x-R,point.y-R,2*R,2*R);
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
		viewWholePIC();
	}
}

function startShow(){
	myTimer = setInterval(function(){
		if(R >= RLmit){
			clearInterval(myTimer); // cann't use clearInterval(this);
			return;
		}
		R += 50;
		drawFrontBg();
	},50);
}

function resetPIC(){
	R = 60;
	if(isShowAll == true){
		clearInterval(myTimer);
		if(bgImage.className == ""){
			bgImage.className += "blur";
		}
		
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

function viewWholePIC(){
	if(isShowAll){return;}
	isShowAll = true;
	cxtO.clearRect(0,0,cxtO.canvas.width,cxtO.canvas.height);
	var data = getBrowserInfo();
	if(data.browser == "chrome"){
		startShow();
	}
	else{
		// bgImage.className += ' showAnimation';
		bgImage.className = bgImage.className.replace("blur","");
		// bgImage.removeAttribute('class');
		// bgImage.animate(
		// 	{},
		// 	10000);
  }
  controller.innerHtml = "谢谢老板的红包";
}
