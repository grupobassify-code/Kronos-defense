/**
 * AI Procedural Music Synthesis Engine
 * 
 * Generates dynamic, multi-layered soundtracks using the Web Audio API without any external audio asset dependencies.
 * - Menu Theme ("Menú de Cartas / Armería"): Ambient ethereal cyber-fantasy synth chords, crystal arpeggios, sub bass, and relaxing groove.
 * - Battle Theme ("Combate en Vivo"): High-energy 124 BPM tower defense battle soundtrack with rolling cyber bass, synthesized drums, and tactical heroic lead arpeggios.
 */

export type MusicTheme = 'MENU' | 'BATTLE' | 'NONE';

class ProceduralMusicEngine {
  private ctx: AudioContext | null = null;
  private masterMusicGain: GainNode | null = null;
  private currentTheme: MusicTheme = 'NONE';
  private targetTheme: MusicTheme = 'NONE';
  private isMuted: boolean = false;
  private volume: number = 0.35;
  private isWaveActive: boolean = false;

  // Track timer intervals
  private sequenceTimer: number | null = null;
  private stepIndex: number = 0;
  private currentGainNodes: GainNode[] = [];

  // Delay node for stereo ping-pong spatial effect
  private delayNode: DelayNode | null = null;
  private delayGain: GainNode | null = null;

