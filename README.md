# @caseywebb/toprogress

Forked from [djyde/ToProgress](https://github.com/djyde/ToProgress). See [CHANGELOG.md](./CHANGELOG.md).

# Screenshot

#### Desktop
![desktop](http://ww4.sinaimg.cn/large/62580dd9gw1et3i1t9amjj218b0q5juw.jpg)

#### Mobile
![mobile](http://ww2.sinaimg.cn/large/62580dd9gw1et41eqm2usg20f00qo7if.gif)

# Quick Start
```bash
$ yarn add @caseywebb/toprogress
```

```JS
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
