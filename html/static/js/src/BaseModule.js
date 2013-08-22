define(['stapes', 'underscore', 'notice', 'overload', 'src/BaseException'], function(Stapes, _, notice, overload, BaseException) {
	var BaseModule = Stapes.subclass({
		watchFor: [],
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
				success: function() {},
				fail: function() {},
				error: function() {},
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
						mod_root.error(new BaseException(response.code, response.msg));
						break;
					default:
						mod_root.error(new BaseException(11107));
						mod_root.debug('bad response: ', response);
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
		error: function(e) {
			var mod_root = this;
			if (!e instanceof BaseException) {
				log.error("Use new BaseException based error reporting!");
				log.error(mod_root, arguments);
				return;
			}

			if (typeof base !== "undefined") {
				base.emit('error', e);
			}

			log.error("{1} - {2}: ({3}) {4}".assign(e.timestamp.format(mod_root.timestamp_fmt), mod_root.module_id, e.code, e.message));
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

			window.x = new BaseException;

			log.info(x);
		},
		debug: function() {
			var stamp = "{1} - {2}: ".assign(Date.create().format("{HH}:{mm}:{ss}"), this.module_id);
			var args = Array.prototype.slice.call(arguments);
			args.unshift(stamp);
			log.debug.apply(null, args);
		},
		errorFilter: function(exception) {
			var mod_root = this;
			mod_root.debug('Error filter activated');

			if (_.contains(mod_root.watchFor, exception.code)) {
				mod_root.handleError(exception);
			}
		},
		handleError: function(exception) {
			this.debug('Error handler activated');
		}
	});

	return BaseModule;
});