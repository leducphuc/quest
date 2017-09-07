(function () {
	var Message;
	Message = function (arg) {
		this.text = arg.text, this.message_side = arg.message_side;
		this.draw = function (_this) {
			return function () {
				var $message;
				$message = $($('.message_template').clone().html());
				$message.addClass(_this.message_side).find('.text').html(
					_this.text);
				$('.messages').append($message);
				return setTimeout(function () {
					return $message.addClass('appeared');
				}, 0);
			};
		}(this);
		return this;
	};

	$(function () {
		var $messages;
		const greeting = "Hi there. I am the TTX Service Desk Chatbot. I can support you to reset your password or unlock your account. So how may I help you now?";
		var message = new Message({
			text: greeting,
			message_side: 'left'
		});
		message.draw();
		if (responsiveVoice.voiceSupport()) {
			responsiveVoice.speak(greeting);
		}
	})

	$(function () {
		var getMessageText, message_side, sendMessage, receiveMessage;
		const url_prot = "https://demo-sg.fsoft-hcm.net/ttx-help-desk-SNAPSHOT/service/nlu?text=";

		message_side = 'right';
		getMessageText = function () {
			var $message_input;
			$message_input = $('.message_input');
			return $message_input.val();
		};

		sendMessage = function (text) {
			var $messages, message;
			if (text.trim() === '') {
				return;
			}
			var sent_text = text.replace(/[_+-,!#$%^&*();\/|<>"']/g, '');
			$('.message_input').val('');
			$messages = $('.messages');
			message = new Message({
				text: text,
				message_side: message_side
			});
			message.draw();
			$messages.animate({
				scrollTop: $messages.prop('scrollHeight')
			}, 300);

			$.get(url_prot + sent_text + "&uid=" + uid, function (data, status) {
				const mes = data.dialogMessage;
				message = new Message({
					text: mes,
					message_side: 'left'
				});

				message.draw();
				$messages.animate({
					scrollTop: $messages.prop('scrollHeight')
				}, 300);
				if (responsiveVoice.voiceSupport()) {
					responsiveVoice.speak(mes);
				}
			});
		};

		$('#send_message').click(function (e) {
			sendMessage(getMessageText());
		});
		$('.message_input').keyup(function (e) {
			if (e.which === 13) {
				sendMessage(getMessageText());
			}
		});
	});
}.call(this));