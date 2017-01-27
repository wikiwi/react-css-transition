# react-css-transition

[![NPM Version Widget]][npm version]
[![Build Status Widget]][build status]
[![Coverage Widget]][coverage]

_React CSS Transition_ provides a reliable way to transition your components between two states across browers.

[Read the full documentation](https://wikiwi.github.io/react-css-transition/)

## Installation

```sh
npm install react-css-transition --save
```

## Features

- Transition between the _default state_ and the _active state_
- Perform a reverse transition when interrupted
- Define transitions using inline styles or CSS classes
- Transition components when entering or leaving the DOM
- Notifiy when a transition has finished
- Support the application of initial values before a transition
- Includes typescript definitions

## Examples

A component that fades in when props changes to `active=true` and fades out when `active=false`:

```js
import * as React from "react";
import { CSSTransition, transit } from "react-css-transition";

const FadeInOutComponent = ({active, ...rest}) => (
  <CSSTransition
    defaultStyle={{ opacity: 0 }}
    enterStyle={{ opacity: transit(1.0, 500, "ease-in-out") }}
    leaveStyle={{ opacity: transit(0, 500, "ease-in-out") }}
    activeStyle={{ opacity: 1.0 }}
    active={props.active}
  >
    <MyComponent {...rest} />
  </CSSTransition>
);
```

A transition group that fades in and out its children:

```js
import { CSSTransitionGroup, CSSTransition, transit } from "react-css-transition";

const FadeInOut = (props) => (
  <CSSTransition
    {...props}
    defaultStyle={{ opacity: 0 }}
    enterStyle={{ opacity: transit(1.0, 500, "ease-in-out") }}
    leaveStyle={{ opacity: transit(0, 500, "ease-in-out") }}
    activeStyle={{ opacity: 1.0 }}
  />
);

const FadeInOutGroup = (props) => (
  <CSSTransitionGroup {...props}>
    {
      React.Children.map(
        props.children,
        (child) => <FadeInOut>{child}</FadeInOut>,
      )
    }
  </CSSTransitionGroup>
);
```

## License

MIT


[npm version]: https://www.npmjs.com/package/react-css-transition

[npm version widget]: https://img.shields.io/npm/v/react-css-transition.svg?style=flat-square

[build status]: https://travis-ci.org/wikiwi/react-css-transition

[build status widget]: https://img.shields.io/travis/wikiwi/react-css-transition/master.svg?style=flat-square

[coverage]: https://codecov.io/gh/wikiwi/react-css-transition

[coverage widget]: https://codecov.io/gh/wikiwi/react-css-transition/branch/master/graph/badge.svg

