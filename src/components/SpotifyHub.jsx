import React, { useState } from 'react';
import { 
  Music, 
  Link2, 
  X, 
  Play, 
  Pause, 
  Disc, 
  Radio, 
  Sparkles,
  ExternalLink,
  ListMusic,
  Activity
} from 'lucide-react';
import { 
  CURATED_SPOTIFY_PLAYLISTS, 
  loadSpotifyResource 
} from '../audio/spotifyService';

export const SpotifyHub = ({
  isOpen,
  onClose,
  activePlaylist = CURATED_SPOTIFY_PLAYLISTS[0],
  onSelectPlaylist,
  currentPlayingTrack,
  isPlaying,
  onPlayTrack,
  onTogglePlay
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [inputError, setInputError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setInputError('');

    if (!urlInput.trim()) {
      setInputError('Please paste a Spotify playlist, album, or track link.');
      return;
    }

    setIsLoading(true);
    try {
      const loaded = await loadSpotifyResource(urlInput);
      onSelectPlaylist(loaded);
      setUrlInput('');
      // Auto play first song
      if (loaded.tracks && loaded.tracks.length > 0) {
        onPlayTrack(loaded.tracks[0], loaded.tracks, 0);
      }
    } catch (err) {
      setInputError(err.message || 'Could not load Spotify resource.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCurated = (playlist) => {
    onSelectPlaylist(playlist);
  };

  const handleTrackClick = (track, index) => {
    if (currentPlayingTrack?.id === track.id) {
      onTogglePlay();
    } else {
      onPlayTrack(track, activePlaylist.tracks, index);
    }
  };

  return (
    <div className="spotify-overlay-backdrop" onClick={onClose}>
      <div 
        className="spotify-hub-modal" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="hub-modal-header">
          <div className="hub-title-group">
            <Disc size={18} />
            <span className="hub-title">SPOTIFY PLAYLIST & BEAT TRACKER HUB</span>
          </div>
          <button 
            className="glass-close-btn" 
            onClick={onClose}
            aria-label="Close Spotify Hub"
          >
            <X size={16} />
          </button>
        </div>

        {/* URL Input Form */}
        <form onSubmit={handleFormSubmit} className="hub-input-section">
          <div className="input-bar-glass">
            <Link2 size={16} className="input-icon" />
            <input
              type="text"
              placeholder="Paste any Spotify playlist, album, or track URL (e.g. https://open.spotify.com/playlist/...)"
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                if (inputError) setInputError('');
              }}
              className="glass-text-input"
            />
            <button type="submit" className="glass-submit-btn" disabled={isLoading}>
              <span>{isLoading ? 'Loading...' : 'Load Playlist'}</span>
            </button>
          </div>
          {inputError && <span className="input-error-msg">{inputError}</span>}
        </form>

        {/* Featured Curated Playlists Bar */}
        <div className="hub-curated-bar">
          <span className="curated-label">FEATURED:</span>
          <div className="curated-scroll-row">
            {CURATED_SPOTIFY_PLAYLISTS.map((p) => {
              const isSelected = activePlaylist?.id === p.id;
              return (
                <button
                  key={p.id}
                  className={`glass-curated-tab ${isSelected ? 'active' : ''}`}
                  onClick={() => handleSelectCurated(p)}
                >
                  <Music size={12} />
                  <span>{p.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Playlist Banner */}
        {activePlaylist && (
          <div className="active-playlist-banner">
            <img 
              src={activePlaylist.cover} 
              alt={activePlaylist.title} 
              className="playlist-cover-img"
            />
            <div className="playlist-meta-info">
              <div className="playlist-tag-row">
                <span className="playlist-curator-tag">{activePlaylist.curator.toUpperCase()}</span>
                <span className="playlist-count-tag">{activePlaylist.tracks?.length || 0} TRACKS</span>
              </div>
              <h2 className="playlist-banner-title">{activePlaylist.title}</h2>
              <p className="playlist-banner-desc">{activePlaylist.description}</p>
            </div>
            <button
              className="playlist-play-all-btn"
              onClick={() => {
                if (activePlaylist.tracks && activePlaylist.tracks.length > 0) {
                  onPlayTrack(activePlaylist.tracks[0], activePlaylist.tracks, 0);
                }
              }}
            >
              <Play size={14} fill="#0b0d11" />
              <span>PLAY ALL</span>
            </button>
          </div>
        )}

        {/* Song List Tracklist Table */}
        <div className="hub-tracklist-wrapper">
          <div className="tracklist-header-row">
            <span className="th-col col-num">#</span>
            <span className="th-col col-title">TITLE</span>
            <span className="th-col col-artist">ARTIST</span>
            <span className="th-col col-time">TIME</span>
            <span className="th-col col-action">PLAY</span>
          </div>

          <div className="tracklist-scroll-body">
            {activePlaylist?.tracks?.map((track, idx) => {
              const isCurrent = currentPlayingTrack?.id === track.id;
              return (
                <div 
                  key={track.id} 
                  className={`track-item-row ${isCurrent ? 'active' : ''}`}
                  onClick={() => handleTrackClick(track, idx)}
                >
                  {/* Track Number / Playing indicator */}
                  <div className="track-col col-num">
                    {isCurrent && isPlaying ? (
                      <Activity size={14} className="playing-pulse-icon" />
                    ) : (
                      <span className="track-index-num">{(idx + 1).toString().padStart(2, '0')}</span>
                    )}
                  </div>

                  {/* Title */}
                  <div className="track-col col-title">
                    <span className="track-item-title">{track.title}</span>
                  </div>

                  {/* Artist */}
                  <div className="track-col col-artist">
                    <span className="track-item-artist">{track.artist}</span>
                  </div>

                  {/* Duration */}
                  <div className="track-col col-time">
                    <span className="track-item-time">{track.duration}</span>
                  </div>

                  {/* Action Play Button */}
                  <div className="track-col col-action">
                    <button 
                      className={`row-play-btn ${isCurrent && isPlaying ? 'playing' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTrackClick(track, idx);
                      }}
                      aria-label="Play song with beat tracker"
                    >
                      {isCurrent && isPlaying ? (
                        <Pause size={12} />
                      ) : (
                        <Play size={12} fill="currentColor" style={{ marginLeft: 1 }} />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
