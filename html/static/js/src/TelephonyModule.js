define(['opentok', 'BaseModule', 'url', 'async', 'notice'],
	function(TB, BaseModule, url, async, notice) {
		var TelephonyModule = BaseModule.subclass({
			module_id: 'TelephonyModule',
			apiKey: '26350302',
			constructor: function(callback) {
				this.init();
				console.time("Telephony set up in");
				var mod_root = this,
					sid = url("path").replace(/\//gi, "");

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
					},
					function(callback) {
						mod_root.debug('Initializing session');
						//Either start, or rejoin a session
						if (sid === "") {
							mod_root.ajax('/telephony/create_session', {
								success: function(data) {
									mod_root.session_id = data.session_id;
									mod_root.sid = data.sid;
									history.pushState(null, 'Your Second Phone', data.sid);
									callback(null);
								}
							});
						} else {
							mod_root.ajax('/telephony/get_session/{1}'.assign(sid), {
								success: function(data) {
									mod_root.session_id = data.session_id;
									mod_root.sid = sid;
									callback(null);
								},
								fail: function() {
									callback({
										code: base.error_map.session_not_found,
										msg: base.lang.session_not_found
									});
								}
							});
						}
					},
					function(callback) {
						mod_root.debug('Getting session token');
						//Retrieve a token for the session.
						mod_root.ajax('/telephony/get_token/{1}'.assign(mod_root.sid), {
							success: function(data) {
								mod_root.token = data.token;
								callback(null);
							}
						});
					}
				], function(err) {
					if (err) {
						mod_root.error(err.msg, err.code);
						return;
					}

					mod_root.debug('Telephony bootstrap completed successfully; setting up session.');

					TB.addEventListener('exception', mod_root.handleException);

					//Initialize the session
					mod_root.session = TB.initSession(mod_root.session_id);

					//Register events
					mod_root.session.addEventListener('sessionConnected', mod_root.onConnect);
					mod_root.session.addEventListener('streamCreated', mod_root.streamCreated);
					mod_root.session.addEventListener('streamDestroyed', mod_root.streamDestroyed);

					//Connect to the session
					mod_root.session.connect(mod_root.apiKey, mod_root.token);

					base.viewModule.set('sid', mod_root.sid);

					callback(null);
				});

			},
			onConnect: function(event) {
				var mod_root = base.telephonyModule;
				console.timeEnd("Telephony set up in");
				mod_root.debug('Successfully connected to session; publishing stream to session...');
				new notice('Successfully connected!', {
					type: 'success'
				});
				mod_root.publisher = TB.initPublisher(mod_root.apiKey, 'publisher', {
					width:320,
					height:200
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
							width:320,
							height:200
						});
						return;
					}
				}
			},
			handleException: function(event) {
				base.telephonyModule.error(event.message, event.code);
			}
		});

		return TelephonyModule;
	});