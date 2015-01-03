angular.module('trains').factory('requireService', function() {
	var requireService = {
        files: {},
        define: function (name, object) {
            this.files[name] = object;
        },
        require: function (name) {
            return this.files[name];
        }
    };

	return requireService;
});
