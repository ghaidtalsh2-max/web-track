// =============================================================================
// GDG on Campus — Taif University (Web Track Platform 2026)
// Web Audio API Sound Engine (Zero external assets, 100% synthesized)
// =============================================================================

class SoundEngine {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public resume() {
    try {
      const ctx = this.getContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
    } catch {
      // ignore
    }
  }

  /**
   * نغمة ترحيبية ناعمة (< 1.2 ثانية) بأربع نغمات صاعدة
   */
  public playWelcomeChime(volume = 0.4) {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      this.resume();

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(Math.min(Math.max(volume, 0.05), 1), ctx.currentTime);
      masterGain.connect(ctx.destination);

      // نغمات ترحيبية صاعدة ومريحة: G4 (392Hz), C5 (523Hz), E5 (659Hz), G5 (784Hz)
      const notes = [
        { freq: 392.0, start: 0.0, dur: 0.28 },
        { freq: 523.25, start: 0.12, dur: 0.32 },
        { freq: 659.25, start: 0.26, dur: 0.36 },
        { freq: 783.99, start: 0.42, dur: 0.65 },
      ];

      notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.freq, ctx.currentTime + n.start);

        const startTime = ctx.currentTime + n.start;
        const endTime = startTime + n.dur;

        noteGain.gain.setValueAtTime(0.0001, startTime);
        noteGain.gain.exponentialRampToValueAtTime(0.25, startTime + 0.04);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, endTime);

        osc.connect(noteGain);
        noteGain.connect(masterGain);

        osc.start(startTime);
        osc.stop(endTime);
      });
    } catch (e) {
      console.warn('Audio playback not permitted or supported:', e);
    }
  }

  /**
   * صوت pop مرح لفرقعة القصاصات (< 0.15 ثانية)
   */
  public playPopSound(volume = 0.4) {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      this.resume();

      const startTime = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      // انخفاض ترددي سريع يعطي صوت "بوب" واقعي
      osc.frequency.setValueAtTime(750, startTime);
      osc.frequency.exponentialRampToValueAtTime(110, startTime + 0.09);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(Math.min(volume * 0.7, 0.5), startTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.11);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.12);
    } catch (e) {
      console.warn('Pop sound error:', e);
    }
  }
}

export const soundEngine = new SoundEngine();
