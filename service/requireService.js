angular.module('trains').factory('requireService', function() {
    function _defineSimple (name, def) {
        this.files[name] = def;
        this.$broadcast('loaded.'+name);
    }
    function _defineDeps(deps, name, def) {
        var $requireService = this;
        var depsLoaded = true;
        for (var index in deps) {
            var dep = deps[index];
            if (this.files[dep] === undefined) {
                depsLoaded = false;
                /*jshint -W083 */
                //console.log('requireService', 'postponed', dep);
                this.$on('loaded.' + dep, function(event) {
                    //console.log('requireService', 'loaded', event.name);
                    $requireService.define(deps, name, def);
                });
                break;
            }
        }
        if (depsLoaded) {
            this.define(name, def);
        }
    }

    return {
        events: {},
        files: {},
        define: function (arg0, arg1, arg2) {
            if (arguments.length === 2) {
                _defineSimple.apply(this, arguments);
            } else if (arguments.length === 3) {
                _defineDeps.apply(this, arguments);
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
});
