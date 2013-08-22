//log.setLevel(log.levels.ERROR);
log.enableAll();

require.config({
	baseUrl: '/static/js/',
	paths: {
		text: ['//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.5/text.min', 'plugin/text'],
		rv: ['plugin/rv'],
		async: ['//cdnjs.cloudflare.com/ajax/libs/async/0.2.7/async.min', 'lib/async.min'],
		stapes: ['//cdnjs.cloudflare.com/ajax/libs/stapes/0.8.0/stapes.min', 'lib/stapes.min'],
		underscore: ['//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min', 'lib/underscore-min'],
		url: ['lib/url.min'],
		Ractive: ['//cdnjs.cloudflare.com/ajax/libs/ractive.js/0.3.3/ractive.min', 'lib/ractive.min'],
		BaseModule: ['src/BaseModule'],
		opentok: ['lib/TB.min'],
		notice: ['lib/notice.min'],
		socket: ['//cdnjs.cloudflare.com/ajax/libs/socket.io/0.9.16/socket.io.min', 'lib/socket.io.min']
	},
	shim: {
		'stapes': {
			exports: 'Stapes'
		},
		'underscore': {
			exports: '_'
		},
		'opentok': {
			exports: 'TB'
		}
	}
});

require(['src/YSPController', 'lang'], function(YSPController, lang) {
	window.ysp_errors = {
		11101: lang.errors.session_not_found,
		11102: lang.errors.global_ajax_error,
		11103: lang.errors.outdated_browser,
		11204: lang.errors.dont_block_ads,
		11105: lang.errors.session_retrieval_error,
		13201: lang.errors.general_socket_error,
		13202: lang.errors.chat_connection_failed,
		1000: lang.errors.tb_load_failed,
		1004: lang.errors.tb_auth_error,
		1005: lang.errors.tb_invalid_session_id,
		1006: lang.errors.tb_connect_failed,
		1007: lang.errors.tb_connect_rejected,
		1008: lang.errors.tb_connect_timeout,
		1009: lang.errors.tb_security_error,
		1010: lang.errors.tb_not_connected,
		1011: lang.errors.tb_invalid_param,
		1013: lang.errors.tb_connection_failed,
		1014: lang.errors.tb_api_response_fail,
		1500: lang.errors.tb_unable_to_publish,
		1510: lang.errors.tb_unable_to_signal,
		1520: lang.errors.tb_unable_to_force_disconnect,
		1530: lang.errors.tb_unable_to_force_unpublish,
		1535: lang.errors.tb_force_unpublish_on_invalid_stream,
		2000: lang.errors.tb_internal_error,
		2010: lang.errors.tb_report_issue_failure
	};

	window.controller = new YSPController();
});