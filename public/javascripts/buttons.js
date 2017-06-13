var station, token;
var ready = false;
var thanksNextTimeout = null;

$(setupPrompt);

function setupPrompt(){
	station = "";
	token = "";
	
	while (station == "") {
		station = prompt("Enter button station name.");
	}
	while (token == "") {
		token = prompt("Enter authentication token.");
	}
	if (station === null || token === null) {
		alert("Both the station ID and auth token must be configured to use this page. You can re-run this prompt from the menu in the upper right.");
	} else if (!ready) {
		ready = true;
		prepare();
		sendFeel(0);
	}
}

function prepare(){
	$('#content').addClass('active');
	$('.button').each(function(){
		var button = $(this);
		var inter = button.attr('id').match(/^b-([0-9]+)$/);
		if (inter === null) return;
		var id = parseInt(inter[1]);
		button.attr('data-button-id', id)
		button.click(function(){
			sendFeel(parseInt($(this).attr('data-button-id')));
		});
	});
}

function sendFeel(id){
	console.log("Sending a "+id+"!");
	if (!(station && token)) {
		alert("Both the station ID and auth token must be configured to use this page.");
		setupPrompt();
		return;
	}
	
	$.ajax({
		contentType: 'application/json',
		data: JSON.stringify({
			station: station,
			token: token,
			feel: id
		}),
		dataType: "json",
		method: "POST",
		url: "/button",
		
		success: function(data){
			if (data.error) {
				switch (data.error) {
					case "invalid station":
					case "invalid token":
						alert("The server did not accept your configuration. Please re-enter.");
						setupPrompt();
						break;
					default:
						console.error("Server error: "+data.error);
						break;
				}
			}
		}
	});
	showThanks();
}

function showThanks(){
	if(thanksNextTimeout !== null) {
		window.clearTimeout(thanksNextTimeout);
		thanksNextTimeout = null;
	}
	var thanks = $("#thanks-msg");
	thanks.addClass("active");
	thanksNextTimeout = window.setTimeout(function(){
		thanks.removeClass("active");
	}, 1500);
}