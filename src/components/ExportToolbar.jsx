import React, { useState, useEffect } from 'react';
import { Camera, Video, Square, Maximize, Minimize } from 'lucide-react';

export const ExportToolbar = ({
  onExportSnapshot,
  onStartRecord,
  onStopRecord,
  isFullscreen,
  onToggleFullscreen
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);

  useEffect(() => {
    let timer;
    if (isRecording) {
      setRecordSeconds(0);
      timer = setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);
    } else {
      setRecordSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const handleToggleRecord = () => {
    if (!isRecording) {
      const ok = onStartRecord();
      if (ok) setIsRecording(true);
    } else {
      onStopRecord();
      setIsRecording(false);
    }
  };

  const formatTimer = (s) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="export-toolbar-glass">
      {/* 4K Snapshot Button */}
      <button
        className="glass-action-btn"
        onClick={onExportSnapshot}
        title="Export Current Canvas as 4K PNG Artwork"
      >
        <Camera size={15} />
        <span>Snapshot</span>
      </button>

      {/* Video Recorder */}
      <button
        className={`glass-action-btn ${isRecording ? 'recording' : ''}`}
        onClick={handleToggleRecord}
        title={isRecording ? 'Stop and Download Video Clip' : 'Record Visualizer Video Clip (.webm)'}
      >
        {isRecording ? <Square size={14} /> : <Video size={15} />}
        <span>{isRecording ? `REC ${formatTimer(recordSeconds)}` : 'Record Clip'}</span>
      </button>

      {/* Fullscreen Zen Mode */}
      <button
        className="glass-action-btn"
        onClick={onToggleFullscreen}
        title="Toggle Fullscreen Zen Mode (Press 'F')"
      >
        {isFullscreen ? <Minimize size={15} /> : <Maximize size={15} />}
        <span>{isFullscreen ? 'Exit Zen' : 'Zen Mode'}</span>
      </button>
    </div>
  );
};
