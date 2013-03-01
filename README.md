Backbone Route filters [![Build Status](https://travis-ci.org/fantactuka/backbone-route-filter.png?branch=master)](https://travis-ci.org/fantactuka/backbone-route-filter)
==================

Backbone Route filters allows you to have a pre-condition for the router using `before` filters and some
"after" routing calls using `after` filters.

Before filters could prevent router from calling action in case any of it return false.

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
      console.log('Navigating to ' + fragment + ' with arguments: ', args);
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