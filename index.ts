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
    opacityDuration: 0.6,
    position: 'top',
    selector: undefined as undefined | string
  }
  private progressBar = document.createElement('div')

  constructor(opts: ToProgressOptions = {}) {
    Object.assign(this.options, opts)
    this.options.opacityDuration = this.options.duration * 3
    this.progressBar.id = this.options.id
    this.setCSS()
    this.createProgressBar()
  }

  private progress = 0

  public getProgress() {
    return this.progress
  }

  public setProgress(progress: number) {
    this.progress = Math.min(100, Math.max(0, progress))
    this.show()
    this.progressBar.style.width = this.progress + '%'
    return this.transitionEnd()
  }

  public increase(i: number) {
    return this.setProgress(this.progress + i)
  }

  public decrease(i: number) {
    return this.setProgress(this.progress - i)
  }

  public hide() {
    this.progressBar.style.opacity = '0'
  }

  public show() {
    this.progressBar.style.opacity = '1'
  }

  public finish() {
    this.hide()
    return this.setProgress(100).then(() => this.reset())
  }

  public reset() {
    this.setProgress(0)
    this.hide()
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
      'transition': 'width ' + this.options.duration + 's' + ', opacity ' + this.options.opacityDuration + 's',
      '-moz-transition': 'width ' + this.options.duration + 's' + ', opacity ' + this.options.opacityDuration + 's',
      '-webkit-transition': 'width ' + this.options.duration + 's' + ', opacity ' + this.options.opacityDuration + 's'
    }
    Object.keys(styles).forEach((style: string) => (this.progressBar.style as any)[style] = styles[style])
  }

  private createProgressBar() {
    if (this.options.selector) {
      const el = document.querySelector(this.options.selector)
      if (!el) {
        throw new Error(`[toprogress2] Element not found with selector ${this.options.selector}`)
      }
      if (el.hasChildNodes()) {
        el.insertBefore(this.progressBar, el.firstChild)
      } else {
        el.appendChild(this.progressBar)
      }
    } else {
      document.body.appendChild(this.progressBar)
    }
  }

  private transitionEnd(): Promise<void> {
    return new Promise((resolve) => {
      const onTransitionEnd = () => {
        resolve()
        this.progressBar.removeEventListener(transitionEvent, onTransitionEnd)
      }
      this.progressBar.addEventListener(transitionEvent, onTransitionEnd)
    })
  }
}
