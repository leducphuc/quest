var Message;
var recognition = new webkitSpeechRecognition();
var recognizing = false;
var ignore_onend;
var start_timestamp;
var tts = false;
Message = function(arg) {
	this.text = arg.text, this.message_side = arg.message_side;
	this.draw = function(_this) {
		return function() {
			var $message;
			$message = $($('.message_template').clone().html());
			$message.addClass(_this.message_side).find('.text')
					.html(_this.text);
			$('.messages').append($message);
			return setTimeout(function() {
				return $message.addClass('appeared');
			}, 0);
		};
	}(this);
	return this;
};

if (!('webkitSpeechRecognition' in window)) {
	upgrade();
} else {
	start_button.style.display = 'inline-block';
	recognition.continuous = true;
	recognition.interimResults = true;

	recognition.onstart = function() {
		console.log("Start");
		recognizing = true;
		$('#start_img').attr('src', '/img/mic-animate.gif');
		tts = false;
	};

	recognition.onerror = function(event) {
		console.log("Error");
		if (event.error == 'no-speech') {
			$('#start_img').attr('src', '/img/mic.gif');
		}
		if (event.error == 'audio-capture') {
			$('#start_img').attr('src', '/img/mic.gif');
			console.log('info_no_microphone');
		}
		if (event.error == 'not-allowed') {
			if (event.timeStamp - start_timestamp < 100) {
				console.log('info_blocked');
			} else {
				console.log('info_denied');
			}
		}
		ignore_onend = true;
		recognizing = false;
		tts = false;
	};
	
	recognition.onspeechend = function() {
		console.log("onspeechend");
		recognition.stop();
	};
	
	recognition.onend = function() {
		console.log("onend");
		recognizing = false;
		if (ignore_onend) {
			return;
		}
		$('#start_img').attr('src', '/img/mic.gif');
		sendMessage(getMessageText());
		tts = false
	};

	recognition.onresult = function(event) {
		var final_transcript = '';
		var interim_transcript = '';
		for (var i = event.resultIndex; i < event.results.length; ++i) {
			if (event.results[i].isFinal) {
				final_transcript += event.results[i][0].transcript;
			} else {
				interim_transcript += event.results[i][0].transcript;
			}
		}
		if (final_transcript && tts == false) {
			console.log("Final: " + final_transcript);
			$('.message_input').val(final_transcript);
			sendMessage(getMessageText());
		}
	};
}

function startButton(event) {
	if (recognizing) {
		recognition.stop();
		return;
	}

	recognition.lang = "en-GB";
	recognition.start();
	ignore_onend = false;
	$('#start_img').attr('src', '/img/mic-slash.gif');
	console.log('info_allow');
	start_timestamp = event.timeStamp;
}

function upgrade() {
	console.log("Upgrade");
	$("#start_button").hide();
}

function getMessageText() {
	var $message_input;
	$message_input = $('.message_input');
	return $message_input.val();
};

function sendMessage(text) {
	var $messages, message;
	if (text.trim() === '') {
		return;
	}
	$('.message_input').val('');
	$messages = $('.messages');
	message = new Message({
		text : text,
		message_side : 'right'
	});
	message.draw();
	$messages.animate({
		scrollTop : $messages.prop('scrollHeight')
	}, 300);

	$.get("/chat?text=" + text + "&uid=" + uid, function(data, status) {
		message = new Message({
			text : data,
			message_side : 'left'
		});
		message.draw();
		$messages.animate({
			scrollTop : $messages.prop('scrollHeight')
		}, 300);

		if(responsiveVoice.voiceSupport()) {
			tts = true;
			responsiveVoice.speak(data);
		}
		tts = false;
	});
};