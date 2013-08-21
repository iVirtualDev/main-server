log.setLevel(log.levels.ERROR);
//log.enableAll();

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

require(['src/YSPController'], function(YSPController) {
	window.controller = new YSPController();
});