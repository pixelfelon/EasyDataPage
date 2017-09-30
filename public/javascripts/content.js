$(function(){
	$("#setSplash").click(function(){
		updateSplash($("#splashContent").val());
	});
});

function updateSplash(htmlContent, callback) {
	$.post(
		"/actions/splash",
		{content: htmlContent},
		function(result){
			if (typeof callback === 'function') callback();
		}
	);
}