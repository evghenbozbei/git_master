// Web Audio API lightweight sound synthesizer
// No external MP3/WAV assets needed, zero latency, works seamlessly on web and mobile.

class SoundFXEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('gitmaster_sound_muted');
      if (stored !== null) {
        this.isMuted = stored === 'true';
      }
    }
  }

  private initCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('gitmaster_sound_muted', String(this.isMuted));
    }
    if (!this.isMuted) {
      this.playTap();
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Unified helper to synthesize a tone with exponential decay and automatic node cleanup.
   */
  private playTone(options: {
    freq: number;
    duration: number;
    type?: OscillatorType;
    gainVal?: number;
    freqEnd?: number;
    delay?: number;
  }) {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const {
        freq,
        duration,
        type = 'sine',
        gainVal = 0.08,
        freqEnd,
        delay = 0
      } = options;

      const now = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      if (freqEnd !== undefined) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(1, freqEnd), now + duration);
      }

      gain.gain.setValueAtTime(gainVal, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      // Clean up Web Audio graph on completion to prevent memory leaks on mobile WebViews
      osc.onended = () => {
        try {
          osc.disconnect();
          gain.disconnect();
        } catch {
          // ignore
        }
      };

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // AudioContext might be blocked until user interaction
    }
  }

  /**
   * Subtle, crisp UI tap / click
   */
  public playTap() {
    this.playTone({
      freq: 800,
      freqEnd: 400,
      duration: 0.04,
      gainVal: 0.06,
      type: 'sine'
    });
  }

  /**
   * Navigation / Tab switch sound
   */
  public playNavClick() {
    this.playTone({
      freq: 520,
      freqEnd: 680,
      duration: 0.05,
      gainVal: 0.05,
      type: 'triangle'
    });
  }

  /**
   * Correct Answer / Puzzle Solved / Quick Success
   */
  public playCorrect() {
    this.playTone({ freq: 659.25, duration: 0.12, gainVal: 0.08, delay: 0 });
    this.playTone({ freq: 880, duration: 0.20, gainVal: 0.09, delay: 0.08 });
  }

  /**
   * Mistake / Wrong answer (gentle low buzz, not harsh)
   */
  public playMistake() {
    this.playTone({
      freq: 220,
      freqEnd: 140,
      duration: 0.18,
      gainVal: 0.07,
      type: 'sawtooth'
    });
  }

  /**
   * XP Gain / Star Sparkle
   */
  public playXpGain() {
    const notes = [587.33, 739.99, 880, 1174.66]; // D5, F#5, A5, D6
    notes.forEach((freq, idx) => {
      this.playTone({
        freq,
        duration: 0.15,
        gainVal: 0.06,
        delay: idx * 0.04,
        type: 'sine'
      });
    });
  }

  /**
   * Full Lesson Complete / Level Up Celebration Fanfare
   */
  public playLessonComplete() {
    // Cheerful C Major Arpeggio: C5 -> E5 -> G5 -> C6
    const arpeggio = [523.25, 659.25, 783.99, 1046.5];
    arpeggio.forEach((freq, idx) => {
      const isLast = idx === arpeggio.length - 1;
      this.playTone({
        freq,
        duration: isLast ? 0.45 : 0.2,
        gainVal: 0.1,
        delay: idx * 0.08,
        type: isLast ? 'triangle' : 'sine'
      });
    });
  }
}

export const soundFX = new SoundFXEngine();

