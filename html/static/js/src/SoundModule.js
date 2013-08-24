define(['BaseModule', 'BaseException'], function(BaseModule, BaseException){
	var join, leave, error;

	join = new Audio('/static/audio/join.mp3');
	leave = new Audio('/static/audio/leave.mp3');

	var stop = function stopFn(snd){
		snd.pause();
		snd.currentTime = 0;
	}
	var stopAll = function stopAllFn(){
		stop(join);
		stop(leave);
	}

	var SoundModule = BaseModule.subclass({
		module_id:"SoundModule",
		constructor: function(callback){
			this.init();

			callback(null);
		},
		event: function(eventName){
			stopAll();

			switch(eventName){
				case "join":
					join.play();
					break;
				case "leave":
					leave.play();
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