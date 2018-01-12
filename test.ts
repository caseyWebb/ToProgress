import { ToProgress } from './index'

function emitTransitionEndEvent(style: string) {
  const e: any = new Event('transitionend')
  const el = document.getElementById('toprogress')
  e.propertyName = style
  el.dispatchEvent(e)
}

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('options', () => {
  describe('id', () => {
    test('defaults to toprogress', () => {
      const bar = new ToProgress()
      expect(document.getElementById('toprogress')).toBeTruthy()
    })
    test('sets progress bar element id', () => {
      const bar = new ToProgress({ id: 'progressbar' })
      expect(document.getElementById('progressbar')).toBeTruthy()
    })
  })

  describe('selector', () => {
    test('defaults to body', () => {
      const bar = new ToProgress()
      expect(document.body.firstChild).toEqual(document.getElementById('toprogress'))
    })
    test('throws if element does not exist', () => {
      expect(() => {
        const bar = new ToProgress({ selector: 'dne' })
      }).toThrow()
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
    test('sets position using relative positioning', () => {
      const container = document.createElement('div')
      container.id = 'container'
      container.appendChild(document.createElement('div'))
      document.body.appendChild(container)
      const bar = new ToProgress({ selector: '#container' })
      const el = document.getElementById('toprogress')
      expect(el.style.position).toBe('relative')
      expect(el.style.top).toBe('0px')
      expect(el.style.bottom).toBeFalsy()
    })
  })

  describe('color', () => {
    test('defaults to #F44336', () => {
      const bar = new ToProgress()
      const el = document.getElementById('toprogress')
      expect(el.style.backgroundColor).toBe('rgb(244, 67, 54)')
    })
    test('sets element backgroundColor', () => {
      const bar = new ToProgress({ color: '#FFF' })
      const el = document.getElementById('toprogress')
      expect(el.style.backgroundColor).toBe('rgb(255, 255, 255)')
    })
  })

  describe('height', () => {
    test('defaults to 2px', () => {
      const bar = new ToProgress()
      const el = document.getElementById('toprogress')
      expect(el.style.height).toBe('2px')
    })
    test('sets element height', () => {
      const bar = new ToProgress({ height: '5px' })
      const el = document.getElementById('toprogress')
      expect(el.style.height).toBe('5px')
    })
  })

  describe('duration', () => {
    test('defaults to 0.2s', () => {
      const bar = new ToProgress()
      const el = document.getElementById('toprogress')
      expect(el.style.transition).toContain('width 0.2s')
    })
    test('sets duration', () => {
      const bar = new ToProgress({ duration: 5 })
      const el = document.getElementById('toprogress')
      expect(el.style.transition).toContain('width 5s')
    })
    test('opacity duration is 3 x duration', () => {
      const bar = new ToProgress({ duration: .1 })
      const el = document.getElementById('toprogress')
      expect(el.style.transition).toContain(`opacity ${.1 * 3}s`)
    })
    test('max opacity duration is 1 second', () => {
      const bar = new ToProgress({ duration: 5 })
      const el = document.getElementById('toprogress')
      expect(el.style.transition).toContain('opacity 1s')
    })
  })

  describe('position', () => {
    test('defaults to top', () => {
      const bar = new ToProgress()
      const el = document.getElementById('toprogress')
      expect(el.style.position).toBe('fixed')
      expect(el.style.top).toBe('0px')
      expect(el.style.bottom).toBeFalsy()
    })
    test('sets position using fixed positioning', () => {
      const bar = new ToProgress({ position: 'bottom' })
      const el = document.getElementById('toprogress')
      expect(el.style.position).toBe('fixed')
      expect(el.style.top).toBeFalsy()
      expect(el.style.bottom).toBe('0px')
    })
  })
})

describe('initialization', () => {
  test('progress starts at 0', () => {
    const bar = new ToProgress()
    const el = document.getElementById('toprogress')
    expect(el.style.width).toBe('0%')
  })
  test('opacity is initialized as 1', () => {
    const bar = new ToProgress()
    const el = document.getElementById('toprogress')
    expect(el.style.opacity).toBe('1')
  })
})

describe('api', () => {
  describe('.start()', () => {
    test('uses default 30s duration and cubic-beizer', () => {
      const bar = new ToProgress()
      const el = document.getElementById('toprogress')
      bar.start()
      expect(el.style.transition).toContain('width 30s cubic-bezier')
    })

    test('can set duration', () => {
      const bar = new ToProgress()
      const el = document.getElementById('toprogress')
      bar.start(10)
      expect(el.style.transition).toContain('width 10s cubic-bezier')
    })

    test('can set easing', () => {
      const bar = new ToProgress()
      const el = document.getElementById('toprogress')
      bar.start(10, 'linear')
      expect(el.style.transition).toContain('width 10s linear')
    })

    test('sets the width to 99', () => {
      const bar = new ToProgress()
      const el = document.getElementById('toprogress')
      bar.start()
      expect(el.style.width).toBe('99%')
    })

    test('calling repeatedly re-triggers css transition', () => {
      const bar = new ToProgress()
      const el = document.getElementById('toprogress')
      bar.start()
      expect(el.style.width).toBe('99%')
      bar.start()
      expect(el.style.width).toBe('98%')
      bar.start()
      expect(el.style.width).toBe('99%')
    })
  })

  describe('.stop()', () => {
    test('sets the transition duration to a big number', () => {
      const bar = new ToProgress()
      const el = document.getElementById('toprogress')
      bar.stop()
      expect(el.style.transition).toContain('100000')
    })

    test('re-triggers the animation', () => {
      const bar = new ToProgress()
      bar.start()
      bar.stop()
      expect(bar.getProgress()).not.toBe(99)
    })
  })

  describe('.setProgress()', () => {
    test('sets the width', () => {
      const bar = new ToProgress()
      const el = document.getElementById('toprogress')
      bar.setProgress(50)
      expect(el.style.width).toBe('50%')
    })

    test('returns a promise that resolves after transitionEnd', (done) => {
      const bar = new ToProgress()
      const el = document.getElementById('toprogress')
      bar.setProgress(10).then(() => {
        expect(el.style.width).toBe('10%')
        done()
      })
      emitTransitionEndEvent('width')
    })

    test('sets width to 100% when n > 100', () => {
      const bar = new ToProgress()
      bar.setProgress(110)
      expect(bar.getProgress()).toBe(100)
    })

    test('sets width to 0% when n < 0', () => {
      const bar = new ToProgress()
      bar.setProgress(-1)
      expect(bar.getProgress()).toBe(0)
    })
  })

  describe('.increase() / .decrease()', () => {
    test('increment/decrement the progress', () => {
      const bar = new ToProgress()
      bar.increase(10)
      expect(bar.getProgress()).toBe(10)
      bar.decrease(5)
      expect(bar.getProgress()).toBe(5)
    })
  })

  describe('.hide() / .show()', () => {
    test('toggle the opacity', () => {
      const bar = new ToProgress()
      const el = document.getElementById('toprogress')
      bar.hide()
      expect(el.style.opacity).toBe('0')
      bar.show()
      expect(el.style.opacity).toBe('1')
    })
  })

  describe('.getProgress()', () => {
    test('returns the current progress', () => {
      const bar = new ToProgress()
      bar.setProgress(50)
      expect(bar.getProgress()).toBe(50)
    })
  })

  describe('.reset()', () => {
    test('sets the progress to 0', () => {
      const bar = new ToProgress()
      bar.setProgress(50)
      bar.reset()
      expect(bar.getProgress()).toBe(0)
    })

    test('sets the transition duration and easing to default', () => {
      const bar = new ToProgress()
      const el = document.getElementById('toprogress')
      bar.reset()
      expect(el.style.transition).toContain('width 0.2s ease-out')
    })

    test('calls .show()', (done) => {
      const bar = new ToProgress()
      bar.show = jest.fn()
      bar.reset().then(() => {
        expect(bar.show).toBeCalled()
        done()
      })
      emitTransitionEndEvent('width')
    })

    test('returns a promise that resolves after transitionEnd', (done) => {
      const bar = new ToProgress()
      const el = document.getElementById('toprogress')
      bar.reset().then(done)
      emitTransitionEndEvent('width')
    })
  })

  describe('.finish()', () => {
    test('sets the progress to 100%', () => {
      const bar = new ToProgress()
      bar.finish()
      expect(bar.getProgress()).toBe(100)
    })

    test('sets the transition duration and easing to default', () => {
      const bar = new ToProgress()
      const el = document.getElementById('toprogress')
      bar.finish()
      expect(el.style.transition).toContain('width 0.2s ease-out')
    })

    test('calls .hide()', () => {
      const bar = new ToProgress()
      bar.hide = jest.fn()
      bar.finish()
      expect(bar.hide).toBeCalled()
    })

    test('calls .reset() after opacity transition completes', (done) => {
      const bar = new ToProgress()
      const el = document.getElementById('toprogress')
      bar.reset = jest.fn()
      bar.finish()
      emitTransitionEndEvent('opacity')
      process.nextTick(() => {
        expect(bar.reset).toBeCalled()
        done()
      })
    })
  })

  describe('.destroy()', () => {
    test('removes the element from the DOM', () => {
      const bar = new ToProgress()
      bar.destroy()
      expect(document.getElementById('toprogress')).toBeFalsy()
    })
  })
})
