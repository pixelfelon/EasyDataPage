$(function(){
	$("#goCompute").click(function(){
		computeData($("#computeData").val(), $("#computeOperation").val(), function(result){
			$("#computeResult").text(result).show();
		});
	});
	
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

function computeData(data, operation, callback) {
	$.post(
		"/actions/compute",
		{data: data, operation: operation},
		function(result){
			if (typeof callback === 'function') callback(result);
		},
		"text"
	);
}