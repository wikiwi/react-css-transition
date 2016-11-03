# react-css-transition

Removes elements from DOM on mount.

[![NPM Version Widget]][npm version]
[![Build Status Widget]][build status]
[![Coverage Status Widget]][coverage status]

## Installation

```sh
npm install react-css-transition --save
```

## Usage

```javascript
import { Remove } from "react-css-transition"

const App = () => (
  <div>
    <Remove id="element-id" />
    <Remove id={["id1", "id2"]} />
  </diV>
)

ReactDOM.render(<App />, mountNode)
```

[npm version]: https://www.npmjs.com/package/react-css-transition

[npm version widget]: https://img.shields.io/npm/v/react-css-transition.svg?style=flat-square

[build status]: https://travis-ci.org/wikiwi/react-css-transition

[build status widget]: https://img.shields.io/travis/wikiwi/react-css-transition/master.svg?style=flat-square

[coverage status]: https://coveralls.io/github/wikiwi/react-css-transition?branch=master

[coverage status widget]: https://img.shields.io/coveralls/wikiwi/react-css-transition/master.svg?style=flat-square

