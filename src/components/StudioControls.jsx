import React from 'react';
import { 
  Sliders, 
  Palette, 
  BarChart3, 
  ChevronLeft, 
  RotateCcw,
  Check
} from 'lucide-react';

// The 8 Curated Colors (4 Neon + 4 Normal)
export const EIGHT_CURATED_COLORS = [
  // 4 Neon Colours
  { id: 'neon-cyan', name: 'Neon Cyan', hex: '#00F0FF', group: 'neon', symbol: '⚡' },
  { id: 'neon-pink', name: 'Neon Pink', hex: '#FF007F', group: 'neon', symbol: '⚡' },
  { id: 'neon-lime', name: 'Neon Lime', hex: '#39FF14', group: 'neon', symbol: '⚡' },
  { id: 'neon-amber', name: 'Neon Amber', hex: '#FFE600', group: 'neon', symbol: '⚡' },
  // 4 Normal Colours
  { id: 'norm-white', name: 'Quartz White', hex: '#FFFFFF', group: 'normal', symbol: '⚪' },
  { id: 'norm-slate', name: 'Slate Gray', hex: '#94A3B8', group: 'normal', symbol: '⚪' },
  { id: 'norm-amber', name: 'Warm Amber', hex: '#F59E0B', group: 'normal', symbol: '⚪' },
  { id: 'norm-blue', name: 'Cobalt Blue', hex: '#3B82F6', group: 'normal', symbol: '⚪' }
];

export const WAVE_LAYERS = [
  { 
    id: 'layer1', 
    name: 'Layer 1: Sub-Bass Deep Undercurrent', 
    desc: '20–60Hz sub-frequencies', 
    defaultColor: '#94A3B8' 
  },
  { 
    id: 'layer2', 
    name: 'Layer 2: Bass Kick Pulse Ribbon', 
    desc: 'Surging on kicks & drops', 
    defaultColor: '#00F0FF' 
  },
  { 
    id: 'layer3', 
    name: 'Layer 3: Low-Mid Harmonic Wave', 
    desc: 'Harmonic phase modulation', 
    defaultColor: '#39FF14' 
  },
  { 
    id: 'layer4', 
    name: 'Layer 4: Mid-Range Resonance Wave', 
    desc: 'Melodic and vocal tracking', 
    defaultColor: '#FFE600' 
  },
  { 
    id: 'layer5', 
    name: 'Layer 5: Treble & Shimmer Ripple Wave', 
    desc: 'Hi-hats & percussion transients', 
    defaultColor: '#FF007F' 
  },
  { 
    id: 'layer6', 
    name: 'Layer 6: Master Oscilloscope Wave', 
    desc: 'Crisp 2.2px primary waveform', 
    defaultColor: '#FFFFFF' 
  },
  { 
    id: 'layer7', 
    name: 'Layer 7: Mirrored Harmonic Echo', 
    desc: 'Bottom reflection wave', 
    defaultColor: '#3B82F6' 
  }
];

export const DEFAULT_LAYER_COLORS = WAVE_LAYERS.reduce((acc, layer) => {
  acc[layer.id] = layer.defaultColor;
  return acc;
}, {});

