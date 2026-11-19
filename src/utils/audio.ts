/**
 * Web Audio API synthesizer for rich sound effects without external asset dependencies.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;

  constructor() {
    // AudioContext will be initialized on first user interaction to comply with browser autoplay policies
  }

  private initContext() {
    try {
      if (!this.ctx && typeof window !== 'undefined') {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
          this.masterGain = this.ctx.createGain();
          this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.25, this.ctx.currentTime);
          this.masterGain.connect(this.ctx.destination);
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    } catch {
      // Ignore Web Audio restriction errors
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.25, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public setMuted(muted: boolean): boolean {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.25, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Sound when shooting basic projectiles
   */
  public playShoot(
    type:
      | 'laser'
      | 'bullet'
      | 'fireball'
      | 'ice'
      | 'beam'
      | 'coin'
      | 'resonance'
      | 'stun'
      | 'multishot'
      | 'shockwave'
      | 'slash'
      | 'arrow'
      | 'lightning'
      | 'spore'
      | 'missile'
      | 'portal'
  ) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.masterGain);

    if (type === 'laser') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(850, t);
      osc.frequency.exponentialRampToValueAtTime(150, t + 0.12);
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
      osc.start(t);
      osc.stop(t + 0.12);
    } else if (type === 'fireball') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, t);
      osc.frequency.exponentialRampToValueAtTime(60, t + 0.2);
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
      osc.start(t);
      osc.stop(t + 0.2);
    } else if (type === 'ice') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, t);
      osc.frequency.exponentialRampToValueAtTime(600, t + 0.15);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
      osc.start(t);
      osc.stop(t + 0.15);
    } else if (type === 'slash') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600, t);
      osc.frequency.exponentialRampToValueAtTime(180, t + 0.08);
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
      osc.start(t);
      osc.stop(t + 0.08);
    } else if (type === 'arrow') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, t);
      osc.frequency.exponentialRampToValueAtTime(320, t + 0.09);
      gain.gain.setValueAtTime(0.14, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.09);
      osc.start(t);
      osc.stop(t + 0.09);
    } else if (type === 'lightning') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1100, t);
      osc.frequency.linearRampToValueAtTime(220, t + 0.14);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.14);
      osc.start(t);
      osc.stop(t + 0.14);
    } else if (type === 'stun' || type === 'shockwave') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, t);
      osc.frequency.exponentialRampToValueAtTime(45, t + 0.22);
      gain.gain.setValueAtTime(0.24, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.22);
      osc.start(t);
      osc.stop(t + 0.22);
    } else if (type === 'multishot' || type === 'missile') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(420, t);
      osc.frequency.exponentialRampToValueAtTime(90, t + 0.12);
      gain.gain.setValueAtTime(0.16, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
      osc.start(t);
      osc.stop(t + 0.12);
    } else if (type === 'portal') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, t);
      osc.frequency.linearRampToValueAtTime(740, t + 0.18);
      gain.gain.setValueAtTime(0.22, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);
      osc.start(t);
      osc.stop(t + 0.18);
    } else if (type === 'spore') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, t);
      osc.frequency.exponentialRampToValueAtTime(280, t + 0.16);
      gain.gain.setValueAtTime(0.14, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.16);
      osc.start(t);
      osc.stop(t + 0.16);
    } else if (type === 'coin') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, t); // B5
      osc.frequency.setValueAtTime(1318.51, t + 0.06); // E6
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);
      osc.start(t);
      osc.stop(t + 0.18);
    } else if (type === 'resonance') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.exponentialRampToValueAtTime(554.37, t + 0.1);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
      osc.start(t);
      osc.stop(t + 0.2);
    } else {
      // standard bullet/beam
      osc.type = 'square';
      osc.frequency.setValueAtTime(480, t);
      osc.frequency.exponentialRampToValueAtTime(120, t + 0.08);
      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
      osc.start(t);
      osc.stop(t + 0.08);
    }
  }

  /**
   * Sound when enemy gets hit / explodes
   */
  public playHit(isSplash: boolean = false) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.masterGain);

    if (isSplash) {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, t);
      osc.frequency.exponentialRampToValueAtTime(40, t + 0.25);
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
      osc.start(t);
      osc.stop(t + 0.25);
    } else {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, t);
      osc.frequency.exponentialRampToValueAtTime(90, t + 0.06);
      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.06);
      osc.start(t);
      osc.stop(t + 0.06);
    }
  }

  /**
   * Sound for placing or upgrading a unit
   */
  public playPlace() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(330, t);
    osc.frequency.exponentialRampToValueAtTime(660, t + 0.12);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.14);
    osc.start(t);
    osc.stop(t + 0.14);
  }

  public playUpgrade() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const notes = [440, 554, 659, 880];
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.masterGain);

      const noteT = t + idx * 0.06;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteT);
      gain.gain.setValueAtTime(0.15, noteT);
      gain.gain.exponentialRampToValueAtTime(0.01, noteT + 0.12);
      osc.start(noteT);
      osc.stop(noteT + 0.12);
    });
  }

  /**
   * Powerful Showdown activation effect
   */
  public playShowdown() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    // Layer 1: Bass boom
    const oscBass = this.ctx.createOscillator();
    const gainBass = this.ctx.createGain();
    oscBass.connect(gainBass);
    gainBass.connect(this.masterGain);

    oscBass.type = 'sawtooth';
    oscBass.frequency.setValueAtTime(120, t);
    oscBass.frequency.exponentialRampToValueAtTime(30, t + 0.6);
    gainBass.gain.setValueAtTime(0.4, t);
    gainBass.gain.exponentialRampToValueAtTime(0.01, t + 0.6);
    oscBass.start(t);
    oscBass.stop(t + 0.6);

    // Layer 2: Ascending energy chord
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.masterGain);

      const noteT = t + i * 0.07;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteT);
      gain.gain.setValueAtTime(0.2, noteT);
      gain.gain.exponentialRampToValueAtTime(0.01, noteT + 0.4);
      osc.start(noteT);
      osc.stop(noteT + 0.4);
    });
  }

  /**
   * Sound when core base takes damage
   */
  public playBaseHit() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.setValueAtTime(100, t + 0.1);
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.28);
    osc.start(t);
    osc.stop(t + 0.28);
  }

  /**
   * Sound on round victory
   */
  public playWaveClear() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C, E, G, C
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.masterGain);

      const noteT = t + idx * 0.1;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteT);
      gain.gain.setValueAtTime(0.25, noteT);
      gain.gain.exponentialRampToValueAtTime(0.01, noteT + 0.3);
      osc.start(noteT);
      osc.stop(noteT + 0.3);
    });
  }

  public playCoin() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, t);
    osc.frequency.setValueAtTime(1318.51, t + 0.05);
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);
    osc.start(t);
    osc.stop(t + 0.18);
  }

  public playWaveStart() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(330, t);
    osc.frequency.exponentialRampToValueAtTime(587.33, t + 0.25);
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);
    osc.start(t);
    osc.stop(t + 0.35);
  }

  public playSell() {
    this.playCoin();
  }

  public playVictory() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const fanfareNotes = [440, 554.37, 659.25, 880, 1108.73];
    fanfareNotes.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.masterGain);

      const noteT = t + idx * 0.12;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteT);
      gain.gain.setValueAtTime(0.28, noteT);
      gain.gain.exponentialRampToValueAtTime(0.01, noteT + 0.4);
      osc.start(noteT);
      osc.stop(noteT + 0.4);
    });
  }

  public playLockRattle() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    [0, 0.08, 0.16].forEach((offset, i) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.type = 'square';
      osc.frequency.setValueAtTime(210 + i * 45, t + offset);
      osc.frequency.exponentialRampToValueAtTime(110, t + offset + 0.06);
      gain.gain.setValueAtTime(0.14, t + offset);
      gain.gain.exponentialRampToValueAtTime(0.01, t + offset + 0.06);
      osc.start(t + offset);
      osc.stop(t + offset + 0.06);
    });
  }

  public playLockBreak() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    // Metallic snap + triumphant unlock shimmer
    const snap = this.ctx.createOscillator();
    const snapGain = this.ctx.createGain();
    snap.connect(snapGain);
    snapGain.connect(this.masterGain);
    snap.type = 'sawtooth';
    snap.frequency.setValueAtTime(420, t);
    snap.frequency.exponentialRampToValueAtTime(65, t + 0.25);
    snapGain.gain.setValueAtTime(0.32, t);
    snapGain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
    snap.start(t);
    snap.stop(t + 0.25);

    [587.33, 783.99, 1046.5, 1318.51].forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.masterGain);

      const noteT = t + 0.06 + idx * 0.07;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteT);
      gain.gain.setValueAtTime(0.22, noteT);
      gain.gain.exponentialRampToValueAtTime(0.01, noteT + 0.35);
      osc.start(noteT);
      osc.stop(noteT + 0.35);
    });
  }

  public playGiftReveal() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5, 1567.98];
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.masterGain);

      const noteT = t + idx * 0.08;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteT);
      gain.gain.setValueAtTime(0.24, noteT);
      gain.gain.exponentialRampToValueAtTime(0.01, noteT + 0.42);
      osc.start(noteT);
      osc.stop(noteT + 0.42);
    });
  }

  public playHammerSmash() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(38, t + 0.28);
    gain.gain.setValueAtTime(0.36, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
    osc.start(t);
    osc.stop(t + 0.3);

    const crack = this.ctx.createOscillator();
    const crackGain = this.ctx.createGain();
    crack.connect(crackGain);
    crackGain.connect(this.masterGain);
    crack.type = 'square';
    crack.frequency.setValueAtTime(320, t + 0.04);
    crack.frequency.exponentialRampToValueAtTime(95, t + 0.16);
    crackGain.gain.setValueAtTime(0.16, t + 0.04);
    crackGain.gain.exponentialRampToValueAtTime(0.01, t + 0.16);
    crack.start(t + 0.04);
    crack.stop(t + 0.16);
  }

  public playShovelDig() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const scoop = this.ctx.createOscillator();
    const scoopGain = this.ctx.createGain();
    scoop.connect(scoopGain);
    scoopGain.connect(this.masterGain);
    scoop.type = 'triangle';
    scoop.frequency.setValueAtTime(240, t);
    scoop.frequency.exponentialRampToValueAtTime(420, t + 0.1);
    scoopGain.gain.setValueAtTime(0.2, t);
    scoopGain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
    scoop.start(t);
    scoop.stop(t + 0.12);

    this.playCoin();
  }
}

export const sounds = new SoundEngine();
