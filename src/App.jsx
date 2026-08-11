import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AudioEngine } from './audio/AudioEngine';
import { VisualizerCanvas } from './components/VisualizerCanvas';
import { AudioPlayerDeck } from './components/AudioPlayerDeck';
import { StudioControls, DEFAULT_LAYER_COLORS } from './components/StudioControls';
import { LiveHud } from './components/LiveHud';
import { ExportToolbar } from './components/ExportToolbar';
import { SpotifyHub } from './components/SpotifyHub';
import { CURATED_SPOTIFY_PLAYLISTS } from './audio/spotifyService';

const audioEngine = new AudioEngine();

export const App = () => {
  const canvasRef = useRef(null);

  // App & Visual State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [layerColors, setLayerColors] = useState(DEFAULT_LAYER_COLORS);

  // Spotify Hub State
  const [isSpotifyHubOpen, setIsSpotifyHubOpen] = useState(false);
  const [activePlaylist, setActivePlaylist] = useState(CURATED_SPOTIFY_PLAYLISTS[0]);
  const [currentPlayingTrack, setCurrentPlayingTrack] = useState(CURATED_SPOTIFY_PLAYLISTS[0].tracks[0]);

  // Audio Playback State
  const [isPlaying, setIsPlaying] = useState(false);
  const [sourceType, setSourceType] = useState('idle');
  const [currentTrackName, setCurrentTrackName] = useState('No track loaded – Select a song from Spotify Hub or upload music');
  const [currentArtistName, setCurrentArtistName] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [bassBoostActive, setBassBoostActive] = useState(false);

  // Visualizer Settings (Waveform Matrix with 7 Custom Layer Colors)
  const [settings, setSettings] = useState({
    sensitivity: 1.15,
    bassPower: 1.2,
    trailDecay: 0.18,
    layerColors: DEFAULT_LAYER_COLORS
  });

  // Sync state changes from AudioEngine
  useEffect(() => {
    audioEngine.onStateChange = () => {
      setIsPlaying(audioEngine.isPlaying);
      setSourceType(audioEngine.sourceType);
      setCurrentTrackName(audioEngine.currentTrackName);
      setCurrentArtistName(audioEngine.currentArtistName);
      setCurrentTime(audioEngine.currentTime);
      setDuration(audioEngine.duration);
      setBassBoostActive(audioEngine.bassBoostActive);
    };
  }, []);

  // Update specific wave layer color
  const handleUpdateLayerColor = (layerId, newColor) => {
    const updated = {
      ...layerColors,
      [layerId]: newColor
    };
    setLayerColors(updated);
    setSettings((prev) => ({
      ...prev,
      layerColors: updated
    }));
  };

  // Reset all wave layer colors to default
  const handleResetLayerColors = () => {
    setLayerColors(DEFAULT_LAYER_COLORS);
    setSettings((prev) => ({
      ...prev,
      layerColors: DEFAULT_LAYER_COLORS
    }));
  };

  const handleUpdateSettings = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value
    }));
    if (key === 'sensitivity') {
      audioEngine.setSensitivity(value);
    }
  };

  // Telemetry frame callback from canvas render loop
  const handleFrame = useCallback((frameData) => {
    setLiveBeatInfo(frameData.beatInfo);
  }, []);

  // Real-time telemetry state
  const [liveBeatInfo, setLiveBeatInfo] = useState({
    isBeat: false,
    isDrop: false,
    beatPulse: 0,
    bpm: 124,
    instantEnergy: 0,
    bands: { subBass: 0, bass: 0, lowMid: 0, mid: 0, highMid: 0, treble: 0 }
  });

  // Audio actions
  const handleTogglePlay = () => {
    audioEngine.togglePlayPause();
  };

  const handleUploadFile = (file) => {
    audioEngine.loadAudioFile(file);
  };

  const handleEnableMic = async () => {
    try {
      await audioEngine.enableMicrophone();
    } catch (e) {
      alert('Microphone access was denied or is unavailable on this device.');
    }
  };

  // Spotify Hub Actions
  const handlePlaySpotifyTrack = (track, playlist, index) => {
    setCurrentPlayingTrack(track);
    audioEngine.playSpotifyTrack(track, playlist, index);
  };

  const handleSelectPlaylist = (playlist) => {
    setActivePlaylist(playlist);
  };

  const handlePlayNext = () => {
    audioEngine.playNextTrack();
    if (audioEngine.playlist.length > 0 && audioEngine.currentTrackIndex < audioEngine.playlist.length) {
      setCurrentPlayingTrack(audioEngine.playlist[audioEngine.currentTrackIndex]);
    }
  };

  const handlePlayPrev = () => {
    audioEngine.playPrevTrack();
    if (audioEngine.playlist.length > 0 && audioEngine.currentTrackIndex >= 0) {
      setCurrentPlayingTrack(audioEngine.playlist[audioEngine.currentTrackIndex]);
    }
  };

  const handleSeek = (secs) => {
    audioEngine.seek(secs);
  };

  const handleVolumeChange = (vol) => {
    setVolume(vol);
    audioEngine.setVolume(vol);
  };

  const handleRateChange = (rate) => {
    setPlaybackRate(rate);
    audioEngine.setPlaybackRate(rate);
  };

  const handleToggleBassBoost = () => {
    audioEngine.toggleBassBoost();
  };

  // Export handlers
  const handleExportSnapshot = () => {
    if (canvasRef.current) {
      canvasRef.current.exportSnapshot();
    }
  };

  const handleStartRecord = () => {
    if (canvasRef.current) {
      return canvasRef.current.startRecording();
    }
    return false;
  };

  const handleStopRecord = () => {
    if (canvasRef.current) {
      canvasRef.current.stopRecording();
    }
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Keyboard Hotkeys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        handleToggleFullscreen();
      } else if (e.code === 'KeyB') {
        e.preventDefault();
        handleToggleBassBoost();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  return (
    <div className="aurabeat-studio-root">
      {/* Background Visualizer Canvas (Waveform Matrix with 7 Custom Wave Layers) */}
      <VisualizerCanvas
        ref={canvasRef}
        audioEngine={audioEngine}
        settings={settings}
        onFrame={handleFrame}
      />

      {/* Floating Acoustic Telemetry HUD (Top-Left) */}
      <LiveHud
        beatInfo={liveBeatInfo}
        activeModeName="Waveform Matrix"
      />

      {/* Studio Export & Zen Toolbar (Top-Right) */}
      <ExportToolbar
        onExportSnapshot={handleExportSnapshot}
        onStartRecord={handleStartRecord}
        onStopRecord={handleStopRecord}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
      />

      {/* Studio Customization Sidebar (Right - 8-Color Chooser per Layer) */}
      <StudioControls
        isOpen={isSidebarOpen}
        onToggleOpen={() => setIsSidebarOpen(!isSidebarOpen)}
        layerColors={layerColors}
        onUpdateLayerColor={handleUpdateLayerColor}
        onResetLayerColors={handleResetLayerColors}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />

      {/* Glassmorphic Master Audio Player Deck (Bottom) */}
      <AudioPlayerDeck
        audioEngine={audioEngine}
        isPlaying={isPlaying}
        sourceType={sourceType}
        currentTrackName={currentTrackName}
        currentArtistName={currentArtistName}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        bassBoostActive={bassBoostActive}
        playbackRate={playbackRate}
        onTogglePlay={handleTogglePlay}
        onPlayNext={handlePlayNext}
        onPlayPrev={handlePlayPrev}
        onVolumeChange={handleVolumeChange}
        onSeek={handleSeek}
        onToggleBassBoost={handleToggleBassBoost}
        onRateChange={handleRateChange}
        onUploadFile={handleUploadFile}
        onEnableMic={handleEnableMic}
        onOpenSpotifyHub={() => setIsSpotifyHubOpen(true)}
      />

      {/* Remade Spotify Playlist & Song Hub Modal */}
      <SpotifyHub
        isOpen={isSpotifyHubOpen}
        onClose={() => setIsSpotifyHubOpen(false)}
        activePlaylist={activePlaylist}
        onSelectPlaylist={handleSelectPlaylist}
        currentPlayingTrack={currentPlayingTrack}
        isPlaying={isPlaying}
        onPlayTrack={handlePlaySpotifyTrack}
        onTogglePlay={handleTogglePlay}
      />
    </div>
  );
};
