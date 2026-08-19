/**
 * Procedural Web Audio API sound synthesizer for authentic retro/voxel SFX.
 * Zero external asset dependencies, instant playback and crisp chimes.
 */

class SoundController {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private ambientOsc: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;

  // Background music state
  private musicPlaying: boolean = false;
  private musicTimer: ReturnType<typeof setTimeout> | null = null;
  private musicMasterGain: GainNode | null = null;
  private musicReverbGain: GainNode | null = null;
  private musicConvolver: ConvolverNode | null = null;

  constructor() {
    // Lazy AudioContext initialization upon first user gesture
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
    if (!val && this.ambientGain) {
      this.ambientGain.gain.setValueAtTime(0, this.ctx?.currentTime || 0);
    }
    // Mute/unmute background music
    if (this.musicMasterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.musicMasterGain.gain.cancelScheduledValues(now);
      this.musicMasterGain.gain.setValueAtTime(
        this.musicMasterGain.gain.value, now
      );
      this.musicMasterGain.gain.linearRampToValueAtTime(val ? 1 : 0, now + 0.3);
    }
  }

  // ─── Procedural Ambient Background Music ────────────────────────
  // Generates calm, Minecraft-style piano notes in a pentatonic scale
  // with soft reverb — fully procedural, no audio files needed.

