import { ToProgress } from './index'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('options.id', () => {
  test('sets progress bar element id to toprogress by default', () => {
    const bar = new ToProgress()
    expect(document.getElementById('toprogress')).toBeTruthy()
  })
  test('sets progress bar element id to options.id value', () => {
    const bar = new ToProgress({ id: 'progressbar' })
    expect(document.getElementById('progressbar')).toBeTruthy()
  })
})

describe('options.selector', () => {
  test('appends progress bar to body by default', () => {
    const bar = new ToProgress()
    expect(document.body.firstChild).toEqual(document.getElementById('toprogress'))
  })
  test('inserts progress bar as first child of empty element', () => {
    const container = document.createElement('div')
    container.id = 'container'
    document.body.appendChild(container)
  
    const bar = new ToProgress({ selector: '#container' })
    expect(container.firstChild).toEqual(document.getElementById('toprogress'))
  })
  test('inserts progress bar as first child of non-empty element', () => {
    const container = document.createElement('div')
    container.id = 'container'
    container.appendChild(document.createElement('div'))
    document.body.appendChild(container)
    
    const bar = new ToProgress({ selector: '#container' })
    
    expect(container.firstChild).toEqual(document.getElementById('toprogress'))
  })
})

describe('options.color', () => {
  test('default color is #F44336', () => {
    const bar = new ToProgress()
    const el = document.getElementById('toprogress')
    expect(el.style.backgroundColor).toBe('rgb(244, 67, 54)')
  })
  test('sets color to options.color', () => {
    const bar = new ToProgress({ color: '#FFF' })
    const el = document.getElementById('toprogress')
    expect(el.style.backgroundColor).toBe('rgb(255, 255, 255)')
  })
})

describe('options.height', () => {
  test('default height is 2px', () => {
    const bar = new ToProgress()
    const el = document.getElementById('toprogress')
    expect(el.style.height).toBe('2px')
  })
  test('sets height to options.height', () => {
    const bar = new ToProgress({ height: '5px' })
    const el = document.getElementById('toprogress')
    expect(el.style.height).toBe('5px')
  })
})

describe('options.duration', () => {
  test('default width duration is 0.2s', () => {
    const bar = new ToProgress()
    const el = document.getElementById('toprogress')
    expect(el.style.transition).toContain('width 0.2s')
  })
  test('sets height to options.height', () => {
    const bar = new ToProgress({ duration: 5 })
    const el = document.getElementById('toprogress')
    expect(el.style.transition).toContain('width 5s')
  })
  test('opacity duration is 3 x duration', () => {
    const bar = new ToProgress({ duration: 5 })
    const el = document.getElementById('toprogress')
    expect(el.style.transition).toContain('opacity 15s')
  })
})

describe('options.position', () => {
  test('default position is top', () => {
    const bar = new ToProgress()
    const el = document.getElementById('toprogress')
    expect(el.style.top).toBe('0px')
    expect(el.style.bottom).toBeFalsy()
  })
  test('can position at bottom', () => {
    const bar = new ToProgress({ position: 'bottom' })
    const el = document.getElementById('toprogress')
    expect(el.style.top).toBeFalsy()
    expect(el.style.bottom).toBe('0px')
  })
})

describe('usage', () => {
  test('progress starts at 0', () => {
    const bar = new ToProgress()
    const el = document.getElementById('toprogress')
    expect(el.style.width).toBe('0%')
  })

  test('.setProgress(n) sets the width to n%', () => {
    const bar = new ToProgress()
    const el = document.getElementById('toprogress')
    bar.setProgress(50)
    expect(el.style.width).toBe('50%')
  })

  test('.setProgress() accepts a callback', (done) => {
    const bar = new ToProgress()
    const el = document.getElementById('toprogress')
    bar.setProgress(10, () => {
      expect(el.style.width).toBe('10%')
      done()
    })
  })

  test('.setProgress(n) sets width to 100% when n > 100', () => {
    const bar = new ToProgress()
    bar.setProgress(110)
    expect(bar.getProgress()).toBe(100)
  })

  test('.setProgress(n) sets width to 0% when n < 0', () => {
    const bar = new ToProgress()
    bar.setProgress(-1)
    expect(bar.getProgress()).toBe(0)
  })

  test('.setProgress() calls .show()', () => {
    const bar = new ToProgress()
    const el = document.getElementById('toprogress')
    bar.show = jest.fn()
    bar.setProgress(10)
    expect(bar.show).toBeCalled()
  })

  test('.increase(n) increases the width by n%', () => {
    const bar = new ToProgress()
    const el = document.getElementById('toprogress')
    bar.increase(10)
    expect(el.style.width).toBe('10%')
  })

  test('.decrease(n) decreases the width n%', () => {
    const bar = new ToProgress()
    const el = document.getElementById('toprogress')
    bar.setProgress(10)
    bar.decrease(5)
    expect(el.style.width).toBe('5%')
  })

  test('.decrease() accepts a callback', (done) => {
    const bar = new ToProgress()
    const el = document.getElementById('toprogress')
    bar.increase(10)
    bar.decrease(5, () => {
      expect(el.style.width).toBe('5%')
      done()
    })
  })

  test('.hide() and .show() toggle the opacity', () => {
    const bar = new ToProgress()
    const el = document.getElementById('toprogress')
    expect(el.style.opacity).toBe('1')
    bar.hide()
    expect(el.style.opacity).toBe('0')
    bar.show()
    expect(el.style.opacity).toBe('1')
  })

  test('.getProgress() returns the current progress', () => {
    const bar = new ToProgress()
    bar.setProgress(50)
    expect(bar.getProgress()).toBe(50)
  })

  test('.reset() sets the progress to 0', () => {
    const bar = new ToProgress()
    bar.setProgress(50)
    bar.reset()
    expect(bar.getProgress()).toBe(0)
  })

  test('.reset() accepts a callback', (done) => {
    const bar = new ToProgress()
    bar.setProgress(50)
    bar.reset(() => {
      expect(bar.getProgress()).toBe(0)
      done()
    })
  })

  test('.finish() sets the progress to 100%, then hides', () => {
    const bar = new ToProgress()
    bar.hide = jest.fn()
    bar.finish()
    expect(bar.getProgress()).toBe(100)
    expect(bar.hide).toBeCalled()
  })

  test('.finish() resets after transitionEnd', () => {
    const bar = new ToProgress()
    const el = document.getElementById('toprogress')
    bar.reset = jest.fn()
    bar.finish()
    el.dispatchEvent(new Event('transitionend'))
    expect(bar.reset).toBeCalled()
  })
})