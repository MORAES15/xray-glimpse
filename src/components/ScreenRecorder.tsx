import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { Circle, Play, Square, GripHorizontal, Pause } from 'lucide-react';

interface ScreenRecorderProps {
  isVisible: boolean;
}

const ScreenRecorder = ({ isVisible }: ScreenRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 100 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const [videoFormat, setVideoFormat] = useState<'webm' | 'mp4'>('webm'); // Default format

  // Smooth drag handling with requestAnimationFrame
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDraggingRef.current) return;

    requestAnimationFrame(() => {
      const newX = e.clientX - dragStartRef.current.x;
      const newY = e.clientY - dragStartRef.current.y;

      // Viewport boundaries
      const maxX = window.innerWidth - (containerRef.current?.offsetWidth || 0);
      const maxY = window.innerHeight - (containerRef.current?.offsetHeight || 0);

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    });
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      isDraggingRef.current = true;
      dragStartRef.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };

  // Cleanup event listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false
      });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: `video/${videoFormat}` });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `screen-recording-${Date.now()}.${videoFormat}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        stream.getTracks().forEach(track => track.stop());
        toast({
          title: "Recording saved",
          description: `Your screen recording has been downloaded as ${videoFormat.toUpperCase()}`
        });
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
      toast({
        title: "Recording started",
        description: "Click the stop button to end recording"
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording failed",
        description: "Failed to start screen recording",
        variant: "destructive"
      });
    }
  };

  // Pause recording
  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
        toast({
          title: "Recording resumed",
          description: "Recording has been resumed"
        });
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
        toast({
          title: "Recording paused",
          description: "Recording has been paused"
        });
      }
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  // Handle video format selection
  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setVideoFormat(e.target.value as 'webm' | 'mp4');
  };

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed z-50 flex gap-2 p-2 bg-black/80 rounded-lg shadow-lg cursor-move"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: isDraggingRef.current ? 'none' : 'transform 0.2s ease'
      }}
      onMouseDown={handleMouseDown}
    >
      <GripHorizontal className="text-white/50 h-4 w-4 mt-2" />
      <Button
        variant="ghost"
        size="icon"
        onClick={isRecording ? stopRecording : startRecording}
        className={`hover:bg-white/20 ${isRecording ? 'text-red-500 animate-pulse' : 'text-white'}`}
      >
        {isRecording ? <Square className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={pauseRecording}
        className="hover:bg-white/20 text-white"
        disabled={!isRecording}
      >
        {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
      </Button>
      <select
        value={videoFormat}
        onChange={handleFormatChange}
        className="bg-black/50 text-white rounded-md p-1"
      >
        <option value="webm">WEBM</option>
        <option value="mp4">MP4</option>
      </select>
    </div>
  );
};

export default ScreenRecorder;