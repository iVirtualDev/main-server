define(['BaseModule', 'BaseException'], function(BaseModule, BaseException){
	var join, leave, error;

	join = new Audio('/static/audio/join.mp3');
	leave = new Audio('/static/audio/leave.mp3');

	var SoundModule = BaseModule.subclass({
		module_id:"SoundModule",
		constructor: function(callback){
			this.init();

			callback(null);
		},
		play: function(){
			join.play();
		},
		event: function(eventName){
			$.each($('audio'), function () {
			    this.stop();
			});

			switch(eventName){
				case "join":
					break;
				case "leave":
					break;
				case "message":
					break;
				case "error":
					break;
			}
		}
	});

	return SoundModule;
});