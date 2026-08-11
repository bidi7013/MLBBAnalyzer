/**
 * Procedural Web Audio Synthesizer Beat Generator
 * Generates rhythmic drum patterns, sub-bass kicks, and synth arpeggios in real-time
 */

export class ProceduralSynthEngine {
  constructor(audioContext, destinationNode) {
    this.ctx = audioContext;
    this.dest = destinationNode;
    this.isPlaying = false;
    this.timerId = null;
    this.bpm = 124;
    this.step = 0;
    this.trackName = 'Cyber Pulse';
  }

  setBpm(bpm) {
    this.bpm = Math.max(60, Math.min(180, bpm));
  }

  start(preset = 'cyber') {
    if (this.isPlaying) this.stop();
    this.isPlaying = true;
    this.step = 0;

    const lookahead = 25.0; // ms
    const scheduleAheadTime = 0.1; // seconds
    let nextNoteTime = this.ctx.currentTime + 0.05;

    const scheduler = () => {
      while (nextNoteTime < this.ctx.currentTime + scheduleAheadTime && this.isPlaying) {
        this.scheduleStep(this.step, nextNoteTime, preset);
        const secondsPerBeat = 60.0 / this.bpm;
        nextNoteTime += 0.25 * secondsPerBeat; // 16th note steps
        this.step = (this.step + 1) % 16;
      }
      if (this.isPlaying) {
        this.timerId = setTimeout(scheduler, lookahead);
      }
    };

    scheduler();
  }

  stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  scheduleStep(step, time, preset) {
    // Kick on 0, 4, 8, 12 (4-on-the-floor)
    if (step % 4 === 0) {
      this.playKick(time);
    }

    // Snare / Clap on 4 and 12
    if (step === 4 || step === 12) {
      this.playSnare(time);
    }

    // Hi-hats on offbeats (2, 6, 10, 14) + variations
    if (step % 2 === 0) {
      this.playHiHat(time, step % 4 === 2 ? 0.4 : 0.2);
    }

    // Synth bassline / arpeggio
    this.playBassline(step, time, preset);
  }

  playKick(time) {
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.frequency.setValueAtTime(150, time);
      osc.frequency.exponentialRampToValueAtTime(32, time + 0.12);

      gain.gain.setValueAtTime(1.0, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

      osc.connect(gain);
      gain.connect(this.dest);

      osc.start(time);
      osc.stop(time + 0.36);
    } catch (e) {
      // Audio context might be closing
    }
  }

  playSnare(time) {
    try {
      // Noise burst for snare snap
      const bufferSize = this.ctx.sampleRate * 0.12;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1000, time);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.5, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.dest);

      whiteNoise.start(time);
      whiteNoise.stop(time + 0.16);

      // Body tone
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.frequency.setValueAtTime(220, time);
      osc.frequency.exponentialRampToValueAtTime(90, time + 0.08);
      oscGain.gain.setValueAtTime(0.4, time);
      oscGain.gain.exponentialRampToValueAtTime(0.01, time + 0.09);

      osc.connect(oscGain);
      oscGain.connect(this.dest);
      osc.start(time);
      osc.stop(time + 0.1);
    } catch (e) {}
  }

  playHiHat(time, volume = 0.3) {
    try {
      const bufferSize = this.ctx.sampleRate * 0.04;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(8000, time);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(volume, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.dest);

      whiteNoise.start(time);
      whiteNoise.stop(time + 0.05);
    } catch (e) {}
  }

  playBassline(step, time, preset) {
    try {
      // Melodic notes: minor pentatonic / synthwave progression
      const notesCyber = [55, 55, 65.4, 73.4, 55, 82.4, 73.4, 65.4, 49, 49, 55, 65.4, 73.4, 82.4, 98, 110];
      const notesAmbient = [110, 0, 130.8, 0, 146.8, 0, 164.8, 0, 130.8, 0, 110, 0, 98, 0, 82.4, 0];
      const notesEdm = [65.4, 65.4, 65.4, 87.3, 65.4, 65.4, 98, 87.3, 65.4, 65.4, 65.4, 110, 98, 87.3, 73.4, 65.4];

      let noteArray = notesCyber;
      if (preset === 'ambient') noteArray = notesAmbient;
      if (preset === 'edm') noteArray = notesEdm;

      const freq = noteArray[step % noteArray.length];
      if (freq <= 0) return;

      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = preset === 'ambient' ? 'sine' : 'sawtooth';
      osc.frequency.setValueAtTime(freq, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(preset === 'ambient' ? 600 : 1200, time);
      filter.frequency.exponentialRampToValueAtTime(300, time + 0.18);

      gain.gain.setValueAtTime(0.28, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.dest);

      osc.start(time);
      osc.stop(time + 0.24);
    } catch (e) {}
  }
}
