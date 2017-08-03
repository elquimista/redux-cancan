# CanCan (or CanCanCan) for Redux

[![npm-version](https://img.shields.io/npm/v/redux-cancan.svg?style=flat-square)](https://www.npmjs.com/package/redux-cancan)
[![npm-downloads](https://img.shields.io/npm/dt/redux-cancan.svg?style=flat-square)](https://www.npmjs.com/package/redux-cancan)

`redux-cancan` is an authorization library for Redux which restricts what routes a given user is allowed to access.

All permissions are defined in a single location (the `ability` file).

This is tested with React Router v4.

## Installation

Using yarn:
```sh
$ yarn add redux-cancan
```

Using npm:
```sh
$ npm install redux-cancan
```

## Example

Define the `ability` file.

```js
export default store => {
  const { auth: { user } } = store.getState();

  if (user) {
    // protected routes
    switch (user.role) {
      case 'admin':
        return ['/books', '/users'];
      case 'user_manager':
        return ['/users'];
      default:
        return ['/books'];
    }
  }

  // public routes
  return ['/login', '/signup'];
};
```

Initialize in a file where Redux store is created.

```js
...
import { createStore } from 'redux';
import { initCanCan } from 'redux-cancan';
...
const store = createStore(...);

initCanCan(store, require('./ability'));
...
```

You can use `canManage()` function to check whether or not current user can access certain routes.

```js
...
import { Link } from 'react-router-dom';
import { canManage } from 'redux-cancan';
...
const AppBar = () => {
  let navMenuItems = [];

  if (canManage('/users')) {
    navMenuItems.push(<Link to="/users" key="/users"><Button>Users</Button></Link>);
  }
  if (canManage('/books')) {
    navMenuItems.push(<Link to="/books" key="/books"><Button>Books</Button></Link>);
  }

  return (
    <div>
      <span>Timezone App</span>
      {navMenuItems}
      <button>Log out</button>
    </div>
  );
};
...
```

**_BONUS_**: You can also authorize React Router history object like this.

```js
import React from 'react';
import { canManage } from 'redux-cancan';
...
class App extends React.Component {
  componentDidMount() {
    const { history, authorizeUser } = this.props;
    history.listen(authorizeUser);
  }
  ...
}

const mapStateToProps = state => ({});

const mapDispatchToProps = (dispatch, ownProps) => ({
  authorizeUser: ({ pathname }) => {
    if (!canManage(pathname)) {
      ownProps.history.replace('/404');
    }
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
```

## API

### `initCanCan(reduxStore, ability[, f0fRoute])`

* `reduxStore: Object` (_required_) - Redux store object.
* `ability: Object` (_required_) - the `ability` file module, typically used with `require()`.
* `f0fRoute: String` (deafult: '/404') - the route that should be ignored while checking authorization.

### `canManage(route)`

* `route: String` (_required_) - route string to check

#### Return type: `Boolean`

## MIT Licensed
