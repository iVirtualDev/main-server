define(['opentok', 'BaseModule', 'url', 'async', 'notice'],
	function(TB, BaseModule, url, async, notice) {
		var TelephonyModule = BaseModule.subclass({
			module_id: 'TelephonyModule',
			apiKey: '26350302',
			constructor: function(callback) {
				this.init();
				var mod_root = this;

				async.series([
					function(callback) {
						mod_root.debug('Checking system requirements');
						if (TB.checkSystemRequirements()) {
							mod_root.debug('Hooray! Browser is equipped to make video chat calls!');
							callback(null);
						} else {
							callback({
								code: base.error_map.outdated_browser,
								msg: base.lang.outdated_browser
							});
						}
					}
				], function(err) {
					if (err) {
						mod_root.error(err.msg, err.code);
						return;
					}

					mod_root.debug('Telephony bootstrap completed successfully; setting up session.');

					TB.addEventListener('exception', function(event){
						mod_root.telephonyModule.error(event.message, event.code);
					});

					//Initialize the session
					mod_root.session = TB.initSession(base.session_id);

					//Register events
					mod_root.session.addEventListener('sessionConnected', mod_root.onConnect);
					mod_root.session.addEventListener('streamCreated', mod_root.streamCreated);
					mod_root.session.addEventListener('streamDestroyed', mod_root.streamDestroyed);

					//Connect to the session
					mod_root.session.connect(mod_root.apiKey, base.token);

					callback(null);
				});

			},
			onConnect: function(event) {
				var mod_root = base.telephonyModule;
				mod_root.debug('Successfully connected to session; publishing stream to session...');
				new notice('Successfully connected!', {
					type: 'success'
				});
				mod_root.publisher = TB.initPublisher(mod_root.apiKey, 'publisher', {
					width: 320,
					height: 200
				});
				mod_root.session.publish(mod_root.publisher);

				mod_root.processStreams(event.streams);
			},
			streamCreated: function(event) {
				var mod_root = base.telephonyModule;
				mod_root.processStreams(event.streams);
				mod_root.debug('A stream was published to this session; processing now...');
			},
			streamDestroyed: function() {
				var mod_root = base.telephonyModule;
				mod_root.debug('A stream was un-published from this session; processing now...')
				new notice(base.lang.other_party_left, {
					type: 'info'
				});
			},
			processStreams: function(streams) {
				var mod_root = base.telephonyModule;

				for (var i = streams.length - 1; i >= 0; i--) {
					if (streams[i].connection.connectionId != mod_root.session.connection.connectionId) {
						var sub_hold = document.getElementById('subscription_hold');
						var sub = document.createElement('div');
						sub.id = "stream_{1}".assign(streams[i].connection.connectionId);
						sub_hold.appendChild(sub);

						mod_root.session.subscribe(streams[i], sub.id, {
							width: 320,
							height: 200
						});
						return;
					}
				}
			}
		});

		return TelephonyModule;
	});