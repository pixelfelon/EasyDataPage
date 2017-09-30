$(function(){
	setSplash(preload.content);
	window.setInterval(checkSplashContent, 5000);
});

function checkSplashContent() {
	$.get(
		"/splashcontent",
		setSplash,
		"html"
	);
}

function setSplash(content) {
	$("#content").html(content);
}