  private createReverbBuffer(): AudioBuffer | null {
    if (!this.ctx) return null;
    const sampleRate = this.ctx.sampleRate;
    const length = sampleRate * 2.5; // 2.5 second reverb tail
    const buffer = this.ctx.createBuffer(2, length, sampleRate);

    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        // Exponential decay with noise for natural reverb
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.8);
      }
    }
    return buffer;
  }

  private initMusicChain() {
    if (!this.ctx) return;
    if (this.musicMasterGain) return; // already initialized

    // Master volume
    this.musicMasterGain = this.ctx.createGain();
    this.musicMasterGain.gain.setValueAtTime(this.enabled ? 1 : 0, this.ctx.currentTime);
    this.musicMasterGain.connect(this.ctx.destination);

    // Reverb convolver
    const reverbBuffer = this.createReverbBuffer();
    if (reverbBuffer) {
      this.musicConvolver = this.ctx.createConvolver();
      this.musicConvolver.buffer = reverbBuffer;

      this.musicReverbGain = this.ctx.createGain();
      this.musicReverbGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

      this.musicConvolver.connect(this.musicReverbGain);
      this.musicReverbGain.connect(this.musicMasterGain);
    }
  }

  private playMusicNote() {
    if (!this.ctx || !this.musicMasterGain) return;

    const now = this.ctx.currentTime;

    // Calm pentatonic scale notes across multiple octaves (C, D, E, G, A)
    const scaleFreqs = [
      // Octave 3
      130.81, 146.83, 164.81, 196.00, 220.00,
      // Octave 4
      261.63, 293.66, 329.63, 392.00, 440.00,
      // Octave 5
      523.25, 587.33, 659.25, 783.99, 880.00,
    ];

    const freq = scaleFreqs[Math.floor(Math.random() * scaleFreqs.length)];

    // Soft sine + triangle blend for piano-like warmth
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq, now);

    const noteDuration = 1.8 + Math.random() * 1.5;

    // Soft attack, slow decay — piano-like envelope
    noteGain.gain.setValueAtTime(0, now);
    noteGain.gain.linearRampToValueAtTime(0.07 + Math.random() * 0.04, now + 0.05);
    noteGain.gain.exponentialRampToValueAtTime(0.001, now + noteDuration);

    osc1.connect(noteGain);
    osc2.connect(noteGain);

    // Dry path
    noteGain.connect(this.musicMasterGain);

    // Wet reverb path
    if (this.musicConvolver) {
      noteGain.connect(this.musicConvolver);
    }

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + noteDuration + 0.1);
    osc2.stop(now + noteDuration + 0.1);

    // Occasionally play a second harmony note
    if (Math.random() > 0.55) {
      const harmonyIdx = Math.floor(Math.random() * scaleFreqs.length);
      const harmFreq = scaleFreqs[harmonyIdx];
      const harmDelay = 0.1 + Math.random() * 0.3;

      const hOsc = this.ctx.createOscillator();
      const hGain = this.ctx.createGain();

      hOsc.type = 'sine';
      hOsc.frequency.setValueAtTime(harmFreq, now + harmDelay);

      hGain.gain.setValueAtTime(0, now + harmDelay);
      hGain.gain.linearRampToValueAtTime(0.04 + Math.random() * 0.03, now + harmDelay + 0.05);
      hGain.gain.exponentialRampToValueAtTime(0.001, now + harmDelay + noteDuration);

      hOsc.connect(hGain);
      hGain.connect(this.musicMasterGain);
      if (this.musicConvolver) {
        hGain.connect(this.musicConvolver);
      }

      hOsc.start(now + harmDelay);
      hOsc.stop(now + harmDelay + noteDuration + 0.1);
    }
  }

  private scheduleNextNote() {
    if (!this.musicPlaying) return;

    this.playMusicNote();

    // Random interval between notes: 0.8s to 2.5s for organic feel
    const nextDelay = 800 + Math.random() * 1700;
    this.musicTimer = setTimeout(() => this.scheduleNextNote(), nextDelay);
  }

  public startMusic() {
    if (this.musicPlaying) return;
    this.initCtx();
    if (!this.ctx) return;

    this.initMusicChain();
    this.musicPlaying = true;
    this.scheduleNextNote();
  }

  public stopMusic() {
    this.musicPlaying = false;
    if (this.musicTimer) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }

  public isMusicPlaying(): boolean {
    return this.musicPlaying;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public playClick() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  public playXpGain() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio

    notes.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + i * 0.06;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.18, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.12);
    });
  }

  public playDoorOpen() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Low rumble + metallic click
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(90, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.4);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  public playCoin() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Classic Mario/Minecraft style high ding
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'square';

    osc1.frequency.setValueAtTime(987.77, now); // B5
    osc1.frequency.setValueAtTime(1318.51, now + 0.08); // E6

    osc2.frequency.setValueAtTime(987.77, now);
    osc2.frequency.setValueAtTime(1318.51, now + 0.08);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.45);
    osc2.stop(now + 0.45);
  }

  public playMineCrack() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220 + Math.random() * 50, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  public playBlockBreak() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Low pop + high sparkle
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(160, now);
    osc1.frequency.exponentialRampToValueAtTime(40, now + 0.18);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1200, now);
    osc2.frequency.exponentialRampToValueAtTime(2400, now + 0.2);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.25);
    osc2.stop(now + 0.25);
  }

  public playTeleport() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.12);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  public playError() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.setValueAtTime(110, now + 0.08);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  public playPortalCharge(progress: number) {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const baseFreq = 120 + progress * 600;
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.linearRampToValueAtTime(baseFreq + 100, now + 0.25);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  public playPortalBoom() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Sub bass drop + explosive noise
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.8);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 1.2);
  }

  public playFanfare() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Epic victory chord progression: G4, C5, E5, G5, C6
    const chord = [
      { f: 392.00, t: 0 },
      { f: 523.25, t: 0.12 },
      { f: 659.25, t: 0.24 },
      { f: 783.99, t: 0.36 },
      { f: 1046.50, t: 0.48 },
      { f: 1318.51, t: 0.60 }
    ];

    chord.forEach(({ f, t }) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const st = now + t;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, st);

      gain.gain.setValueAtTime(0.2, st);
      gain.gain.exponentialRampToValueAtTime(0.001, st + 0.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(st);
      osc.stop(st + 0.8);
    });
  }
}

export const sound = new SoundController();
