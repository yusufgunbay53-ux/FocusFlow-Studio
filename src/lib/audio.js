let ctx
let rainNodes = null
let lofiNodes = null

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  return ctx
}

export function playChime() {
  const ac = getCtx()
  const now = ac.currentTime
  ;[523.25, 659.25, 783.99].forEach((freq, i) => {
    const osc = ac.createOscillator()
    const gain = ac.createGain()
    osc.type = 'sine'
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0, now + i * 0.08)
    gain.gain.linearRampToValueAtTime(0.08, now + i * 0.08 + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.8)
    osc.connect(gain).connect(ac.destination)
    osc.start(now + i * 0.08)
    osc.stop(now + i * 0.08 + 0.85)
  })
}

function makeNoiseBuffer(ac) {
  const buffer = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  return buffer
}

export async function startRain(volume = 0.25) {
  stopRain()
  const ac = getCtx()
  await ac.resume()
  const src = ac.createBufferSource()
  src.buffer = makeNoiseBuffer(ac)
  src.loop = true
  const filter = ac.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 900
  const gain = ac.createGain()
  gain.gain.value = volume * 0.18
  src.connect(filter).connect(gain).connect(ac.destination)
  src.start()
  rainNodes = { src, gain }
}

export function stopRain() {
  if (!rainNodes) return
  try {
    rainNodes.src.stop()
  } catch {}
  rainNodes = null
}

export function setRainVolume(v) {
  if (rainNodes) rainNodes.gain.gain.value = v * 0.18
}

export async function startLofi(volume = 0.25) {
  stopLofi()
  const ac = getCtx()
  await ac.resume()
  const master = ac.createGain()
  master.gain.value = volume * 0.12
  master.connect(ac.destination)

  const notes = [196, 246.94, 293.66, 329.63]
  const oscs = notes.map((freq, i) => {
    const osc = ac.createOscillator()
    const g = ac.createGain()
    osc.type = 'triangle'
    osc.frequency.value = freq
    g.gain.value = 0.15 + i * 0.02
    const lfo = ac.createOscillator()
    const lfoGain = ac.createGain()
    lfo.frequency.value = 0.12 + i * 0.04
    lfoGain.gain.value = 6
    lfo.connect(lfoGain).connect(osc.frequency)
    osc.connect(g).connect(master)
    osc.start()
    lfo.start()
    return { osc, lfo }
  })

  lofiNodes = { master, oscs }
}

export function stopLofi() {
  if (!lofiNodes) return
  lofiNodes.oscs.forEach(({ osc, lfo }) => {
    try {
      osc.stop()
      lfo.stop()
    } catch {}
  })
  lofiNodes = null
}

export function setLofiVolume(v) {
  if (lofiNodes) lofiNodes.master.gain.value = v * 0.12
}

export function stopAllAmbient() {
  stopRain()
  stopLofi()
}
