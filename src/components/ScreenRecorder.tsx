import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { Record, Play, Square, GripHorizontal } from 'lucide-react';

interface ScreenRecorderProps {
  onClose: () => void;
}

const ScreenRecorder = ({ onClose }: ScreenRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: "screen" }
      });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setRecordedChunks([blob]);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast({
        title: "Recording started",
        description: "Your screen is now being recorded"
      });
    } catch (err) {
      console.error('Error starting recording:', err);
      toast({
        title: "Recording failed",
        description: "Failed to start screen recording",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast({
        title: "Recording stopped",
        description: "Your recording has been saved"
      });
    }
  };

  const downloadRecording = () => {
    if (recordedChunks.length === 0) return;
    
    const blob = recordedChunks[0];
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';
    a.href = url;
    a.download = `screen-recording-${Date.now()}.webm`;
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast({
      title: "Download started",
      description: "Your recording is being downloaded"
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div
      className="fixed bg-black/90 rounded-lg p-4 shadow-lg cursor-move z-50 flex gap-2 items-center animate-fade-in"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
    >
      <GripHorizontal className="h-4 w-4 text-gray-400" />
      
      <Button
        variant="ghost"
        size="icon"
        className={`${isRecording ? 'text-red-500 animate-pulse' : ''}`}
        onClick={isRecording ? stopRecording : startRecording}
      >
        <Record className="h-4 w-4" />
      </Button>

      {recordedChunks.length > 0 && (
        <Button
          variant="ghost"
          size="icon"
          onClick={downloadRecording}
        >
          <Play className="h-4 w-4" />
        </Button>
      )}

      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
      >
        <Square className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ScreenRecorder;