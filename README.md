# toprogress2

[![Version][npm-version-shield]][npm]
![License][mit-shield]
[![Build Status][travis-ci-shield]][travis-ci]
[![Coverage States][codecov-shield]][codecov]
[![Downloads][npm-stats-shield]][npm-stats]

[npm]: https://www.npmjs.com/package/toprogress2
[npm-version-shield]: https://img.shields.io/npm/v/toprogress2.svg

[mit-shield]: https://img.shields.io/npm/l/toprogress2.svg

[travis-ci]: https://travis-ci.org/caseyWebb/toprogress2/
[travis-ci-shield]: https://img.shields.io/travis/caseyWebb/toprogress2/master.svg

[codecov]: https://codecov.io/gh/caseyWebb/toprogress2
[codecov-shield]: https://img.shields.io/codecov/c/github/caseyWebb/toprogress2.svg

[npm-stats]: http://npm-stat.com/charts.html?package=toprogress2&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/toprogress2.svg?maxAge=2592000

Forked from [djyde/ToProgress](https://github.com/djyde/ToProgress). See [CHANGELOG.md](./CHANGELOG.md).

![](https://caseyWebb.github.io/toprogress2/screenshot.gif)

# Quick Start
```bash
$ yarn add toprogress2
```

```JS
import { ToProgress } from 'toprogress2'

const topbar = new ToProgress({
  color: '#EEE',
  duration: 0.2,
  height: '2px'
})

topbar.start()
topbar.stop()
topbar.finish()
```

# API

Documentation is generated via Typedoc and is available [here](https://caseyWebb.github.io/toprogress2/classes/toprogress.html)

# Demo

View the demo [here](https://caseyWebb.github.io/toprogress2/demo/)

# Browser Support

* IE >= 10
* Chrome
* Firefox
* Safari

# License
MIT License
