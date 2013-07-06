Backbone Route filters [![Build Status](https://travis-ci.org/fantactuka/backbone-route-filter.png?branch=master)](https://travis-ci.org/fantactuka/backbone-route-filter)
==================

Backbone Route filters allows you to have a pre-condition for the router using `before` filters and some
"after" routing calls using `after` filters. Before filters could prevent router from calling action in case 
any of them returns false. 

**Note** that `after` filters are executed only of `before` filters are passed and original route executed

Filters are inherited by extending parent's filters with child's. Child's filter have higher priority, so having same
pattern in child filters will override parent's behaviour.

## Installation
Using [Bower](http://twitter.github.com/bower/) `bower install backbone-route-filter` or just copy [backbone-route-filter.js](https://raw.github.com/fantactuka/backbone-route-filter/master/backbone-route-filter.js)

## Usage

```js
var Router = Backbone.Router.extend({
  routes: {
    'users': 'usersList',
    'users/:id': 'userShow',
    'account/sign-in': 'signIn'
  },

  before: {
    // Using instance methods
    'users(:/id)': 'checkAuthorization',

    // Using inline filter definition
    '*any': function(fragment, args) {
      console.log('Atempting to load ' + fragment + ' with arguments: ', args);
    }
  },

  after: {
    // Google analytics tracking
    // After filter will be triggered only if all before filters passed and action was triggered,
    // so you'll only track pages that was displayed to user
    '*any': function(fragment) {
      goog._trackPageview(fragment);
    }
  },

  checkAuthorization: function(fragment, args) {
    if (!this._isSignedIn) {

      // Going to sign-in page
      this.signIn();

      // Preventing current route from being handled
      return false;
    }
  }
});
```
