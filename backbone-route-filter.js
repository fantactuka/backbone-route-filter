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

        router._runFilters(router.before, fragment, args, function() {
          if (callback) {
            callback.apply(router, args);
          }

          router.trigger.apply(router, ['route:' + name].concat(args));
          router.trigger('route', name, args);
          Backbone.history.trigger('route', router, name, args);

          router._runFilters(router.after, fragment, args);
        });
      });
      return this;
    },

    _runFilters: function(filters, fragment, args, callback) {
      var chain = _.filter(filters, function(callback, filter) {
        filter = _.isRegExp(filter) ? filter : this._routeToRegExp(filter);
        return filter.test(fragment);
      }, this);

      run(chain, this, fragment, args, callback || _.identity);
    }
  });
})(Backbone, _);




function run(chain, router, fragment, args, callback) {

  // When filters chain is finished - calling `done` callback
  if (!chain.length) {
    callback.call(router);
    return;
  }

  var current = chain[0],
      tail = _.tail(chain),
      next = function() {
        run(tail, router, fragment, args, callback);
      };

  if (_.isString(current)) {
    current = router[current];
  }

  if (current.length === 3) {
    // Filter expects `next` for async - ignoring return value
    // and waiting for `next` to be called
    current.apply(router, [fragment, args, next]);
  } else {
    // Using regular filter with `false` return value that stops
    // filters execution
    if (current.apply(router, [fragment, args]) !== false) {
      next();
    }
  }
}
