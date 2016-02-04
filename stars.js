var Stars = function(){
	this.stars = {}; // array
	this.temp = {};
	this.image = new Image();
	this.cxt = null;
	this.w = null;
	this.h = null;
	this.num = null;
	this.isAllOut = false;
}

Stars.prototype.drawStar = function(obj){
	this.cxt.beginPath();
	this.cxt.drawImage(this.image,obj.sx,obj.sy,7,7,obj.x,obj.y,7,7);
}

Stars.prototype.init = function(cxt,src,w,h,num){
	this.cxt = cxt;
	this.image.src = src;
	this.w = w;
	this.h = h;
	this.num = (num?num:50);
	var temp = this;
	this.image.onload = function(){
		temp.load(num);
	}
}

Stars.prototype.load = function(num){
	for (var i = 0; i < this.num; i++) {
		this.temp.isOut = false;
		this.temp.x = Math.floor(Math.random()*this.w);
		this.temp.y = Math.floor(Math.random()*this.h);
		this.temp.sx = Math.floor(Math.random()*7)*7;
		this.temp.sy = 0;
		this.temp.vx = 0; // Math.random()*2*(Math.random()*0.2-0.1);
		this.temp.vy = 0; //Math.random()*2*Math.random()*0.2-0.1;
		this.stars[i] = this.temp;
		this.temp = {};
		this.drawStar(this.stars[i]);
	}
}

Stars.prototype.update = function(){
	for(var i = 0;i < Object.keys(this.stars).length;i++){
		var obj = this.stars[i];
		// if(!this.isAllOut){obj.isOut = (obj.isOut?false:true);}
		if(!obj.isOut){
			if(Math.abs(obj.x - mousePoint.x) < 10 || Math.abs(obj.y - mousePoint.y) < 10){
				// obj.vx = Math.random()*50*(Math.random()*0.2-0.1);
				// obj.vy = Math.random()*50*(Math.random()*0.2-0.1);
				//obj.isOut = true;
			}else{
				obj.vx = Math.random()*0.01*(mousePoint.x-obj.x);
				obj.vy = Math.random()*0.01*(mousePoint.y-obj.y);
			}
		}
		// if(obj.x <= 0 || obj.x >= this.w || this.y <= 0 || obj.y >= this.h){
		// 	obj.isOut = false;
		// 	obj.vx = Math.random()*2*(Math.random()*0.2-0.1);
		// 	obj.vy = Math.random()*2*(Math.random()*0.2-0.1);
		// }
		obj.x += obj.vx;
		obj.y += obj.vy;
		if(obj.sx >= this.image.width){
			obj.sx = 0;
		}else{
			obj.sx += 1;
		}
		this.drawStar(obj);
	}
}