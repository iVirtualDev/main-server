define(['BaseModule', 'notice'], function(BaseModule, notice) {
	var FatalErrors = BaseModule.subclass({
		module_id: 'FatalErrors',
		subscribedCodes: [1007, 5001, 5003, 2000],
		constructor: function(callback) {
			this.init();
			callback(null);
		},
		handleError: function(event) {
			FatalErrors.parent.handleError.apply(this, arguments);

			var msg = event.message,
				code = event.code;

			//TokBox sends some cryptic messages, make them more user friendly
			switch (code) {
				case 1007:
					msg = base.lang.session_full;
					break;
				case 2000:
					msg = base.lang.need_camera_mic;
					break;
			}

			base.viewModule.set('fatalError', true).set('fatal_error_message', msg);
		}
	});

	return FatalErrors;
});