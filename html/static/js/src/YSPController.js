define(['BaseModule', 'src/ChatModule', 'src/ViewModule', 'src/TelephonyModule', 'src/FatalErrors', 'lang', 'jquery', 'async', 'underscore', 'notice'],
	function(BaseModule, ChatModule, ViewModule, TelephonyModule, FatalErrors, lang, jQuery, async, _, notice) {
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
				this.init();

				if (jQuery('#ad').height() == 0) {
					new notice("<i class=\"icon-frown icon-3x pull-left\"></i>Please don't hide the ads.", {
						type: 'error',
						onclick: function() {
							return false;
						},
						timeout: false
					});

					this.error('User is blocking advertisements', base.error_map.user_is_blocking_ads);
				}

				jQuery(document).ajaxError(function() {
					base.error(base.lang.global_ajax_error, base.error_map.global_ajax_error);
				});

				if (typeof jQuery('#noaccount')[0] != "undefined") {
					document.getElementById('bootstrap').onclick = (base.bootstrap).bind(base);
				} else {
					base.bootstrap();
				}
			},
			bootstrap: function() {
				this.debug('Bootstrapping...');

				var startup_sequence = [
					function(callback) {
						base.debug('Setting up locale strings...');
						base.lang = lang;
						callback(null);
					},
					function(callback) {
						base.fatalErrors = new FatalErrors(callback);
					},
					function(callback) {
						base.viewModule = new ViewModule(callback);
						base.viewModule.on('input_activity', base.viewModule.input_activity);
						base.viewModule.on('session_link_hover', base.viewModule.session_link_hover);
					},
					function(callback) {
						base.telephonyModule = new TelephonyModule(callback);
					},
					function(callback) {
						base.chatModule = new ChatModule(callback);
					},
					function(callback) {

						callback(null);
					}
				];

				if (typeof jQuery('#noaccount')[0] != "undefined") {
					startup_sequence.unshift(function(callback) {
						jQuery('#videochat').addClass('fadeOutLeft');
						jQuery('#noaccount').addClass('fadeOutRight');
						jQuery('#bootstrap').fadeOut(1000);

						setTimeout(function() {
							jQuery('#videochat').remove();
							jQuery('#noaccount').remove();
							jQuery('#bootstrap').remove();
							jQuery('#main_hold').html('');
							callback(null);
						}, 1000);
					});
				}

				async.series(startup_sequence, function(err, res) {
					log.info(res);
				});
			}
		});

		return YSPController;
	});