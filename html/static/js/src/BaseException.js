define(['stapes'], function(Stapes){
	window.BaseException = Stapes.subclass({
		constructor: function(code, msg) {
			this.message = msg || ((ysp_errors.hasOwnProperty(code)) ? ysp_errors[code] : ysp_lang.errors.unknown_error);
			this.code = code;
			this.timestamp = Date.create();
		}
	}, true);

	return window.BaseException;
});