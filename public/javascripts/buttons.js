var station, token;
var ready = false;
var thanksNextTimeout = null;

$(setupPrompt);

function setupPrompt(force) {
	force = typeof force !== 'undefined' ? force : false;
	
	if (force === true) {
		station = "";
		token = "";
	} else {
		station = window.localStorage.getItem('auth-station');
		if (station === null) station = "";
		
		token = window.localStorage.getItem('auth-token');
		if (token === null) token = "";
	}
	
	while (station === "") {
		station = prompt("Enter button station name.");
	}
	while (token === "") {
		token = prompt("Enter authentication token.");
	}
	
	if (station === null || token === null) {
		alert("Both the station ID and auth token must be configured to use this page. You can re-run this prompt from the menu in the upper right.");
	} else {
		if (!ready) {
			ready = true;
			prepare();
		}
		sendFeel(0, function() {
			window.localStorage.setItem('auth-station', station);
			window.localStorage.setItem('auth-token', token);
		});
	}
}

function prepare() {
	$('#content').addClass('active');
	$('.button').each(function() {
		var button = $(this);
		var inter = button.attr('id').match(/^b-([0-9]+)$/);
		if (inter === null) return;
		var id = parseInt(inter[1]);
		button.attr('data-button-id', id);
		button.click(function() {
			sendFeel(parseInt($(this).attr('data-button-id')));
		});
	});
}

function sendFeel(id, callback) {
	callback = typeof callback === 'function' ? callback : function(){};
	
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
		
		success: function(data) {
			if (data.error) {
				switch (data.error) {
					case "invalid station":
					case "invalid token":
						alert("The server did not accept your configuration. Please re-enter.");
						window.localStorage.removeItem('auth-station');
						window.localStorage.removeItem('auth-token');
						setupPrompt(true);
						break;
					default:
						console.error("Server error: "+data.error);
						break;
				}
			} else {
				callback();
			}
		}
	});
	
	showThanks();
}

function showThanks(){
	if (thanksNextTimeout !== null) {
		window.clearTimeout(thanksNextTimeout);
		thanksNextTimeout = null;
	}
	var thanks = $("#thanks-msg");
	thanks.addClass("active");
	thanksNextTimeout = window.setTimeout(function() {
		thanks.removeClass("active");
	}, 1500);
}

function toggleFullscreen() {
	if (window.fscreen.fullscreenElement !== null) {
		window.fscreen.exitFullscreen();
	} else {
		window.fscreen.requestFullscreen(document.documentElement);
	}
}