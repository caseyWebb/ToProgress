# topgrogress2

[![Version][npm-version-shield]][npm]
![License][mit-shield]
[![Build Status][travis-ci-shield]][travis-ci]
[![Coverage States][codecov-shield]][codecov]
[![Downloads][npm-stats-shield]][npm-stats]

[npm]: https://www.npmjs.com/package/toprogress2
[npm-version-shield]: https://img.shields.io/npm/v/toprogress2.svg

[mit-shield]: https://img.shields.io/npm/l/toprogress2.svg

[travis-ci]: https://travis-ci.org/Profiscience/toprogress2/
[travis-ci-shield]: https://img.shields.io/travis/Profiscience/toprogress2/master.svg

[codecov]: https://codecov.io/gh/Profiscience/toprogress2
[codecov-shield]: https://img.shields.io/codecov/c/github/Profiscience/toprogress2.svg

[npm-stats]: http://npm-stat.com/charts.html?package=toprogress2&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/toprogress2.svg?maxAge=2592000

Forked from [djyde/ToProgress](https://github.com/djyde/ToProgress). See [CHANGELOG.md](./CHANGELOG.md).

# Screenshot

#### Desktop
![desktop](http://ww4.sinaimg.cn/large/62580dd9gw1et3i1t9amjj218b0q5juw.jpg)

#### Mobile
![mobile](http://ww2.sinaimg.cn/large/62580dd9gw1et41eqm2usg20f00qo7if.gif)

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
```

# Support

* IE >= 10
* Chrome
* Firefox
* Safari

# API

### new ToProgress(options[,selector])

* options
  * **id** - the id of auto-created progress bar element
  * **color** - progress bar color
  * **height** - progress bar height 
  * **duration** - increase duration (seconds)
  * **position** - the progress bar position. `top` or `bottom`

* **selector** - valid css selector, if is defined, progress bar will be put on the top of the element. Only find the first element.

### .increase(progress[,callback])
* **progress** - percentage number

### .decrease(progress[,callback])
* **progress** - percentage number

### .setProgress(progress[,callback])
* **progress** - percentage number

### .reset([,callback])

### .finish([,callback])

### .getProgress()
return current progress (percentage number)

### .show()
### .hide()

# License
MIT License
