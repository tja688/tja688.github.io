const clamp = (number) =>
  Math.max(0, Math.min(1, Number.isFinite(number) ? number : 0))

/** Schedules a sound into real or OfflineAudioContext. Exposed for waveform checks. */
export function scheduleCue(
  context,
  destination,
  recipe,
  { start = context.currentTime, level = 1, pan = 0, onEnded = () => {} } = {},
) {
  const voices = []
  for (const layer of recipe) {
    const at = start + (layer.delay ?? 0),
      end = at + layer.duration
    const oscillator = context.createOscillator(),
      envelope = context.createGain(),
      stereo = context.createStereoPanner()
    oscillator.type = layer.wave
    oscillator.frequency.setValueAtTime(layer.frequency, at)
    oscillator.frequency.exponentialRampToValueAtTime(
      Math.max(20, layer.end),
      end,
    )
    envelope.gain.setValueAtTime(0, at)
    envelope.gain.linearRampToValueAtTime(
      Math.max(0.0001, layer.gain * clamp(level)),
      at + Math.min(0.005, layer.duration / 3),
    )
    envelope.gain.exponentialRampToValueAtTime(0.0001, end)
    stereo.pan.value = Math.max(-1, Math.min(1, pan))
    oscillator.connect(envelope)
    envelope.connect(stereo)
    stereo.connect(destination)
    oscillator.start(at)
    oscillator.stop(end + 0.015)
    const voice = { oscillator, envelope, stereo }
    voices.push(voice)
    oscillator.onended = () => {
      oscillator.disconnect()
      envelope.disconnect()
      stereo.disconnect()
      onEnded(voice)
    }
  }
  return voices
}

export class InkAudio {
  constructor(theme, { storageKey = 'pixel-ink-audio' } = {}) {
    this.theme = theme
    this.storageKey = storageKey
    this.context = null
    this.music = null
    this.effects = null
    this.master = null
    this.voices = new Set()
    this.ambience = null
    this.lastCue = new Map()
    this.eventIds = new Set()
    this.levels = {
      master: theme.audio.master,
      music: theme.audio.music,
      effects: theme.audio.effects,
      muted: false,
    }
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? 'null')
      if (saved && typeof saved === 'object')
        for (const key of ['master', 'music', 'effects'])
          if (typeof saved[key] === 'number')
            this.levels[key] = clamp(saved[key])
      if (typeof saved?.muted === 'boolean') this.levels.muted = saved.muted
    } catch {
      /* In-memory levels still work when storage is unavailable. */
    }
  }
  async unlock() {
    if (this.context?.state === 'closed') this.context = null
    if (!this.context) {
      if (typeof AudioContext === 'undefined') return false
      this.context = new AudioContext()
      this.master = this.context.createGain()
      this.music = this.context.createGain()
      this.effects = this.context.createGain()
      const limiter = this.context.createDynamicsCompressor()
      limiter.threshold.value = -9
      limiter.knee.value = 10
      limiter.ratio.value = 8
      limiter.attack.value = 0.004
      limiter.release.value = 0.15
      this.music.connect(this.master)
      this.effects.connect(this.master)
      this.master.connect(limiter)
      limiter.connect(this.context.destination)
      this.applyLevels()
    }
    if (this.context.state === 'suspended') await this.context.resume()
    return this.context.state === 'running'
  }
  applyLevels() {
    if (!this.context || !this.master) return
    const at = this.context.currentTime
    const apply = (parameter, level, smoothing) => {
      // An idle bus may defer its ramp until the next voice; zero is immediate.
      if (level === 0) {
        parameter.cancelScheduledValues(at)
        parameter.setValueAtTime(0, at)
      } else parameter.setTargetAtTime(level, at, smoothing)
    }
    apply(this.master.gain, this.levels.muted ? 0 : this.levels.master, 0.02)
    apply(this.music.gain, this.levels.music, 0.03)
    apply(this.effects.gain, this.levels.effects, 0.02)
  }
  setLevels(patch) {
    for (const key of ['master', 'music', 'effects'])
      if (typeof patch[key] === 'number') this.levels[key] = clamp(patch[key])
    if (typeof patch.muted === 'boolean') this.levels.muted = patch.muted
    this.applyLevels()
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.levels))
    } catch {
      /* Optional persistence. */
    }
  }
  play(name, { eventId, level = 1, pan = 0 } = {}) {
    const recipe = this.theme.audio.cues[name]
    if (!recipe) throw new Error(`Unknown audio cue: ${name}`)
    if (!this.context || this.context.state !== 'running' || this.levels.muted)
      return false
    const now = this.context.currentTime
    const cooldown =
      (name === 'hover'
        ? this.theme.audio.hoverCooldownMs
        : name === 'impact'
          ? this.theme.audio.impactCooldownMs
          : 15) / 1000
    if (
      now - (this.lastCue.get(name) ?? -Infinity) < cooldown ||
      this.voices.size + recipe.length > this.theme.audio.maxVoices
    )
      return false
    const key = eventId == null ? null : `${name}:${eventId}`
    if (key && this.eventIds.has(key)) return false
    if (key) {
      this.eventIds.add(key)
      if (this.eventIds.size > 256)
        this.eventIds.delete(this.eventIds.values().next().value)
    }
    this.lastCue.set(name, now)
    const voices = scheduleCue(this.context, this.effects, recipe, {
      level,
      pan,
      onEnded: (voice) => this.voices.delete(voice),
    })
    voices.forEach((voice) => this.voices.add(voice))
    return true
  }
  startAmbience(mood = 'mysterious') {
    if (!this.context || this.context.state !== 'running') return false
    if (this.ambience?.mood === mood) return true
    const config = this.theme.audio.moods[mood]
    if (!config) throw new Error(`Unknown ambience mood: ${mood}`)
    this.stopAmbience()
    const gain = this.context.createGain(),
      filter = this.context.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = config.cutoff
    gain.gain.setValueAtTime(0, this.context.currentTime)
    gain.gain.linearRampToValueAtTime(
      this.theme.audio.ambienceGain,
      this.context.currentTime + 0.4,
    )
    gain.connect(filter)
    filter.connect(this.music)
    const oscillators = config.frequencies.map((frequency) => {
      const oscillator = this.context.createOscillator()
      oscillator.type = 'sine'
      oscillator.frequency.value = frequency
      oscillator.connect(gain)
      oscillator.start()
      return oscillator
    })
    this.ambience = { mood, gain, filter, oscillators }
    return true
  }
  stopAmbience() {
    if (!this.ambience) return
    const previous = this.ambience
    this.ambience = null
    previous.gain.gain.setTargetAtTime(0, this.context.currentTime, 0.025)
    previous.oscillators.forEach((oscillator) => {
      oscillator.stop(this.context.currentTime + 0.15)
      oscillator.onended = () => oscillator.disconnect()
    })
    previous.oscillators[0].onended = () => {
      previous.oscillators[0].disconnect()
      previous.gain.disconnect()
      previous.filter.disconnect()
    }
  }
  async suspend() {
    if (this.context?.state === 'running') await this.context.suspend()
  }
  async resume() {
    if (this.context?.state === 'suspended') await this.context.resume()
  }
  async dispose() {
    if (!this.context) return
    this.stopAmbience()
    this.voices.forEach((voice) => {
      try {
        voice.oscillator.stop()
      } catch {
        /* Already ended. */
      }
    })
    this.voices.clear()
    this.eventIds.clear()
    this.lastCue.clear()
    await this.context.close()
    this.context = null
  }
}
