function getBrowserInfo(){
	var Sys = {};
	var ua = navigator.userAgent.toLowerCase();
  //alert(ua);
  
	var re =/(msie|firefox|chrome|opera|version|micromessenger).*?([\d.]+)/;
	var m = ua.match(re);
	Sys.info = ua;
	if(m){
		Sys.browser = m[1]?(m[1]=="version"?"safari":m[1]):"unknown";
		Sys.ver = m[2]?m[2]:"--";
	}
	sendBrowserInfo({browserInfo:Sys});
	return Sys;
}

function sendBrowserInfo(info){
	$.ajax({
		url: '/api',
		type: 'post',
		dataType: 'json',
		data: info,
	})
	.done(function() {
		//console.log("success");
	})
	.fail(function() {
		//console.log("error");
	})
	.always(function() {
		//console.log("complete");
	});
}