define(['BaseModule', 'notice'], function(BaseModule, notice) {
	var FatalErrors = BaseModule.subclass({
		module_id: 'FatalErrors',
		watchFor: [1007, 2000, 11101, 11102, 11103, 11105, 11106, 11107],
		constructor: function(callback) {
			this.init();
			callback(null);
		},
		handleError: function(exception) {
			base.viewModule.set('fatalError', true).set('fatal_error_message', exception.message);
		}
	});

	return FatalErrors;
});