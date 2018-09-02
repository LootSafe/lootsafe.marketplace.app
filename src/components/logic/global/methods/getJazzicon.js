import jazzicon from 'jazzicon'

export default function (seed, size = 35) {
  const addr = seed.slice(2, 10)
  return jazzicon(size, parseInt(addr, 16))
}
