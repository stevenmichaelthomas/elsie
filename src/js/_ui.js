var ui = {};

ui.homeMode = function(){
	document.getElementById("brand").className = document.getElementById("brand").className.replace("tucked","");
}

ui.searchMode = function(){
	var d = document.getElementById("brand");
	d.className = d.className + " tucked";
}