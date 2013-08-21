define(['stapes', 'underscore', 'notice'], function(Stapes, _, notice) {
	var BaseModule = Stapes.subclass({
		subscribedCodes: [],
		/**
		 * Base AJAX function
		 * This function is availabe in all modules (except views), and is used to launch HTTP requests to a server and recieve
		 * JSend-compliant responses (http://labs.omniti.com/labs/jsend)
		 *
		 * @param  {String} url   - the resource location, can be relative ('/foo/bar')
		 * @param  {Object} opts  - (optional) an object containing success, fail, and error callbacks, any data needed to be sent with the
		 * 						    request, and an HTTP method
		 * @return {Object} jqXHR - a standard jQuery XMLHttpRequest object with details of the request.
		 */
		ajax: function(url, opts) {
			var mod_root = this;

			opts = opts || {};
			options = _.extend({
				method: 'get',
				success: function() {
					log.info(base.appendTime('AJAX request completed successfully'));
				},
				fail: function() {
					log.error(base.appendTime('AJAX request failed due to sent data'));
				},
				error: function(msg, code) {

				},
				data: {},
			}, opts);

			var jqXHR = $.ajax(url, {
				type: options.method,
				data: options.data
			}).done(function(response) {
				switch (response.status) {
					case "success":
						options.success(response.data);
						break;
					case "fail":
						options.fail(response.data);
						break;
					case "error":
						options.error(response.message, response.code);
						mod_root.error(response.message, response.code);
						break;
					default:
						log.warn('Non JSend-compliant AJAX response received!', response);
						break;
				}
			});

			return jqXHR;
		},
		timestamp_fmt: "{HH}:{mm}:{ss}",
		/**
		 * Base Error Logger
		 * This function is used to centralize any error reporting so that any client-side
		 * errors can be reported to analytics platforms
		 *
		 * @param  {String} msg       - a message to make sense of what error has occured.
		 * @param  {Number} code      - an integer representation of the error that just occured
		 *
		 * @return {undefined}
		 */
		error: function(msg, code) {
			base.emit('error', {
				message: msg,
				code: code
			});
			log.error("{1} - {2}: ({3}) {4}".assign(Date.create().format(this.timestamp_fmt), this.module_id, code, msg));

			//Push all errors to Google Analyitcs
			_gaq.push(['_trackEvent', '{1} Error'.assign(this.module_id), code, msg]);
		},
		/**
		 * Global Initialization Function
		 * Incase any code needs to be run on all modules on initalization.
		 * @return {undefined}
		 */
		init: function() {
			var mod_root = this;
			mod_root.debug("coming online...");
			base.on('error', (mod_root.errorFilter).bind(mod_root));
		},
		debug: function() {
			var stamp = "{1} - {2}: ".assign(Date.create().format("{HH}:{mm}:{ss}"), this.module_id);
			var args = Array.prototype.slice.call(arguments);
			args.unshift(stamp);
			log.debug.apply(null, args);
		},
		errorFilter: function(event) {
			var mod_root = this;
			mod_root.debug('Error filter activated');

			if (_.contains(mod_root.subscribedCodes, event.code)) {
				mod_root.handleError(event);
			}
		},
		handleError: function(event) {
			this.debug('Error handler activated');
		}
	});

	return BaseModule;
});