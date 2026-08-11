import React, { useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Upload, 
  Mic, 
  Disc,
  ListMusic
} from 'lucide-react';

export const AudioPlayerDeck = ({
  audioEngine,
  isPlaying,
  sourceType,
  currentTrackName,
  currentArtistName,
  currentTime,
  duration,
  volume,
  bassBoostActive,
  playbackRate,
  onTogglePlay,
  onPlayNext,
  onPlayPrev,
  onVolumeChange,
  onSeek,
  onToggleBassBoost,
  onRateChange,
  onUploadFile,
  onEnableMic,
  onOpenSpotifyHub
}) => {
  const fileInputRef = useRef(null);

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadFile(file);
    }
  };

  return (
    <div className="audio-deck-glass">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="audio/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Top Row: Audio Source Switcher */}
      <div className="deck-source-row">
        <div className="source-group">
          <button
            className={`glass-source-btn ${sourceType === 'spotify' ? 'active' : ''}`}
            onClick={onOpenSpotifyHub}
            title="Open Spotify Playlist Hub & Play Songs with Beat Tracker"
          >
            <Disc size={14} />
            <span>Spotify Hub</span>
          </button>

          <button
            className={`glass-source-btn ${sourceType === 'file' ? 'active' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            title="Upload MP3 / WAV / FLAC from your device"
          >
            <Upload size={14} />
            <span>Upload Music</span>
          </button>

          <button
            className={`glass-source-btn ${sourceType === 'mic' ? 'active' : ''}`}
            onClick={onEnableMic}
            title="Real-time Microphone Feed"
          >
            <Mic size={14} />
            <span>Live Mic</span>
          </button>
        </div>
      </div>

      {/* Center Row: Timeline Scrub Bar (for file and Spotify streams) */}
      {['file', 'spotify'].includes(sourceType) && duration > 0 && (
        <div className="deck-timeline-row">
          <span className="timecode-label">{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            className="glass-slider timeline-slider"
            aria-label="Timeline scrubber"
          />
          <span className="timecode-label">{formatTime(duration)}</span>
        </div>
      )}

      {/* Bottom Row: Playback & Studio Controls */}
      <div className="deck-controls-row">
        {/* Track Title & Artist Info */}
        <div className="track-info">
          <span className="track-name">{currentTrackName}</span>
          <span className="track-source-type">
            {currentArtistName ? `${currentArtistName.toUpperCase()} • ` : ''}
            {sourceType.toUpperCase()} MODE
          </span>
        </div>

        {/* Master Playback Controls (Prev, Play/Pause, Next) */}
        <div className="playback-actions">
          {sourceType === 'spotify' && (
            <button
              className="glass-skip-btn"
              onClick={onPlayPrev}
              title="Previous Track"
              aria-label="Previous Track"
            >
              <SkipBack size={16} />
            </button>
          )}

          <button
            className="glass-play-btn"
            onClick={onTogglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: 2 }} />}
          </button>

          {sourceType === 'spotify' && (
            <button
              className="glass-skip-btn"
              onClick={onPlayNext}
              title="Next Track"
              aria-label="Next Track"
            >
              <SkipForward size={16} />
            </button>
          )}
        </div>

        {/* EQ & Audio Modifiers */}
        <div className="deck-audio-tools">
          {/* Bass Boost Toggle */}
          <button
            className={`glass-tool-btn ${bassBoostActive ? 'active' : ''}`}
            onClick={onToggleBassBoost}
            title="Toggle Sub-Bass Low Shelf Boost (+10dB)"
          >
            <span>BASS BOOST</span>
          </button>

          {/* Speed Selector */}
          <div className="speed-selector">
            {[0.75, 1.0, 1.25, 1.5].map((rate) => (
              <button
                key={rate}
                className={`glass-mini-btn ${playbackRate === rate ? 'active' : ''}`}
                onClick={() => onRateChange(rate)}
              >
                {rate}x
              </button>
            ))}
          </div>

          {/* Volume Control */}
          <div className="volume-control">
            <button
              className="glass-icon-btn"
              onClick={() => onVolumeChange(volume === 0 ? 0.8 : 0)}
              aria-label="Mute / Unmute"
            >
              {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="glass-slider volume-slider"
              aria-label="Volume"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