  constructor() {
    // AudioContext will be lazily created or resumed on user gesture
    if (typeof window !== 'undefined') {
      const unlockAudio = () => {
        this.initContext();
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume().then(() => {
            if (this.targetTheme !== 'NONE' && this.currentTheme === 'NONE') {
              this.playTheme(this.targetTheme);
            }
          });
        }
      };

      window.addEventListener('click', unlockAudio, { once: false, passive: true });
      window.addEventListener('touchstart', unlockAudio, { once: false, passive: true });
      window.addEventListener('keydown', unlockAudio, { once: false, passive: true });
    }
  }

  private initContext() {
    try {
      if (!this.ctx && typeof window !== 'undefined') {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
          this.masterMusicGain = this.ctx.createGain();
          this.masterMusicGain.gain.setValueAtTime(
            this.isMuted ? 0 : this.volume,
            this.ctx.currentTime
          );
          this.masterMusicGain.connect(this.ctx.destination);

          // Create spatial ambient delay bus
          this.delayNode = this.ctx.createDelay();
          this.delayNode.delayTime.setValueAtTime(0.24, this.ctx.currentTime);
          this.delayGain = this.ctx.createGain();
          this.delayGain.gain.setValueAtTime(0.22, this.ctx.currentTime);

          this.delayNode.connect(this.delayGain);
          this.delayGain.connect(this.delayNode); // feedback
          this.delayGain.connect(this.masterMusicGain);
        }
      }

      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    } catch {
      // Ignore Web Audio restriction errors before user gesture
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterMusicGain && this.ctx && !this.isMuted) {
      this.masterMusicGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterMusicGain && this.ctx) {
      const targetGain = this.isMuted ? 0 : this.volume;
      this.masterMusicGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.08);
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getCurrentTheme(): MusicTheme {
    return this.currentTheme;
  }

  public setWaveActive(active: boolean) {
    this.isWaveActive = active;
  }

  /**
   * Crossfade and switch between themes seamlessly
   */
  public playTheme(theme: MusicTheme) {
    this.targetTheme = theme;
    if (this.currentTheme === theme) return;

    this.initContext();
    if (!this.ctx || !this.masterMusicGain) return;

    // Fade out previous generators
    this.stopSequence();
    this.currentTheme = theme;
    this.stepIndex = 0;

    if (theme === 'MENU') {
      this.startMenuSequence();
    } else if (theme === 'BATTLE') {
      this.startBattleSequence();
    }
  }

  public stopTheme() {
    this.targetTheme = 'NONE';
    this.currentTheme = 'NONE';
    this.stopSequence();
  }

  private stopSequence() {
    if (this.sequenceTimer !== null) {
      clearInterval(this.sequenceTimer);
      this.sequenceTimer = null;
    }
    // Clean up active oscillators smoothly
    const t = this.ctx ? this.ctx.currentTime : 0;
    this.currentGainNodes.forEach((gain) => {
      try {
        gain.gain.setTargetAtTime(0, t, 0.2);
      } catch {
        // Safe ignore
      }
    });
    this.currentGainNodes = [];
  }

  // -------------------------------------------------------------
  // THEME 1: CARDS & ARMORY HUB (Ambient Chill Fantasy / Lofi TD)
  // Key: E Minor / G Major modal progression (Em9 - Cmaj7 - G - Bm7)
  // -------------------------------------------------------------
  private startMenuSequence() {
    if (!this.ctx) return;

    // E minor / G major chords with pleasant modal harmonics
    const chords = [
      // Em9 (E2, G3, B3, D4, F#4)
      { root: 82.41, notes: [196.0, 246.94, 293.66, 369.99] },
      // Cmaj7 (C2, G3, B3, E4)
      { root: 65.41, notes: [196.0, 246.94, 329.63] },
      // Gmaj7 (G2, B3, D4, F#4)
      { root: 98.0, notes: [246.94, 293.66, 369.99] },
      // Bm7 (B1, F#3, A3, D4)
      { root: 61.74, notes: [185.0, 220.0, 293.66] }
    ];

    const arpScale = [196.0, 220.0, 246.94, 293.66, 329.63, 369.99, 392.0, 440.0, 493.88];

    const tempoBpm = 86;
    const stepDurationMs = (60 / tempoBpm / 2) * 1000; // 8th note steps (~348ms)

    const tick = () => {
      if (!this.ctx || !this.masterMusicGain || this.currentTheme !== 'MENU') return;
      const t = this.ctx.currentTime;
      const currentChordIndex = Math.floor((this.stepIndex / 8) % chords.length);
      const chord = chords[currentChordIndex];
      const stepInChord = this.stepIndex % 8;

      // 1. Play Warm Pad Chord on Bar Start (every 8 steps)
      if (stepInChord === 0) {
        this.playMenuPad(chord.notes, t, (stepDurationMs * 8) / 1000);
        this.playMenuSubBass(chord.root, t, (stepDurationMs * 8) / 1000);
      }

      // 2. Gentle Arpeggio / Crystal Chime (steps 1, 3, 5, 7 with melodic wander)
      if (stepInChord % 2 === 1 || stepInChord === 4) {
        const noteIndex = (this.stepIndex * 3 + stepInChord) % arpScale.length;
        const noteFreq = arpScale[noteIndex];
        this.playCrystalNote(noteFreq, t, 0.45);
      }

      // 3. Ambient Shaker / Tape Noise Pulse on offbeats
      if (stepInChord === 2 || stepInChord === 6) {
        this.playMenuShaker(t);
      }

      // 4. Soft Heartbeat Sub Kick on beats 1 and 5
      if (stepInChord === 0 || stepInChord === 4) {
        this.playSoftKick(t);
      }

      this.stepIndex++;
    };

    // Initial trigger and schedule interval
    tick();
    this.sequenceTimer = window.setInterval(tick, stepDurationMs);
  }

  private playMenuPad(frequencies: number[], startTime: number, duration: number) {
    if (!this.ctx || !this.masterMusicGain) return;

    frequencies.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const filter = this.ctx!.createBiquadFilter();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);
      // Gentle detune for lush chorus
      osc.detune.setValueAtTime((idx - 1) * 7, startTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, startTime);
      filter.frequency.linearRampToValueAtTime(750, startTime + duration * 0.5);
      filter.frequency.linearRampToValueAtTime(400, startTime + duration);

      // Envelope: slow gentle attack (1.2s), sustained warm body, smooth release
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.065 / frequencies.length, startTime + 1.1);
      gain.gain.setValueAtTime(0.065 / frequencies.length, startTime + duration - 0.8);
      gain.gain.linearRampToValueAtTime(0.001, startTime + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterMusicGain!);

      // Also send a touch to delay bus
      if (this.delayNode) {
        gain.connect(this.delayNode);
      }

      osc.start(startTime);
      osc.stop(startTime + duration + 0.1);
      this.currentGainNodes.push(gain);
    });
  }

  private playMenuSubBass(frequency: number, startTime: number, duration: number) {
    if (!this.ctx || !this.masterMusicGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, startTime);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(0.09, startTime + 0.3);
    gain.gain.setValueAtTime(0.08, startTime + duration - 0.4);
    gain.gain.linearRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.masterMusicGain);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.1);
    this.currentGainNodes.push(gain);
  }

  private playCrystalNote(frequency: number, startTime: number, noteLen: number) {
    if (!this.ctx || !this.masterMusicGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, startTime);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(0.045, startTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + noteLen);

    osc.connect(gain);
    gain.connect(this.masterMusicGain);

    if (this.delayNode) {
      gain.connect(this.delayNode);
    }

    osc.start(startTime);
    osc.stop(startTime + noteLen + 0.05);
  }

  private playMenuShaker(startTime: number) {
    if (!this.ctx || !this.masterMusicGain) return;
    const bufferSize = this.ctx.sampleRate * 0.06;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(5000, startTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.02, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.05);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterMusicGain);

    noise.start(startTime);
  }

  private playSoftKick(startTime: number) {
    if (!this.ctx || !this.masterMusicGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(80, startTime);
    osc.frequency.exponentialRampToValueAtTime(35, startTime + 0.12);

    gain.gain.setValueAtTime(0.08, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.14);

    osc.connect(gain);
    gain.connect(this.masterMusicGain);

    osc.start(startTime);
    osc.stop(startTime + 0.15);
  }

  // -------------------------------------------------------------
  // THEME 2: IN-GAME BATTLE THEME (Dynamic High-Energy Tower Defense)
  // Tempo: 124 BPM, Key: D Minor (D, F, G, A, Bb, C)
  // Driving rolling cyber bass, synthesized drums, and battle motifs
  // -------------------------------------------------------------
  private startBattleSequence() {
    if (!this.ctx) return;

    // D Minor driving bassline progression (16 steps per bar)
    // D2 -> D2 -> F2 -> D2 | G2 -> F2 -> Bb1 -> A1
    const basslinePitches = [
      73.42, 73.42, 87.31, 73.42, 98.0, 87.31, 58.27, 55.0,
      73.42, 73.42, 110.0, 98.0, 87.31, 73.42, 65.41, 55.0
    ];

    // High energy 16th-note arpeggiator motif
    const arpMotif = [
      293.66, 349.23, 440.0, 523.25, 440.0, 349.23, 293.66, 349.23,
      392.0, 466.16, 587.33, 523.25, 466.16, 392.0, 440.0, 349.23
    ];

    // Heroic brass lead melody phrases (plays over 32 steps)
    const leadMotif: (number | null)[] = [
      293.66, null, 349.23, null, 440.0, null, 587.33, null,
      523.25, null, 440.0, null, 349.23, null, null, null,
      392.0, null, 440.0, null, 466.16, null, 587.33, null,
      659.25, null, 587.33, null, 440.0, null, null, null
    ];

    const tempoBpm = 124;
    const stepDurationMs = (60 / tempoBpm / 4) * 1000; // 16th note steps (~121ms)

    const tick = () => {
      if (!this.ctx || !this.masterMusicGain || this.currentTheme !== 'BATTLE') return;
      const t = this.ctx.currentTime;
      const step16 = this.stepIndex % 16;
      const step32 = this.stepIndex % 32;

      // 1. Driving Rolling Cyber Bass
      const bassFreq = basslinePitches[step16];
      this.playBattleBass(bassFreq, t, (stepDurationMs * 0.9) / 1000);

      // 2. High Cyber Arpeggiator (every 16th note)
      const arpFreq = arpMotif[step16];
      this.playBattleArp(arpFreq, t, 0.1);

      // 3. Heroic Lead Fanfare Synth (plays periodically during battle)
      const leadNote = leadMotif[step32];
      if (leadNote !== null) {
        this.playBattleHeroLead(leadNote, t, 0.28);
      }

      // 4. Drum Kit:
      // Kick: on beats 0, 4, 8, 12 (or 0 and 8 if prep phase)
      const isKickBeat = this.isWaveActive
        ? step16 % 4 === 0
        : step16 === 0 || step16 === 8;
      if (isKickBeat) {
        this.playBattleKick(t);
      }

      // Snare / Clap: on beats 4 and 12
      if (step16 === 4 || step16 === 12) {
        this.playBattleSnare(t);
      }

      // Hi-Hat: 16th note closed hat ticks with accent on offbeats
      if (this.isWaveActive || step16 % 2 === 0) {
        const isAccent = step16 % 4 === 2;
        this.playBattleHiHat(t, isAccent);
      }

      this.stepIndex++;
    };

    tick();
    this.sequenceTimer = window.setInterval(tick, stepDurationMs);
  }

  private playBattleBass(frequency: number, startTime: number, noteLen: number) {
    if (!this.ctx || !this.masterMusicGain) return;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(frequency, startTime);

    filter.type = 'lowpass';
    filter.Q.setValueAtTime(3.5, startTime);
    filter.frequency.setValueAtTime(650, startTime);
    filter.frequency.exponentialRampToValueAtTime(140, startTime + noteLen);

    gain.gain.setValueAtTime(0.09, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + noteLen);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterMusicGain);

    osc.start(startTime);
    osc.stop(startTime + noteLen + 0.02);
  }

  private playBattleArp(frequency: number, startTime: number, noteLen: number) {
    if (!this.ctx || !this.masterMusicGain) return;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(frequency, startTime);

    filter.type = 'lowpass';
    const cutoff = this.isWaveActive ? 1800 : 900;
    filter.frequency.setValueAtTime(cutoff, startTime);

    gain.gain.setValueAtTime(0.035, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + noteLen);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterMusicGain);

    if (this.delayNode) {
      gain.connect(this.delayNode);
    }

    osc.start(startTime);
    osc.stop(startTime + noteLen + 0.02);
  }

  private playBattleHeroLead(frequency: number, startTime: number, noteLen: number) {
    if (!this.ctx || !this.masterMusicGain) return;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'triangle';
    osc1.frequency.setValueAtTime(frequency, startTime);
    osc2.frequency.setValueAtTime(frequency, startTime);
    osc1.detune.setValueAtTime(-6, startTime);
    osc2.detune.setValueAtTime(6, startTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2200, startTime);
    filter.frequency.exponentialRampToValueAtTime(900, startTime + noteLen);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(0.055, startTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + noteLen);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterMusicGain);

    if (this.delayNode) {
      gain.connect(this.delayNode);
    }

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + noteLen + 0.05);
    osc2.stop(startTime + noteLen + 0.05);
  }

  private playBattleKick(startTime: number) {
    if (!this.ctx || !this.masterMusicGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, startTime);
    osc.frequency.exponentialRampToValueAtTime(42, startTime + 0.11);

    gain.gain.setValueAtTime(0.18, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);

    osc.connect(gain);
    gain.connect(this.masterMusicGain);

    osc.start(startTime);
    osc.stop(startTime + 0.13);
  }

  private playBattleSnare(startTime: number) {
    if (!this.ctx || !this.masterMusicGain) return;
    // Noise snap
    const bufferSize = this.ctx.sampleRate * 0.12;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, startTime);
    filter.Q.setValueAtTime(1.2, startTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.12, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.11);

    // Tone body
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, startTime);
    osc.frequency.exponentialRampToValueAtTime(80, startTime + 0.08);
    oscGain.gain.setValueAtTime(0.09, startTime);
    oscGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterMusicGain);

    osc.connect(oscGain);
    oscGain.connect(this.masterMusicGain);

    noise.start(startTime);
    osc.start(startTime);
    osc.stop(startTime + 0.09);
  }

  private playBattleHiHat(startTime: number, isAccent: boolean) {
    if (!this.ctx || !this.masterMusicGain) return;
    const bufferSize = this.ctx.sampleRate * 0.04;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(7500, startTime);

    const gain = this.ctx.createGain();
    const hatVol = isAccent ? 0.045 : 0.025;
    gain.gain.setValueAtTime(hatVol, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.035);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterMusicGain);

    noise.start(startTime);
  }
}

export const music = new ProceduralMusicEngine();
