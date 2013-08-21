define(['BaseModule', 'src/ChatModule', 'src/ViewModule', 'src/TelephonyModule', 'src/FatalErrors', 'lang', 'async', 'underscore', 'notice', 'url'],
	function(BaseModule, ChatModule, ViewModule, TelephonyModule, FatalErrors, lang, async, _, notice, url) {
		var YSPController = BaseModule.subclass({
			module_id: 'YSPController',
			error_map: {
				session_not_found: 5001,
				global_ajax_error: 5002,
				outdated_browser: 5003,
				socket_error: 4009,
				socket_connect_failed: 4010,
				user_is_blocking_ads: 4030
			},
			timestamp_fmt: "{HH}:{mm}:{ss}",
			constructor: function() {
				base = this;
				base.lang = lang; //Set up language object
				this.init();

				if ($('#ad').height() == 0) {
					new notice("<i class=\"icon-frown icon-3x pull-left\"></i>Please don't hide the ads.", {
						type: 'error',
						onclick: function() {
							return false;
						},
						timeout: false
					});

					this.error('User is blocking advertisements', base.error_map.user_is_blocking_ads);
				}

				$(document).ajaxError(function() {
					base.error(base.lang.global_ajax_error, base.error_map.global_ajax_error);
				});

				if (typeof $('#noaccount')[0] != "undefined") {
					document.getElementById('bootstrap').onclick = (base.bootstrap).bind(base);
				} else {
					base.bootstrap();
				}
			},
			bootstrap: function() {
				var mod_root = this;
				this.debug('Bootstrapping...');
				NProgress.start(); //Start NProgress loading bar.

				var startup_sequence = [
					function(callback) {
						NProgress.inc();

						base.fatalErrors = new FatalErrors(callback);
					},
					function(callback) {
						NProgress.inc();

						base.viewModule = new ViewModule(callback);
						base.viewModule.on('input_activity', base.viewModule.input_activity);
						base.viewModule.on('session_link_hover', base.viewModule.session_link_hover);
					},
					function(callback) {
						//Centralizing the retrieval of session data, with retries.
						//now more robust
						var tries = 0;
						var sid = url("path").replace(/\//gi, "");

						async.doWhilst(function(callback) {
							tries++;
							var url, opts = {
									success: function(data) {
										mod_root.sid = data.sid;
										mod_root.session_id = data.session_id;
										mod_root.token = data.token;

										callback(null);
									},
									fail: function() {
										callback(null);
									},
									error: function() {
										callback(null);
									}
								};

							if (sid === "") {
								url = "/session/create";
							} else {
								url = "/session/{1}".assign(sid);
								opts.fail = function(data){
									if(data.code === 1404) {
										callback({
											msg: base.lang.session_not_found,
											code: base.error_map.session_not_found
										});
									}
								};
							}

							mod_root.ajax(url, opts);
						}, function() {
							return (typeof base.sid === "undefined") || (tries < 3);
						}, function(err) {
							if(typeof base.sid === "undefined" || err) {
								var m = err.msg || base.lang.global_ajax_error;
								var c = err.code || base.error_map.global_ajax_error;
								mod_root.error(m, c);
								return;
							}

							base.viewModule.set('sid', base.sid);
							base.viewModule.set('session_link', "http://ysp.im/{1}".assign(base.sid));
							history.pushState(null, 'Your Second Phone', base.sid);

							callback(null);
						});
					},
					function(callback) {
						NProgress.inc();

						base.telephonyModule = new TelephonyModule(callback);
					},
					function(callback) {
						NProgress.inc();

						base.chatModule = new ChatModule(callback);
					}
				];

				if (typeof $('#noaccount')[0] != "undefined") {
					startup_sequence.unshift(function(callback) {
						$('#videochat').addClass('fadeOutLeft');
						$('#noaccount').addClass('fadeOutRight');
						$('#bootstrap').fadeOut(1000);

						setTimeout(function() {
							$('#videochat').remove();
							$('#noaccount').remove();
							$('#bootstrap').remove();
							$('#main_hold').html('');
							callback(null);
						}, 1000);
					});
				}

				async.series(startup_sequence, function(err) {
					NProgress.done();
				});
			}
		});

		return YSPController;
	});