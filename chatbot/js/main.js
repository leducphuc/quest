(function() {
  "use-strict";
  let final = "";
	let currentInterval;
	let enable_recognition = false;

	var recognition = new webkitSpeechRecognition();
	var recognizing = false;
	var ignore_onend;
	var start_timestamp;
	var tts = false;

  //message
  let Message = function(arg) {
    (this.text = arg.text), (this.message_side = arg.message_side);
    this.draw = (function(_this) {
      return function() {
        var $message;
        $message = $(
          $(".message_template")
            .clone()
            .html()
        );
        $message
          .addClass(_this.message_side)
          .find(".text")
          .html(_this.text);
        $(".messages").append($message);
        return setTimeout(function() {
          return $message.addClass("appeared");
        }, 0);
      };
    })(this);
    return this;
  };

  function voiceEndCallback() {
		console.log('object')
		recognition.start();
  }

  var parameters = {
    onend: voiceEndCallback
  };

  // greeting message and voice

  function urlify(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url) {
      return '<a href="' + url + '">' + url + "</a>";
    });
  }

  let drawMessage = (text, side) => {
    var $messages;

    $(".message_input").val("");
    $messages = $(".messages");
    let display_text = urlify(text);
    var message = new Message({
      text: display_text,
      message_side: side
    });
    message.draw();
    if (responsiveVoice.voiceSupport() && side === "left") {
			if (enable_recognition) {
				responsiveVoice.speak(text,"UK English Female", parameters);
			} else {
				responsiveVoice.speak(text);
			}

    }

    $messages.animate(
      {
        scrollTop: $messages.prop("scrollHeight")
      },
      300
    );
  };

  drawMessage(greeting, "left");

  // main function
  $(function() {
    var sendMessage, receiveMessage;

    if (!("webkitSpeechRecognition" in window)) {
      upgrade();
    } else {
      start_button.style.display = "inline-block";
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = function() {
        console.log("Start");
        recognizing = true;
        $("#start_img").attr("src", "img/mic-animate.gif");
        tts = false;
      };

      // recognition error handle
      recognition.onerror = function(event) {
        console.log("Error");
        if (event.error == "no-speech") {
          $("#start_img").attr("src", "img/mic.gif");
        }
        if (event.error == "audio-capture") {
          $("#start_img").attr("src", "img/mic.gif");
          console.log("info_no_microphone");
        }
        if (event.error == "not-allowed") {
          if (event.timeStamp - start_timestamp < 100) {
            console.log("info_blocked");
          } else {
            console.log("info_denied");
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
        $("#start_img").attr("src", "img/mic.gif");
        if (final !== "") {
          sendMessage(getMessageText(), true);
          final = "";
        }
        tts = false;
      };

      // recognition transcript
      recognition.onresult = function(event) {
        var final_transcript = "";
        var interim_transcript = "";
        for (var i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final_transcript += event.results[i][0].transcript;
          } else {
            interim_transcript += event.results[i][0].transcript;
          }
        }
        if (final_transcript && tts == false) {
          console.log("Final: " + final_transcript);
          final = final_transcript;
          $(".message_input").val(final_transcript);
          sendMessage(getMessageText());
        } else if (interim_transcript) {
          console.log(interim_transcript);
          $(".message_input").val(interim_transcript);
        }
      };
    }

    const upgrade = () => {
      console.log("Upgrade");
      $("#start_button").hide();
    };

    const startButton = event => {
      if (recognizing) {
        recognition.stop();
        return;
      }

      recognition.lang = "en-GB";
      recognition.start();
      ignore_onend = false;
      $("#start_img").attr("src", "img/mic-slash.gif");
      console.log("info_allow");
      start_timestamp = event.timeStamp;
    };

    // get text value in message input
    getMessageText = () => {
      var $message_input;
      $message_input = $(".message_input");
      return $message_input.val();
    };

    // send and receive responce from server
    sendMessage = (text, isVoice = false) => {
      var $messages, message;

      // delete special characters before send to server
      var sent_text = text.trim().replace(/[_+-,!#$%^&*();\/|:\\<>"']/g, "");

      if (sent_text.trim() === "") {
        return;
      }

      // turn off recognition before send message
      if (isVoice) {
        tts = false;
      }

      if (recognizing) {
        recognition.stop();
      }

      if (currentInterval) {
        clearInterval(currentInterval);
      }

      drawMessage(text, "right");

      // send message to server and get response
      let time_before_send;

      $.ajax({
        method: "GET",
        url: end_point + sent_text + "&uid=" + uid,
        beforeSend: () => {
          $(".message_input").prop("disabled", true);
          $("#start_button").prop("disabled", true);
          time_before_send = new Date().getTime();
        },
        success: data => {
          const mes = data.dialogMessage;
          drawMessage(mes, "left");
        },
        error: () => {
          let long = new Date().getTime() - time_before_send;
          alert(`Fetching Error ${long} `);
        },
        complete: () => {
          $(".message_input").prop("disabled", false);
          $("#start_button").prop("disabled", false);

          $(".message_input").focus();
          currentInterval = setInterval(() => {
            const txt = "Please input something";
            drawMessage(txt, "left");
          }, 60000);
        },
        timeout: 10000
      });
    };

    $("#send_message").click(function(e) {
      sendMessage(getMessageText());
    });

    $(".message_input").keyup(function(e) {
      if (e.which === 13) {
        sendMessage(getMessageText());
      }
    });

    $("#start_button").click(function() {
      if (recognizing) {
				recognition.stop();
				enable_recognition = false;
        return;
      }

      if (responsiveVoice.isPlaying()) {
        responsiveVoice.cancel();
      }
      recognition.lang = "en-GB";
			recognition.start();
			enable_recognition = true;
      ignore_onend = false;
      $("#start_img").attr("src", "img/mic-slash.gif");
      console.log("info_allow");
      start_timestamp = event.timeStamp;
    });
  });
}.call(this));
