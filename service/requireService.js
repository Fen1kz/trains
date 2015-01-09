angular.module('trains').factory('requireService', function() {
    var requireService = {
        events: {},
        files: {},
        define: function (arg0, arg1, arg2) {
            if (arguments.length === 2) {
                this._define2.apply(this, arguments);
            } else if (arguments.length === 3) {
                this._define3.apply(this, arguments);
            }
        },
        _define2: function (name, def) {
            this.files[name] = def;
            this.$broadcast('loaded.'+name);
        },
        _define3: function (deps, name, def) {
            var depsLoaded = true;
            for (var index in deps) {
                var dep = deps[index];
                if (this.files[dep] === undefined) {
                    depsLoaded = false;
                    /*jshint -W083 */
                    //console.log('requireService', 'postponed', dep);
                    this.$on('loaded.' + dep, function(event) {
                        //console.log('requireService', 'loaded', event.name);
                        requireService.define(deps, name, def);
                    });
                    break;
                }
            }
            if (depsLoaded) {
                this.define(name, def);
            }
        },
        require: function (name, data) {
            if (this.files[name] === undefined) {
                throw new Error("Required target '"+name+"' has not loaded");
            }
            return this.files[name](data);
        },
        $broadcast: function(name) {
            if (this.events[name]) {
                this.events[name].forEach(function(f) {
                    f({
                        name: name
                    });
                });
            }
        },
        $on: function(name, handler) {
            if (this.events[name] === undefined) {
                this.events[name] = [];
            }
            this.events[name].push(handler);
        }
    };

	return requireService;
});
