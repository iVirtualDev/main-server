define(['BaseModule', 'BaseException'], function(BaseModule, BaseException){
	var SoundModule = BaseModule.subclass({
		module_id:"SoundModule",
		constructor: function(callback){
			this.init();
			callback(null);

			$(document.body).append();
		}
	});

	return SoundModule;
});