/**
 * Pure Audio Wave Beat Tracker Visualizer Engine
 * 7 Dedicated Audio Wave Layers with Per-Layer Custom Colors
 */
export class WaveformMatrix {
  constructor() {
    this.phase = 0;
    this.beatRipples = [];
  }

  render(ctx, width, height, frameData, settings) {
    const { frequencyData, timeDomainData, beatInfo } = frameData;
    const { layerColors, trailDecay, bassPower } = settings;

    // Centered focal origin
    const cx = width / 2;
    const cy = height / 2;
    this.phase += 0.022;

    // Clear canvas with trail decay
    ctx.fillStyle = `rgba(11, 13, 17, ${1 - trailDecay})`;
    ctx.fillRect(0, 0, width, height);

    // Multi-band acoustic analysis
    const bass = (beatInfo.bands.bass || 0) * bassPower;
    const subBass = (beatInfo.bands.subBass || 0) * bassPower;
    const lowMid = (beatInfo.bands.lowMid || 0) * bassPower;
    const mid = (beatInfo.bands.mid || 0);
    const treble = (beatInfo.bands.treble || 0);
    const pulse = beatInfo.beatPulse || 0;
    const isDrop = beatInfo.isDrop;

    // Layer Colors with fallbacks
    const c1 = layerColors?.layer1 || '#94a3b8'; // Sub-Bass Deep Undercurrent
    const c2 = layerColors?.layer2 || '#cbd5e1'; // Bass Kick Pulse Ribbon
    const c3 = layerColors?.layer3 || '#ffffff'; // Low-Mid Harmonic Wave
    const c4 = layerColors?.layer4 || '#e2e8f0'; // Mid-Range Resonance Wave
    const c5 = layerColors?.layer5 || '#94a3b8'; // Treble & Shimmer Ripple Wave
    const c6 = layerColors?.layer6 || '#ffffff'; // Master Oscilloscope Wave
    const c7 = layerColors?.layer7 || '#64748b'; // Mirrored Harmonic Echo

    // Spawn symmetric ripple waves from center on beat
    if (beatInfo.isBeat) {
      this.beatRipples.push({
        radius: 10,
        maxRadius: width * 0.65,
        alpha: 0.85,
        speed: 12 + bass * 16,
        amplitude: 35 + bass * 55 + (isDrop ? 40 : 0),
        color: c6
      });
    }

    // Side-to-side edge-to-edge span
    const startX = -10;
    const endX = width + 10;
    const totalWidth = endX - startX;
    const numPoints = 280;
    const pointSpacing = totalWidth / numPoints;

    // Refined, balanced amplitude
    const baseAmp = Math.min(height * 0.22, 160);

    // =========================================================================
    // The 5 Continuous Harmonic Ribbon Waves (Layers 1 to 5)
    // =========================================================================
    const waveLayers = [
      // Layer 1: Sub-Bass Deep Undercurrent (20–60Hz sub-frequencies)
      {
        id: 'layer1',
        freqVal: subBass,
        freqMultiplier: 0.8,
        phaseOffset: 0,
        speedMult: 0.7,
        amplitude: baseAmp * (0.6 + subBass * 0.75 + pulse * 0.3),
        color: c1,
        fillAlpha: 0.05,
        strokeAlpha: 0.4,
        lineWidth: 1.1
      },
      // Layer 2: Bass Kick Pulse Ribbon (high-amplitude wave surging on kicks)
      {
        id: 'layer2',
        freqVal: bass,
        freqMultiplier: 1.4,
        phaseOffset: Math.PI * 0.25,
        speedMult: 1.0,
        amplitude: baseAmp * (0.75 + bass * 0.9 + pulse * 0.45),
        color: c2,
        fillAlpha: 0.07,
        strokeAlpha: 0.6,
        lineWidth: 1.6
      },
      // Layer 3: Low-Mid Harmonic Wave (flowing harmonic phase modulation)
      {
        id: 'layer3',
        freqVal: lowMid,
        freqMultiplier: 2.2,
        phaseOffset: Math.PI * 0.55,
        speedMult: 1.3,
        amplitude: baseAmp * (0.6 + lowMid * 0.7 + pulse * 0.3),
        color: c3,
        fillAlpha: 0.04,
        strokeAlpha: 0.55,
        lineWidth: 1.2
      },
      // Layer 4: Mid-Range Resonance Wave (melodic and vocal tracking)
      {
        id: 'layer4',
        freqVal: mid,
        freqMultiplier: 3.8,
        phaseOffset: Math.PI * 0.9,
        speedMult: 1.8,
        amplitude: baseAmp * (0.45 + mid * 0.55 + pulse * 0.22),
        color: c4,
        fillAlpha: 0.03,
        strokeAlpha: 0.65,
        lineWidth: 1.2
      },
      // Layer 5: Treble & Shimmer Ripple Wave (hi-hats and percussion transients)
      {
        id: 'layer5',
        freqVal: treble,
        freqMultiplier: 6.8,
        phaseOffset: Math.PI * 1.3,
        speedMult: 2.6,
        amplitude: baseAmp * (0.25 + treble * 0.4 + pulse * 0.12),
        color: c5,
        fillAlpha: 0.02,
        strokeAlpha: 0.75,
        lineWidth: 0.9
      }
    ];

    // Render Layers 1 - 5
    waveLayers.forEach((layer) => {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(startX, cy);

      const wavePoints = [];
      for (let i = 0; i <= numPoints; i++) {
        const x = startX + i * pointSpacing;
        const progress = i / numPoints; // 0 to 1
        const centered = progress - 0.5; // -0.5 to 0.5

        // Frequency mapping symmetric from center
        const binIdx = Math.floor(Math.abs(centered) * 2 * (frequencyData.length * 0.5));
        const binFreq = (frequencyData[binIdx] || 0) / 255;

        // Harmonic traveling wave equation
        const angle = centered * Math.PI * 2 * layer.freqMultiplier - (this.phase * layer.speedMult) + layer.phaseOffset;
        const harmonic1 = Math.sin(angle);
        const harmonic2 = Math.cos(angle * 1.3 - this.phase * 0.3);

        const yOffset = (
          harmonic1 * (layer.amplitude * 0.7) +
          harmonic2 * (layer.amplitude * 0.3) +
          binFreq * (35 * bassPower) +
          pulse * 22
        );

        const y = cy + yOffset;
        wavePoints.push({ x, y });

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          const prev = wavePoints[i - 1];
          const midX = (prev.x + x) / 2;
          const midY = (prev.y + y) / 2;
          ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
        }
      }

      // Close path to baseline for translucent depth fill
      ctx.lineTo(endX, cy);
      ctx.lineTo(startX, cy);
      ctx.closePath();

      ctx.fillStyle = layer.color;
      ctx.globalAlpha = layer.fillAlpha;
      ctx.fill();

      // Stroke line
      ctx.strokeStyle = layer.color;
      ctx.globalAlpha = layer.strokeAlpha;
      ctx.lineWidth = layer.lineWidth;
      ctx.stroke();

      ctx.restore();
    });

