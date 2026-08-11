/**
 * Advanced Spectral Flux & Multi-Band Beat Detection Engine
 */
export class BeatDetector {
  constructor() {
    this.historyBuffer = [];
    this.historySize = 45;
    this.minBeatInterval = 180; // ms (limits to ~333 max BPM)
    this.lastBeatTime = 0;
    this.beatPulse = 0;
    this.decayRate = 0.92;
    
    // BPM Calculation
    this.beatIntervals = [];
    this.maxIntervals = 8;
    this.estimatedBPM = 120;
    this.bpmConfidence = 0.5;

    // Multi-band energy values
    this.bands = {
      subBass: 0,
      bass: 0,
      lowMid: 0,
      mid: 0,
      highMid: 0,
      treble: 0
    };

    // Overall energy and peak drop detection
    this.instantEnergy = 0;
    this.averageEnergy = 0;
    this.isBeat = false;
    this.isDrop = false;
    this.dropIntensity = 0;
  }

  /**
   * Process a single audio frame
   * @param {Uint8Array} frequencyData - raw FFT data from AnalyserNode
   * @param {number} sampleRate - audio context sample rate (e.g. 44100)
   * @param {number} sensitivity - user adjustable sensitivity (0.5 to 2.0)
   * @param {number} bassBoost - user adjustable bass power (0.5 to 3.0)
   */
  update(frequencyData, sampleRate = 44100, sensitivity = 1.15, bassBoost = 1.0) {
    const binCount = frequencyData.length;
    if (binCount === 0) return this.getOutput();

    const nyquist = sampleRate / 2;
    const binHz = nyquist / binCount;

    // Helper to calculate average energy across a frequency range in Hz
    const getBandEnergy = (minHz, maxHz) => {
      const minBin = Math.max(0, Math.floor(minHz / binHz));
      const maxBin = Math.min(binCount - 1, Math.floor(maxHz / binHz));
      if (maxBin <= minBin) return frequencyData[minBin] / 255;

      let sum = 0;
      for (let i = minBin; i <= maxBin; i++) {
        sum += frequencyData[i];
      }
      return (sum / (maxBin - minBin + 1)) / 255;
    };

    // Multi-band breakdown
    this.bands.subBass = getBandEnergy(20, 60) * bassBoost;
    this.bands.bass = getBandEnergy(60, 250) * bassBoost;
    this.bands.lowMid = getBandEnergy(250, 500);
    this.bands.mid = getBandEnergy(500, 2000);
    this.bands.highMid = getBandEnergy(2000, 6000);
    this.bands.treble = getBandEnergy(6000, 16000);

    // Weighted instant energy: Bass and Sub-bass have highest weight for beat tracking
    this.instantEnergy = (
      this.bands.subBass * 0.35 +
      this.bands.bass * 0.40 +
      this.bands.lowMid * 0.15 +
      this.bands.mid * 0.10
    );

    // Add to sliding history buffer
    this.historyBuffer.push(this.instantEnergy);
    if (this.historyBuffer.length > this.historySize) {
      this.historyBuffer.shift();
    }

    // Compute moving average and variance
    const sum = this.historyBuffer.reduce((a, b) => a + b, 0);
    this.averageEnergy = sum / this.historyBuffer.length;

    let varianceSum = 0;
    for (let i = 0; i < this.historyBuffer.length; i++) {
      varianceSum += Math.pow(this.historyBuffer[i] - this.averageEnergy, 2);
    }
    const variance = varianceSum / this.historyBuffer.length;
    const stdDev = Math.sqrt(variance);

    // Dynamic threshold: base multiplier adjusted by variance and user sensitivity
    const dynamicMultiplier = Math.max(1.1, 1.4 - stdDev * 1.5) / sensitivity;
    const threshold = this.averageEnergy * dynamicMultiplier;

    const now = performance.now();
    const timeSinceLast = now - this.lastBeatTime;

    this.isBeat = false;
    this.isDrop = false;

    // Check if instant energy exceeds dynamic threshold with cooldown
    if (this.instantEnergy > threshold && this.instantEnergy > 0.12 && timeSinceLast > this.minBeatInterval) {
      this.isBeat = true;
      this.beatPulse = 1.0;

      // Check for heavy drop (high bass + significant variance jump)
      if (this.bands.bass > 0.65 && this.instantEnergy > this.averageEnergy * 1.6) {
        this.isDrop = true;
        this.dropIntensity = Math.min(1.0, (this.bands.bass + this.instantEnergy) * 0.6);
      }

      // Track interval for live BPM estimation
      if (timeSinceLast < 2000 && timeSinceLast > 250) {
        this.beatIntervals.push(timeSinceLast);
        if (this.beatIntervals.length > this.maxIntervals) {
          this.beatIntervals.shift();
        }

        // Compute median interval for stable BPM
        const sorted = [...this.beatIntervals].sort((a, b) => a - b);
        const medianInterval = sorted[Math.floor(sorted.length / 2)];
        if (medianInterval > 0) {
          let calculatedBpm = Math.round(60000 / medianInterval);
          // Normalize to reasonable 70-175 range (half or double time if needed)
          while (calculatedBpm > 180) calculatedBpm /= 2;
          while (calculatedBpm < 70) calculatedBpm *= 2;
          this.estimatedBPM = Math.round(this.estimatedBPM * 0.7 + calculatedBpm * 0.3);
        }
      }

      this.lastBeatTime = now;
    } else {
      // Smooth decay
      this.beatPulse *= this.decayRate;
      this.dropIntensity *= 0.88;
    }

    return this.getOutput();
  }

  getOutput() {
    return {
      isBeat: this.isBeat,
      isDrop: this.isDrop,
      beatPulse: this.beatPulse,
      dropIntensity: this.dropIntensity,
      bpm: this.estimatedBPM,
      instantEnergy: this.instantEnergy,
      averageEnergy: this.averageEnergy,
      bands: { ...this.bands }
    };
  }

  reset() {
    this.historyBuffer = [];
    this.beatIntervals = [];
    this.lastBeatTime = 0;
    this.beatPulse = 0;
    this.estimatedBPM = 120;
  }
}
