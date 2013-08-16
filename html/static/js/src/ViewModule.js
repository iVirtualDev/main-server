define(['Ractive', 'rv!/static/templates/view.html', 'url', 'src/MessageClass', 'sizzle'], function(Ractive, template, url, Message, Sizzle) {
	var ViewModule = Ractive.extend({
		module_id: "ViewModule",
		el: document.getElementById('page_content'),
		template: template,
		data: {
			sid: url("path").replace(/\//gi, ""),
			session_link: 'Loading...',
			fatalError: false,
			fatal_error_message: 'Unknown Error!',
			messages: [],
			chat_available: true
		},
		init: function(callback) {
			this.dbug('coming online...');
			callback(null);
		},
		publishMessage: function(msg) {
			this.dbug('Publishing message to view...');
			if (msg instanceof Message) {
				this.data.messages.push(msg);
				var chatbox = document.getElementById('chat');
				chatbox.scrollTop = chatbox.scrollHeight;
			} else {
				log.warn("{1} - {2}: {3}".assign(Date.create().format(base.timestamp_fmt), this.module_id, "publishMessage didn't receive a 'Message' object"));
			}
		},
		dbug: function() {
			var stamp = "{1} - {2}: ".assign(Date.create().format(base.timestamp_fmt), this.module_id);
			var args = Array.prototype.slice.call(arguments);
			args.unshift(stamp);
			log.debug.apply(null, args);
		},
		input_activity: function(event) {
			if (event.original.which === 13) {
				this.dbug('Enter key pressed; sending message...');
				var msg = event.node.value;

				if (msg === "") {
					this.dbug("Empty input...");
				} else {
					//Send a message
					base.chatModule.send(msg);

					//Reset input
					event.node.value = "";
				}
			}
		},
		session_link_hover: function(event){
			console.log(event);
		}
	});

	return ViewModule;
});