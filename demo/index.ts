import { ToProgress } from '../index'

const progressBar = new ToProgress({ height: '5px' })

const br = Symbol('BR')

const elements = [
  ['start', 5],
  ['start', 30],
  ['start', 60],
  ['stop'],
  ['finish'],
  br,
  ['show'],
  ['hide'],
  br,
  ['setProgress', 50],
  ['increase', 15],
  ['decrease', 15],
  br,
  ['reset']
]

elements.forEach((el) => {
  if (el === br) {
    document.body.appendChild(document.createElement('br'))
  } else {
    const [method, arg] = el as [string, number]
    const button = document.createElement('button')
    button.addEventListener('click', () => (progressBar as any)[method](arg))
    button.innerHTML = `.${method}(${arg || ''})`
    document.body.appendChild(button)
  }
})
