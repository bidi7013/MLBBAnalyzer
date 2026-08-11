import { BeatDetector } from './BeatDetector';

export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.analyser = null;
    this.gainNode = null;
    this.bassFilter = null;
    this.sourceNode = null;
    this.micStream = null;
    this.audioElement = new Audio();
    this.audioElement.crossOrigin = 'anonymous';

    this.beatDetector = new BeatDetector();

    this.frequencyData = null;
    this.timeDomainData = null;

    this.sourceType = 'idle'; // 'file' | 'mic' | 'spotify' | 'idle'
    this.currentTrackName = 'No track loaded – Select a song from Spotify Hub or upload music';
    this.currentArtistName = '';
    this.isPlaying = false;
    this.volume = 0.85;
    this.playbackRate = 1.0;
    this.bassBoostActive = false;
    this.bassBoostGain = 1.0;
    this.sensitivity = 1.15;

    // Active playlist state
    this.playlist = [];
    this.currentTrackIndex = -1;

    // Track timeline
    this.currentTime = 0;
    this.duration = 0;

    this.onStateChange = null;
  }

  /**
   * Initialize AudioContext and graph upon first user gesture
   */
  async init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }
      return;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContextClass();

    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 1024;
    this.analyser.smoothingTimeConstant = 0.82;

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);

    this.bassFilter = this.ctx.createBiquadFilter();
    this.bassFilter.type = 'lowshelf';
    this.bassFilter.frequency.setValueAtTime(120, this.ctx.currentTime);
    this.bassFilter.gain.setValueAtTime(0, this.ctx.currentTime);

    // Audio Graph: Source -> BassFilter -> Gain -> Analyser -> Destination
    this.bassFilter.connect(this.gainNode);
    this.gainNode.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);

    this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
    this.timeDomainData = new Uint8Array(this.analyser.frequencyBinCount);

    // Setup audio element listeners
    this.audioElement.addEventListener('timeupdate', () => {
      this.currentTime = this.audioElement.currentTime;
      this.duration = this.audioElement.duration || 0;
      if (this.onStateChange) this.onStateChange();
    });

    this.audioElement.addEventListener('ended', () => {
      if (this.playlist.length > 0 && this.currentTrackIndex < this.playlist.length - 1) {
        this.playNextTrack();
      } else {
        this.isPlaying = false;
        if (this.onStateChange) this.onStateChange();
      }
    });
  }

  /**
   * Play a track from a Spotify Playlist directly in the Web Audio Engine
   */
  async playSpotifyTrack(track, playlist = [], index = 0) {
    await this.init();
    this.stopCurrentSource();

    if (playlist.length > 0) {
      this.playlist = playlist;
      this.currentTrackIndex = index;
    }

    this.sourceType = 'spotify';
    this.currentTrackName = track.title;
    this.currentArtistName = track.artist || 'Spotify Stream';
    this.audioElement.src = track.audioUrl;
    this.audioElement.playbackRate = this.playbackRate;

    if (!this.sourceNode) {
      this.sourceNode = this.ctx.createMediaElementSource(this.audioElement);
      this.sourceNode.connect(this.bassFilter);
    }

    try {
      await this.audioElement.play();
      this.isPlaying = true;
    } catch (e) {
      console.warn('Playback gesture required or stream loading:', e);
      this.isPlaying = false;
    }

    if (this.onStateChange) this.onStateChange();
  }

  playNextTrack() {
    if (this.playlist.length > 0 && this.currentTrackIndex < this.playlist.length - 1) {
      const nextIdx = this.currentTrackIndex + 1;
      this.playSpotifyTrack(this.playlist[nextIdx], this.playlist, nextIdx);
    }
  }

  playPrevTrack() {
    if (this.playlist.length > 0 && this.currentTrackIndex > 0) {
      const prevIdx = this.currentTrackIndex - 1;
      this.playSpotifyTrack(this.playlist[prevIdx], this.playlist, prevIdx);
    }
  }

  /**
   * Load and play an audio file (uploaded File or blob URL)
   */
  async loadAudioFile(file) {
    await this.init();
    this.stopCurrentSource();

    const objectUrl = URL.createObjectURL(file);
    this.audioElement.src = objectUrl;
    this.currentTrackName = file.name.replace(/\.[^/.]+$/, '');
    this.currentArtistName = 'Local Audio';
    this.sourceType = 'file';
    this.playlist = [];
    this.currentTrackIndex = -1;

    if (!this.sourceNode) {
      this.sourceNode = this.ctx.createMediaElementSource(this.audioElement);
      this.sourceNode.connect(this.bassFilter);
    }

    try {
      await this.audioElement.play();
      this.isPlaying = true;
    } catch (e) {
      console.warn('Audio play auto-trigger blocked', e);
      this.isPlaying = false;
    }

    if (this.onStateChange) this.onStateChange();
  }

  /**
   * Connect live microphone
   */
  async enableMicrophone() {
    await this.init();
    this.stopCurrentSource();
    this.sourceType = 'mic';
    this.currentTrackName = 'Live Microphone Input';
    this.currentArtistName = 'Acoustic Feed';
    this.playlist = [];
    this.currentTrackIndex = -1;

    try {
      this.micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      });

      const micSource = this.ctx.createMediaStreamSource(this.micStream);
      micSource.connect(this.analyser);
      this.sourceNode = micSource;
      this.isPlaying = true;
    } catch (err) {
      console.error('Microphone access denied:', err);
      this.isPlaying = false;
      throw err;
    }

    if (this.onStateChange) this.onStateChange();
  }

  /**
   * Stop currently playing source
   */
  stopCurrentSource() {
    if (this.audioElement) {
      this.audioElement.pause();
    }
    if (this.micStream) {
      this.micStream.getTracks().forEach(t => t.stop());
      this.micStream = null;
    }
    if (this.sourceNode && this.sourceType === 'mic') {
      try {
        this.sourceNode.disconnect();
      } catch (e) {}
      this.sourceNode = null;
    }
    this.isPlaying = false;
  }

  togglePlayPause() {
    if (!this.ctx) {
      this.init();
    }

    if (this.isPlaying) {
      if (['file', 'spotify'].includes(this.sourceType)) {
        this.audioElement.pause();
      } else if (this.sourceType === 'mic') {
        this.stopCurrentSource();
      }
      this.isPlaying = false;
    } else {
      if (['file', 'spotify'].includes(this.sourceType) && this.audioElement.src) {
        this.audioElement.play().catch(() => {});
        this.isPlaying = true;
      } else if (this.sourceType === 'mic') {
        this.enableMicrophone();
      }
    }

    if (this.onStateChange) this.onStateChange();
  }

  seek(seconds) {
    if (['file', 'spotify'].includes(this.sourceType) && this.audioElement) {
      this.audioElement.currentTime = Math.max(0, Math.min(this.duration, seconds));
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  setPlaybackRate(rate) {
    this.playbackRate = Math.max(0.5, Math.min(2.0, rate));
    if (this.audioElement) {
      this.audioElement.playbackRate = this.playbackRate;
    }
  }

  toggleBassBoost() {
    this.bassBoostActive = !this.bassBoostActive;
    if (this.bassFilter && this.ctx) {
      const gainVal = this.bassBoostActive ? 10 : 0;
      this.bassFilter.gain.setValueAtTime(gainVal, this.ctx.currentTime);
    }
    this.bassBoostGain = this.bassBoostActive ? 1.8 : 1.0;
    if (this.onStateChange) this.onStateChange();
  }

  setSensitivity(val) {
    this.sensitivity = val;
  }

  /**
   * Frame-by-frame analysis loop for the 7-layer wave visualizer
   */
  getAnalysisFrame() {
    if (!this.analyser || !this.ctx) {
      return {
        frequencyData: new Uint8Array(0),
        timeDomainData: new Uint8Array(0),
        beatInfo: this.beatDetector.getOutput()
      };
    }

    this.analyser.getByteFrequencyData(this.frequencyData);
    this.analyser.getByteTimeDomainData(this.timeDomainData);

    const beatInfo = this.beatDetector.update(
      this.frequencyData,
      this.ctx.sampleRate,
      this.sensitivity,
      this.bassBoostGain
    );

    return {
      frequencyData: this.frequencyData,
      timeDomainData: this.timeDomainData,
      beatInfo
    };
  }
}