    // =========================================================================
    // Layer 6: Master Oscilloscope Time-Domain Wave (crisp 2.2px primary waveform)
    // =========================================================================
    const sampleStep = Math.max(1, Math.floor(timeDomainData.length / numPoints));
    
    ctx.save();
    ctx.beginPath();
    for (let i = 0; i <= numPoints; i++) {
      const dataIdx = Math.min(timeDomainData.length - 1, i * sampleStep);
      const normVal = (timeDomainData[dataIdx] - 128) / 128;
      
      const x = startX + i * pointSpacing;
      const waveHeight = normVal * (baseAmp * 1.15 * bassPower + pulse * 60);
      const y = cy + waveHeight;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.strokeStyle = c6;
    ctx.lineWidth = 2.2;
    ctx.globalAlpha = 0.95;
    ctx.stroke();
    ctx.restore();

    // =========================================================================
    // Layer 7: Mirrored Harmonic Inverted Echo (bottom reflection wave)
    // =========================================================================
    ctx.save();
    ctx.beginPath();
    for (let i = 0; i <= numPoints; i++) {
      const dataIdx = Math.min(timeDomainData.length - 1, i * sampleStep);
      const normVal = (timeDomainData[dataIdx] - 128) / 128;
      
      const x = startX + i * pointSpacing;
      const waveHeight = -normVal * (baseAmp * 0.65 * bassPower + pulse * 35);
      const y = cy + waveHeight;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.strokeStyle = c7;
    ctx.lineWidth = 1.2;
    ctx.globalAlpha = 0.55;
    ctx.stroke();
    ctx.restore();

    // =========================================================================
    // Transient Center Beat Ripples
    // =========================================================================
    for (let r = this.beatRipples.length - 1; r >= 0; r--) {
      const rip = this.beatRipples[r];
      rip.radius += rip.speed;
      rip.alpha -= 0.018;

      if (rip.alpha <= 0 || rip.radius >= rip.maxRadius) {
        this.beatRipples.splice(r, 1);
        continue;
      }

      ctx.save();
      const leftX = cx - rip.radius;
      const rightX = cx + rip.radius;
      const rippleHeight = rip.amplitude * rip.alpha;

      // Left Ripple Crest
      if (leftX >= -20) {
        ctx.beginPath();
        ctx.ellipse(leftX, cy, 14, rippleHeight, 0, 0, Math.PI * 2);
        ctx.strokeStyle = rip.color || c6;
        ctx.globalAlpha = rip.alpha * 0.7;
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }

      // Right Ripple Crest
      if (rightX <= width + 20) {
        ctx.beginPath();
        ctx.ellipse(rightX, cy, 14, rippleHeight, 0, 0, Math.PI * 2);
        ctx.strokeStyle = rip.color || c6;
        ctx.globalAlpha = rip.alpha * 0.7;
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }

      ctx.restore();
    }

    // =========================================================================
    // Center Audio Baseline & Focal Center Beat Node
    // =========================================================================
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(width, cy);
    ctx.strokeStyle = c1;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.2;
    ctx.stroke();

    // Center Origin Focal Beat Node
    const nodeSize = 5 + bass * 8 + pulse * 8;
    ctx.beginPath();
    ctx.arc(cx, cy, nodeSize, 0, Math.PI * 2);
    ctx.fillStyle = c6;
    ctx.globalAlpha = 0.95;
    ctx.fill();

    // Concentric beat ring on center node
    if (pulse > 0.12) {
      ctx.beginPath();
      ctx.arc(cx, cy, nodeSize * (1.8 + pulse * 1.3), 0, Math.PI * 2);
      ctx.strokeStyle = c2;
      ctx.globalAlpha = pulse * 0.85;
      ctx.lineWidth = 1.4;
      ctx.stroke();
    }

    // Center vertical harmonic indicator
    ctx.beginPath();
    ctx.moveTo(cx, cy - 25 - pulse * 15);
    ctx.lineTo(cx, cy + 25 + pulse * 15);
    ctx.strokeStyle = c3;
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
  }
}
