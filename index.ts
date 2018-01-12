function whichTransitionEvent() {
  const el = document.createElement('fakeelement')
  const transitions: { [k: string]: string } = {
    OTransition     : 'oTransitionEnd',
    WebkitTransition: 'webkitTransitionEnd'
  }
  for (const t in transitions) {
    /* istanbul ignore next */
    if ((el.style as any)[t] !== undefined) {
      /* istanbul ignore next */
      return transitions[t]
    }
  }
  return 'transitionend'
}

const transitionEvent = whichTransitionEvent()

export type ToProgressOptions = {
  id?: string
  color?: string
  height?: string
  duration?: number
  position?: string
  selector?: string
}

export class ToProgress {
  private options = {
    id: 'toprogress',
    color: '#F44336',
    height: '2px',
    duration: 0.2,
    position: 'top',
    selector: undefined as undefined | string
  }
  private element = document.createElement('div')
  private progress = 0

  constructor(opts: ToProgressOptions = {}) {
    Object.assign(this.options, opts)
    this.element.id = this.options.id
    this.setCSS()
    this.setTransition(this.options.duration)
    this.createProgressBar()
  }

  public getProgress() {
    return this.progress
  }

  public setProgress(progress: number) {
    this.progress = Math.min(100, Math.max(0, progress))
    this.element.style.width = this.progress + '%'
    return this.transitionEnd('width')
  }

  public start(duration: number = 30, easing = 'cubic-bezier(0.05, 0.45, 0.05, 0.95)') {
    this.show()
    this.setTransition(duration, easing)
    /**
     * Need to ensure that if already started the width is changed so
     * that the new transition takes effect.
     */
    this.setProgress(this.progress === 99 ? 98 : 99)
  }

  public stop() {
    this.setTransition(10e10)
    this.setProgress(this.progress - 1)
  }

  public increase(i: number) {
    return this.setProgress(this.progress + i)
  }

  public decrease(i: number) {
    return this.setProgress(this.progress - i)
  }

  public hide() {
    this.element.style.opacity = '0'
  }

  public show() {
    this.element.style.opacity = '1'
  }

  public finish() {
    this.setTransition(this.options.duration)
    this.setProgress(100)
    this.hide()
    return this.transitionEnd('opacity').then(() => this.reset())
  }

  public reset() {
    this.setTransition(this.options.duration)
    return this.setProgress(0).then(() => this.show())
  }

  public destroy() {
    this.element.remove()
  }

  private setCSS() {
    const styles: { [k: string]: string } = {
      'position': this.options.selector ? 'relative' : 'fixed',
      'top': this.options.position === 'top' ? '0' : 'auto' ,
      'bottom': this.options.position === 'bottom' ? '0' : 'auto' ,
      'left': '0',
      'right': '0',
      'background-color': this.options.color,
      'height': this.options.height,
      'width': '0%',
      'opacity': '1',
      'box-shadow': `0px 1px 2px 0px ${this.options.color}`
    }
    Object.keys(styles).forEach((style: string) => (this.element.style as any)[style] = styles[style])
  }

  private setTransition(duration: number, easing = 'ease-out') {
    const opacityDuration = Math.min(duration * 3, 1)
    const rule = `width ${duration}s ${easing}, opacity ${opacityDuration}s`
    const styles: { [k: string]: string } = {
      'transition': rule,
      '-moz-transition': rule,
      '-webkit-transition': rule
    }
    Object.keys(styles).forEach((style: string) => (this.element.style as any)[style] = styles[style])
  }

  private createProgressBar() {
    if (this.options.selector) {
      const el = document.querySelector(this.options.selector)
      if (!el) {
        throw new Error(`[toprogress2] Element not found with selector ${this.options.selector}`)
      }
      if (el.hasChildNodes()) {
        el.insertBefore(this.element, el.firstChild)
      } else {
        el.appendChild(this.element)
      }
    } else {
      document.body.appendChild(this.element)
    }
  }

  private transitionEnd(property: string): Promise<void> {
    return new Promise((resolve) => {
      const onTransitionEnd = (e: any) => {
        if (e.propertyName === property) {
          resolve()
          this.element.removeEventListener(transitionEvent, onTransitionEnd)
        }
      }
      this.element.addEventListener(transitionEvent, onTransitionEnd)
    })
  }
}
