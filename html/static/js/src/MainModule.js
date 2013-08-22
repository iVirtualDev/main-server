define(['BaseModule', 'src/ChatModule', 'src/ViewModule', 'src/TelephonyModule', 'src/FatalErrors', 'lang', 'async', 'underscore', 'notice', 'url'],
	function(BaseModule, ChatModule, ViewModule, TelephonyModule, FatalErrors, lang, async, _, notice, url) {
		var MainModule = BaseModule.subclass({
			module_id: 'MainModule',
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

				if ($('#ad').height() === 0) {
					new notice("<i class=\"icon-frown icon-3x pull-left\"></i>{1}".assign(ysp_errors[11204]), {
						type: 'error',
						onclick: function() {
							return false;
						},
						timeout: false
					});

					base.error(new BaseException(11204));
				}

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
						async.series([
							function(callback) {
								var sid = window.location.pathname.replace(/[^a-z]/g, "");
								var resource, opts = {
										success: function(data) {
											mod_root.sid = data.sid;
											mod_root.session_id = data.session_id;
											mod_root.token = data.token;
										},
										fail: function(data) {
											callback(new BaseException(data.code));
										},
										error: function(data) {
											callback(new BaseException(data.code, data.message));
										}
									};

								if (sid === "") {
									resource = "/session/create";
								} else {
									resource = "/session/{1}".assign(sid);
								}

								mod_root.ajax(resource, opts);
							}
						], function(err) {
							NProgress.inc();

							if (err instanceof BaseException) {
								callback(err);
							} else {
								callback(null);
							}
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
					log.debug('')
					if (err instanceof BaseException) {
						mod_root.error(err);
					}

					NProgress.done();
				});
			}
		});

		return MainModule;
	});