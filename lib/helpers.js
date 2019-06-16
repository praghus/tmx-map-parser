const noop = () => {}
const random = (min, max) => min + (Math.random() * (max - min))
const randomInt = (min, max) => Math.round(random(min, max))
const overlap = (a, b) => a.x < b.x + b.width &&  a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y
const isValidArray = (arr) => arr && arr.length
const getFilename = (path) => path.replace(/^.*[\\/]/, '').split('.').slice(0, -1).join('.')
const isDataURL = (s) => !!s.match(/^\s*data:([a-z]+\/[a-z]+(;[a-z-]+=[a-z-]+)?)?(;base64)?,[a-z0-9!$&',()*+,;=\-._~:@/?%\s]*\s*$/i)
const normalize = (n, min, max) => {
    while (n < min) {
        n += (max - min)
    }
    while (n >= max) {
        n -= (max - min)
    }
    return n
}

export {
    noop,
    random,
    randomInt,
    overlap,
    normalize,
    getFilename,
    isDataURL,
    isValidArray
}
