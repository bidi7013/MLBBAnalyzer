import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { WaveformMatrix } from '../visualizers/WaveformMatrix';

const waveformEngine = new WaveformMatrix();

export const VisualizerCanvas = forwardRef(({
  audioEngine,
  settings,
  onFrame
}, ref) => {
  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  useImperativeHandle(ref, () => ({
    // Export 4K PNG Snapshot
    exportSnapshot: () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const link = document.createElement('a');
      link.download = `aurabeat-art-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    },
    // Start canvas video recording
    startRecording: () => {
      const canvas = canvasRef.current;
      if (!canvas) return false;
      recordedChunksRef.current = [];

      try {
        const stream = canvas.captureStream(60);
        const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
        
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            recordedChunksRef.current.push(e.data);
          }
        };

        recorder.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `aurabeat-capture-${Date.now()}.webm`;
          a.click();
          URL.revokeObjectURL(url);
        };

        recorder.start();
        mediaRecorderRef.current = recorder;
        return true;
      } catch (err) {
        console.error('MediaRecorder start failed:', err);
        return false;
      }
    },
    stopRecording: () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current = null;
        return true;
      }
      return false;
    }
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    window.addEventListener('resize', resize);
    resize();

    const renderLoop = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      const frameData = audioEngine.getAnalysisFrame();
      waveformEngine.render(ctx, width, height, frameData, settings);

      if (onFrame) {
        onFrame(frameData);
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [settings, audioEngine, onFrame]);

  return (
    <canvas
      ref={canvasRef}
      className="visualizer-canvas"
      aria-label="Generative Audio Visualizer Canvas"
    />
  );
});
