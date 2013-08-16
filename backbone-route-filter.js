(function(Backbone, _) {

  var extend = Backbone.Router.extend;

  Backbone.Router.extend = function() {
    var child = extend.apply(this, arguments),
      childProto = child.prototype,
      parentProto = this.prototype;

    _.each(['before', 'after'], function(filter) {
      _.defaults(childProto[filter], parentProto[filter]);
    });

    return child;
  };

  _.extend(Backbone.Router.prototype, {

    /**
     * Override default route fn to call before/after filters
     *
     * @param {String} route
     * @param {String} name
     * @param {Function} [callback]
     * @return {*}
     */
    route: function(route, name, callback) {
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      if (_.isFunction(name)) {
        callback = name;
        name = '';
      }
      if (!callback) callback = this[name];
      var router = this;
      Backbone.history.route(route, function(fragment) {
        var args = router._extractParameters(route, fragment);

        if (router._runFilters(router.before, fragment, args, true)) {
          if (callback) {
            callback.apply(router, args);
          }

          router.trigger.apply(router, ['route:' + name].concat(args));
          router.trigger('route', name, args);
          Backbone.history.trigger('route', router, name, args);
          router._runFilters(router.after, fragment, args, false);
        }
      });
      return this;
    },

    /**
     * Run set of filters and stops if any of them failing (returns false)
     * @param filters
     * @param fragment
     * @param args
     * @param {boolean} stopOnError - will stop iterating over filters if any returns false
     * @return {boolean}
     * @private
     */
    _runFilters: function(filters, fragment, args, stopOnError) {
      return _[stopOnError ? 'every' : 'each'](filters || [], function(fn, filter) {
        filter = _.isRegExp(filter) ? filter : this._routeToRegExp(filter);

        if (filter.test(fragment)) {
          fn = _.isFunction(fn) ? fn : this[fn];
          return fn.apply(this, [fragment, args]) !== false;
        }

        return true;
      }, this);
    }
  });
})(Backbone, _);
