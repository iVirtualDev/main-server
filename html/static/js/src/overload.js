(function(root, factory){
   if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], function () {
            return (root.overload = factory());
        });
    } else if (typeof exports === 'object') {
        // Node. Does not work when strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory(require());
    } else {
        // Browser globals
        root.overload = factory();
    }
}(this, function(){
	
}));