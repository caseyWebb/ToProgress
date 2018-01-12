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

// tslint:disable-next-line interface-name
export interface ToProgressOptions {
  /**
   * id attribute to assign progress bar element
   * @default `'toprogress'`
   */
  id?: string
  /**
   * Progress bar color
   * @default `'#F44336'`
   */
  color?: string
  /**
   * Progress bar height
   * @default `'2px'`
   */
  height?: string
  /**
   * CSS transition duration for `.finish()`, `.setProgress()`, `.increase()`, `.decrease()`, and `.reset()`
   * @default `'0.2s'`
   */
  duration?: number
  /**
   * Progress bar position. `top` or `bottom`
   * @default `'top'`
   */
  position?: string
  /**
   * Selector of progress bar container
   * @default `'body'`
   */
  selector?: string
}

export class ToProgress {
  private options = {
    id: 'toprogress',
    color: '#F44336',
    height: '2px',
    duration: 0.2,
    position: 'top',
    selector: 'body'
  }
  private element = document.createElement('div')
  private progress = 0

  constructor(opts?: ToProgressOptions) {
    Object.assign(this.options, opts || {})
    this.element.id = this.options.id
    this.setCSS()
    this.setTransition(this.options.duration)
    this.createProgressBar()
  }

  /**
   * Note, because .start() uses a single CSS transition, this will not
   * accurately reflect the position on the screen
   * @returns Current progress
   */
  public getProgress() {
    return this.progress
  }

  /**
   * @param progress 0-100
   * @returns Promise which resolves after transition animation completes
   */
  public setProgress(progress: number) {
    this.progress = Math.min(100, Math.max(0, progress))
    this.element.style.width = this.progress + '%'
    return this.transitionEnd('width')
  }

  /**
   * @param duration Max amount of time to animate. Larger values = slower moving bar.
   * @param easing CSS transition easing
   * @returns Promise which resolves after timeout or `.finish()`
   */
  public start(duration: number = 30, easing = 'cubic-bezier(0.05, 0.45, 0.05, 0.95)') {
    this.show()
    this.setTransition(duration, easing)
    /**
     * Need to ensure that if already started the width is changed so
     * that the new transition takes effect.
     */
    return this.setProgress(this.progress === 99 ? 98 : 99)
  }

  public stop() {
    this.setTransition(10e10)
    this.setProgress(this.progress - 1).catch(() => { /* noop */})
  }

  /**
   * @param i Amount to increment progress
   * @returns Promise which resolves after animation completes
   */
  public increase(i: number) {
    return this.setProgress(this.progress + i)
  }

  /**
   * @param i Amount to decrement progress
   * @returns Promise which resolves after animation completes
   */
  public decrease(i: number) {
    return this.setProgress(this.progress - i)
  }

  public hide() {
    this.element.style.opacity = '0'
  }

  public show() {
    this.element.style.opacity = '1'
  }

  /**
   * Transition to 100%, hide, and reset
   *
   * @returns Promise which resolves after progress bar has been reset
   */
  public finish() {
    this.setTransition(this.options.duration)
    this.setProgress(100).catch(() => { /* noop */ })
    this.hide()
    return this.transitionEnd('opacity').then(() => this.reset())
  }

  /**
   * Set progress to 0 and show after transition completes
   *
   * @returns Promise which resolves after progress bar has been reset
   */
  public reset() {
    this.setTransition(this.options.duration)
    return this.setProgress(0).then(() => this.show())
  }

  public destroy() {
    this.element.remove()
  }

  private setCSS() {
    const styles: { [k: string]: string } = {
      'position': this.options.selector === 'body' ? 'fixed' : 'absolute',
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
    const el = document.querySelector(this.options.selector)
    if (!el) {
      throw new Error(`[toprogress2] Element not found with selector ${this.options.selector}`)
    }
    if (el.hasChildNodes()) {
      el.insertBefore(this.element, el.firstChild)
    } else {
      el.appendChild(this.element)
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
