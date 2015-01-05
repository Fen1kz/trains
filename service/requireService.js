angular.module('trains').factory('requireService', function() {
    var requireService = {
        files: {},
        define: function (name, object) {
            this.files[name] = object;
            console.log('defined['+name+']');
            //this.events['loaded'+name].;
        },
        require: function (name) {
            //var deps = '';
            //if ($.isArray(arguments[0])) {
            //
            //}
            //var var1 = arguments[1];

            return this.files[name];
        }
    };

	return requireService;
});
