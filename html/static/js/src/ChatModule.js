define(['BaseModule', 'socket', 'notice', 'url', 'src/MessageClass'],
	function(BaseModule, socket, notice, url, Message) {
		var chat, room, cb;

		var ChatModule = BaseModule.subclass({
			module_id: 'ChatModule',
			constructor: function(callback) {
				this.init();
				this.subscribedCodes = [base.error_map.socket_error, base.error_map.socket_connect_failed];
				cb = callback;

				chat = io.connect('https://chat.ysp.im:1337')
					.on('connect', this.onConnect)
					.on('msg', this.onMsg)
					.on('error', this.onError)
					.on('connect_failed', this.connectFailed)
					.on('disconnect', this.disconnect)
					.on('reconnect', this.reconnect);
			},
			onConnect: function() {
				cb(null); //Call the YSPController passed callback
				room = base.sid;
				var mod_root = base.chatModule;
				mod_root.debug('Successfully connected to chat server; joining session chat room...');
				chat.emit('join', room);
			},
			send: (function(msg) {
				base.chatModule.debug('Sent message: {1}'.assign(msg));
				chat.emit('msg', {
					room: room,
					msg: msg
				});
				base.viewModule.publishMessage(new Message('sent', msg))
			}).debounce(200),
			onMsg: function(msg) {
				base.chatModule.debug('Received message: {1}'.assign(msg));
				base.viewModule.publishMessage(new Message('received', msg));
			},
			onError: function() {
				cb(null);
				var mod_root = base.chatModule;
				mod_root.error('An error occured while communicating with the chat server', base.error_map.socket_error);
			},
			connectFailed: function() {
				cb(null);
				var mod_root = base.chatModule;
				mod_root.error('Failed to connect to the chat server.', base.error_map.socket_connect_failed);
			},
			disconnect: function() {
				base.chatModule.debug('Lost connection to chat server; attempting to reconnect...');
				new notice(base.lang.socket_disconnect, {
					type: 'error'
				});
			},
			reconnect: function() {
				base.chatModule.debug('Connecting to chat server was reconnected!');
				new notice(base.lang.socket_reconnect, {
					type: 'success'
				});
			},
			handleError: function(event) {
				switch (event.code) {
					case base.error_map.socket_connect_failed:
					case base.error_map.socket_error:
						//Hide the chat, because its kinda useless :/
						base.viewModule.set('chat_available', false);
						new notice(base.lang.socket_connect_failed, {
							type: 'error'
						});
						break;
				}
			}
		});

		return ChatModule;
	});