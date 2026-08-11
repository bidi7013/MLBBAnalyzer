import React from 'react';
import { Activity, Radio } from 'lucide-react';

export const LiveHud = ({ beatInfo, activeModeName }) => {
  const bands = beatInfo?.bands || {
    subBass: 0,
    bass: 0,
    lowMid: 0,
    mid: 0,
    highMid: 0,
    treble: 0
  };

  const isBeat = beatInfo?.isBeat || false;
  const isDrop = beatInfo?.isDrop || false;
  const bpm = beatInfo?.bpm || 120;
  const pulse = beatInfo?.beatPulse || 0;

  const bandList = [
    { label: 'SUB', val: bands.subBass },
    { label: 'BAS', val: bands.bass },
    { label: 'LMI', val: bands.lowMid },
    { label: 'MID', val: bands.mid },
    { label: 'HMI', val: bands.highMid },
    { label: 'TRB', val: bands.treble }
  ];

  return (
    <div className="live-hud-glass">
      {/* Top Info Header */}
      <div className="hud-header">
        <div className="hud-title-wrap">
          <Activity size={14} />
          <span className="hud-title">ACOUSTIC TELEMETRY</span>
        </div>
        <div className={`beat-indicator-dot ${isBeat ? 'active' : ''}`} />
      </div>

      {/* BPM & Engine Metrics */}
      <div className="hud-metric-row">
        <div className="metric-box">
          <span className="metric-label">EST. BPM</span>
          <span className="metric-value">{bpm}</span>
        </div>

        <div className="metric-box">
          <span className="metric-label">ENERGY</span>
          <span className="metric-value">{(beatInfo?.instantEnergy * 100 || 0).toFixed(0)}%</span>
        </div>

        <div className="metric-box">
          <span className="metric-label">DROP STATE</span>
          <span className={`metric-value ${isDrop ? 'drop-active' : ''}`}>
            {isDrop ? 'DROP PEAK' : 'NORMAL'}
          </span>
        </div>
      </div>

      {/* 6-Band Frequency Spectrum Mini Bars */}
      <div className="hud-bands-container">
        {bandList.map((band) => {
          const clamped = Math.min(100, Math.max(4, Math.round(band.val * 100)));
          return (
            <div key={band.label} className="hud-band-column">
              <div className="hud-band-track">
                <div 
                  className="hud-band-fill" 
                  style={{ height: `${clamped}%` }} 
                />
              </div>
              <span className="hud-band-name">{band.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