export const StudioControls = ({
  isOpen,
  onToggleOpen,
  layerColors = DEFAULT_LAYER_COLORS,
  onUpdateLayerColor,
  onResetLayerColors,
  settings,
  onUpdateSettings
}) => {
  const neonColors = EIGHT_CURATED_COLORS.filter(c => c.group === 'neon');
  const normalColors = EIGHT_CURATED_COLORS.filter(c => c.group === 'normal');

  return (
    <div className={`studio-sidebar-glass ${isOpen ? 'open' : 'collapsed'}`}>
      {/* Toggle Tab Button */}
      <button 
        className="glass-collapse-btn" 
        onClick={onToggleOpen}
        aria-label={isOpen ? 'Collapse Controls' : 'Expand Controls'}
        title="Toggle Studio Controls Panel"
      >
        {isOpen ? <ChevronLeft size={16} /> : <Sliders size={16} />}
      </button>

      {isOpen && (
        <div className="studio-panel-content">
          <div className="panel-header">
            <span className="panel-title">STUDIO PARAMETERS</span>
          </div>

          {/* 1. Visualizer Engine Badge */}
          <div className="control-section">
            <div className="section-title">
              <BarChart3 size={13} />
              <span>ACTIVE ENGINE</span>
            </div>
            <div className="glass-mode-card active" style={{ cursor: 'default' }}>
              <BarChart3 size={18} />
              <span>Waveform Matrix</span>
            </div>
          </div>

          {/* 2. Per-Layer Wave 8-Color Chooser */}
          <div className="control-section">
            <div className="section-header-row">
              <div className="section-title">
                <Palette size={13} />
                <span>LAYER WAVE COLORS</span>
              </div>
              <button 
                className="glass-reset-btn"
                onClick={onResetLayerColors}
                title="Reset all layers to default colors"
              >
                <RotateCcw size={11} />
                <span>Reset</span>
              </button>
            </div>

            {/* 8 Color Guide Reference */}
            <div className="curated-legend-box">
              <div className="legend-group">
                <span className="legend-tag">4 NEON</span>
                <div className="legend-swatches">
                  {neonColors.map(c => (
                    <div key={c.id} className="legend-pip" style={{ backgroundColor: c.hex }} title={c.name} />
                  ))}
                </div>
              </div>
              <div className="legend-group">
                <span className="legend-tag">4 NORMAL</span>
                <div className="legend-swatches">
                  {normalColors.map(c => (
                    <div key={c.id} className="legend-pip" style={{ backgroundColor: c.hex }} title={c.name} />
                  ))}
                </div>
              </div>
            </div>

            {/* 7 Layer Rows */}
            <div className="layer-color-list">
              {WAVE_LAYERS.map((layer) => {
                const currentColor = (layerColors[layer.id] || layer.defaultColor).toUpperCase();
                const matchedColor = EIGHT_CURATED_COLORS.find(
                  c => c.hex.toUpperCase() === currentColor
                ) || EIGHT_CURATED_COLORS[0];

                return (
                  <div key={layer.id} className="glass-layer-card">
                    {/* Layer Title & Active Color Name */}
                    <div className="layer-card-top">
                      <div className="layer-text-wrap">
                        <span className="layer-name">{layer.name}</span>
                        <span className="layer-desc">{layer.desc}</span>
                      </div>
                      <span className="active-color-name" style={{ color: matchedColor.hex }}>
                        {matchedColor.name}
                      </span>
                    </div>

                    {/* 8 Color Selection Swatches (4 Neon | 4 Normal) */}
                    <div className="curated-swatch-row">
                      {/* 4 Neon Swatches */}
                      <div className="swatch-subgroup">
                        {neonColors.map((c) => {
                          const isSelected = currentColor === c.hex.toUpperCase();
                          return (
                            <button
                              key={c.id}
                              className={`curated-swatch-btn ${isSelected ? 'selected' : ''}`}
                              style={{ backgroundColor: c.hex }}
                              onClick={() => onUpdateLayerColor(layer.id, c.hex)}
                              title={`⚡ ${c.name} (${c.hex})`}
                              type="button"
                            >
                              {isSelected && <Check size={10} color="#000000" strokeWidth={3.5} />}
                            </button>
                          );
                        })}
                      </div>

                      <div className="swatch-divider" />

                      {/* 4 Normal Swatches */}
                      <div className="swatch-subgroup">
                        {normalColors.map((c) => {
                          const isSelected = currentColor === c.hex.toUpperCase();
                          const iconColor = ['#FFFFFF', '#94A3B8'].includes(c.hex.toUpperCase()) ? '#000000' : '#FFFFFF';
                          return (
                            <button
                              key={c.id}
                              className={`curated-swatch-btn ${isSelected ? 'selected' : ''}`}
                              style={{ backgroundColor: c.hex }}
                              onClick={() => onUpdateLayerColor(layer.id, c.hex)}
                              title={`⚪ ${c.name} (${c.hex})`}
                              type="button"
                            >
                              {isSelected && <Check size={10} color={iconColor} strokeWidth={3.5} />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Audio & Dynamics Sliders */}
          <div className="control-section">
            <div className="section-title">
              <Sliders size={13} />
              <span>REACTIVE DYNAMICS</span>
            </div>

            {/* Beat Sensitivity */}
            <div className="slider-item">
              <div className="slider-header">
                <span>BEAT SENSITIVITY</span>
                <span className="slider-val">{settings.sensitivity.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min={0.6}
                max={2.0}
                step={0.05}
                value={settings.sensitivity}
                onChange={(e) => onUpdateSettings('sensitivity', parseFloat(e.target.value))}
                className="glass-slider"
              />
            </div>

            {/* Bass Impact Power */}
            <div className="slider-item">
              <div className="slider-header">
                <span>BASS IMPACT</span>
                <span className="slider-val">{settings.bassPower.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={2.5}
                step={0.05}
                value={settings.bassPower}
                onChange={(e) => onUpdateSettings('bassPower', parseFloat(e.target.value))}
                className="glass-slider"
              />
            </div>

            {/* Motion Trail Decay */}
            <div className="slider-item">
              <div className="slider-header">
                <span>TRAIL PERSISTENCE</span>
                <span className="slider-val">{(settings.trailDecay * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min={0.05}
                max={0.35}
                step={0.01}
                value={settings.trailDecay}
                onChange={(e) => onUpdateSettings('trailDecay', parseFloat(e.target.value))}
                className="glass-slider"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
