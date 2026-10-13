import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'

const skill = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const themeFlag = args.indexOf('--theme'),
  outFlag = args.indexOf('--out')
const themePath = resolve(
  themeFlag < 0 ? join(skill, 'assets/theme.json') : args[themeFlag + 1],
)
const output = resolve(
  outFlag < 0 ? join(skill, 'assets/audio') : args[outFlag + 1],
)
const theme = JSON.parse(readFileSync(themePath, 'utf8').replace(/^\uFEFF/, ''))
const sampleRate = 44100
mkdirSync(output, { recursive: true })

function wave(type, phase, frequency) {
  if (type === 'sine') return Math.sin(phase)
  const harmonics = Math.min(21, Math.floor((sampleRate * 0.48) / frequency))
  let sample = 0
  if (type === 'square') {
    for (let n = 1; n <= harmonics; n += 2) sample += Math.sin(n * phase) / n
    return (sample * 4) / Math.PI
  }
  if (type === 'triangle') {
    for (let n = 1; n <= harmonics; n += 2)
      sample += ((n % 4 === 1 ? 1 : -1) * Math.sin(n * phase)) / (n * n)
    return (sample * 8) / (Math.PI * Math.PI)
  }
  if (type === 'sawtooth') {
    for (let n = 1; n <= harmonics; n++)
      sample += ((n % 2 === 1 ? 1 : -1) * Math.sin(n * phase)) / n
    return (sample * 2) / Math.PI
  }
  throw new Error(`Unsupported wave ${type}`)
}

const manifest = {
  source: 'theme.json audio.cues',
  sampleRate,
  channels: 2,
  format: 'PCM16 WAV',
  renderer: 'Bounded additive synthesis, exponential pitch and decay',
  files: [],
}
for (const [name, layers] of Object.entries(theme.audio.cues)) {
  if (!/^[a-z0-9_-]+$/.test(name))
    throw new Error(`Use a simple cue filename: ${name}`)
  const duration =
    Math.max(...layers.map((layer) => layer.duration + (layer.delay ?? 0))) +
    0.06
  const frames = Math.ceil(duration * sampleRate),
    samples = new Float64Array(frames)
  for (const layer of layers) {
    const delay = layer.delay ?? 0,
      attack = Math.min(0.005, layer.duration / 3),
      ratio = Math.log(layer.end / layer.frequency)
    for (let i = Math.round(delay * sampleRate); i < frames; i++) {
      const time = i / sampleRate - delay
      if (time < 0 || time >= layer.duration) continue
      const frequency =
        layer.frequency * Math.exp((ratio * time) / layer.duration)
      const phase =
        Math.abs(ratio) < 1e-8
          ? Math.PI * 2 * layer.frequency * time
          : ((Math.PI * 2 * layer.frequency * layer.duration) / ratio) *
            (Math.exp((ratio * time) / layer.duration) - 1)
      const envelope =
        time < attack
          ? (layer.gain * time) / attack
          : layer.gain *
            Math.pow(
              0.0001 / layer.gain,
              (time - attack) / (layer.duration - attack),
            )
      samples[i] += (wave(layer.wave, phase, frequency) * envelope) / Math.SQRT2
    }
  }
  let peak = 0,
    energy = 0
  for (const sample of samples) {
    peak = Math.max(peak, Math.abs(sample))
    energy += sample * sample
  }
  if (peak >= 0.9 || energy <= 0)
    throw new Error(`Silence or clipping in cue ${name}`)
  const bytes = frames * 4,
    wav = Buffer.alloc(44 + bytes)
  wav.write('RIFF', 0)
  wav.writeUInt32LE(bytes + 36, 4)
  wav.write('WAVEfmt ', 8)
  wav.writeUInt32LE(16, 16)
  wav.writeUInt16LE(1, 20)
  wav.writeUInt16LE(2, 22)
  wav.writeUInt32LE(sampleRate, 24)
  wav.writeUInt32LE(sampleRate * 4, 28)
  wav.writeUInt16LE(4, 32)
  wav.writeUInt16LE(16, 34)
  wav.write('data', 36)
  wav.writeUInt32LE(bytes, 40)
  for (let i = 0; i < frames; i++) {
    const value = Math.round(samples[i] * 32767)
    wav.writeInt16LE(value, 44 + i * 4)
    wav.writeInt16LE(value, 46 + i * 4)
  }
  writeFileSync(join(output, `${name}.wav`), wav)
  manifest.files.push({
    file: `${name}.wav`,
    bytes: wav.length,
    duration: frames / sampleRate,
    peak,
    rms: Math.sqrt(energy / frames),
    sha256: createHash('sha256').update(wav).digest('hex'),
  })
}
writeFileSync(join(output, 'sources.json'), JSON.stringify(manifest, null, 2))
console.log(
  JSON.stringify(
    {
      status: 'rendered',
      output,
      cues: manifest.files.length,
      maxPeak: Math.max(...manifest.files.map((file) => file.peak)),
    },
    null,
    2,
  ),
)
