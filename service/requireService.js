angular.module('trains').factory('requireService', function() {
    function loadIfCan (deps, name, def) {
        var depsLoaded = true;
        for (var index in deps) {
            var dep = deps[index];
            if (requireService.files[dep] === undefined) {
                depsLoaded = false;
                /*jshint -W083 */
                requireService.$on('loaded.'+dep, function(event) {
                    loadIfCan(deps, name, def);
                });
                break;
            }
        }
        if (depsLoaded) {
            requireService.files[name] = def;
        }
    }

    var requireService = {
        events: {},
        files: {},
        define: function (arg0, arg1, arg2) {
            if (arguments.length == 2) {
                //define name, def
                var name = arg0,
                    def = arg1;

                this.files[name] = def;
                this.$broadcast('loaded.'+name);
            } else if (arguments.length == 3) {
                //define deps, name, def
                var deps = arg0,
                    name = arg1,
                    def = arg2;

                loadIfCan (deps, name, def);
            }
        },
        require: function (name, data) {
            //var deps = '';
            //if ($.isArray(arguments[0])) {
            //
            //}
            //var var1 = arguments[1];
            return this.files[name](data);
        },
        $broadcast: function(name) {
            if (this.events['loaded.'+name]) {
                this.events['loaded.'+name].forEach(function(f) {
                    f({
                        name: 'loaded.'+name
                    });
                });
            }
        },
        $on: function(name, handler) {
            if (this.events['loaded.' + name] === undefined) {
                this.events['loaded.' + name] = [];
            }
            this.events['loaded.'+name].push(handler);
        }
    };

	return requireService;
});
