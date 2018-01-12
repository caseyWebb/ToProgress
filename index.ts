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

  private _progress = 0
  private get progress(): number {
    return this._progress
  }
  private set progress(v: number) {
    this.progressBar.style.width = v + '%'
    this._progress = v
  }

  public reset(callback?: () => void) {
    this.progress = 0
    if (callback) callback()
  }

  public hide() {
    this.progressBar.style.opacity = '0'
  }

  public show() {
    this.progressBar.style.opacity = '1'
  }

  public getProgress() {
    return this.progress
  }

  public setProgress(progress: number, callback?: () => void) {
    this.show()
    if (progress > 100) {
      this.progress = 100
    } else if (progress < 0) {
      this.progress = 0
    } else {
      this.progress = progress
    }
    if (callback) callback()
  }

  public increase(i: number, callback?: () => void) {
    this.setProgress(this.progress + i, callback)
  }

  public decrease(i: number, callback?: () => void) {
    this.setProgress(this.progress - i, callback)
  }

  public finish(callback?: () => void) {
    this.setProgress(100)
    this.hide()
    const onTransitionEnd = () => {
      this.reset(callback)
      this.progressBar.removeEventListener(transitionEvent, onTransitionEnd)
    }
    this.progressBar.addEventListener(transitionEvent, onTransitionEnd)
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
      'transition': 'width ' + this.options.duration + 's' + ', opacity ' + this.options.opacityDuration + 's',
      '-moz-transition': 'width ' + this.options.duration + 's' + ', opacity ' + this.options.opacityDuration + 's',
      '-webkit-transition': 'width ' + this.options.duration + 's' + ', opacity ' + this.options.opacityDuration + 's'
    }
    Object.keys(styles).forEach((style: string) => (this.progressBar.style as any)[style] = styles[style])
  }

  private createProgressBar() {
    if (this.options.selector) {
      const el = document.querySelector(this.options.selector)
      if (el.hasChildNodes()) {
        el.insertBefore(this.progressBar, el.firstChild)
      } else {
        el.appendChild(this.progressBar)
      }
    } else {
      document.body.appendChild(this.progressBar)
    }
  }
}
