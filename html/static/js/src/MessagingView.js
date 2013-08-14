define(['Ractive', 'rv!/static/templates/messaging.html'], function(Ractive, template){
	var Message = function(from, msg, type){
		this.type = type===undefined ? '' : ' '+type;
		this.timestamp = Date.create().format('{12hr}:{mm}:{ss}{tt}');
		this.from = from;
		this.msg = msg;
	};

	var messages_log = [];

	messages_log.push(new Message('system', 'Setting everything up...', 'system'));

	var MessagingView = Ractive.extend({
		el: document.getElementById('messaging_hold'),
		template:template,
		data: { messages: messages_log },
		new_message: function(msg){
			messages_log.push(new Message('John', 'Hello, David!'));
		},
		system_message: function(msg){
			messages_log.push(new Message('system', msg, 'system'));
		},
		error_message: function(msg){
			messages_log.push(new Message('error', msg, 'error'));
		}
	});

	return MessagingView;
});