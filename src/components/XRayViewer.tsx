import React, { useState } from 'react';
import { useToast } from './ui/use-toast';
import XRayQueue from './XRayQueue';
import XRayToolbar from './XRayToolbar';
import XRayControlPanel from './XRayControlPanel';
import ImageUploadHandler from './ImageUploadHandler';
import DwvComponent from './DwvComponent';

const XRayViewer = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [contrast, setContrast] = useState(100);
  const [exposure, setExposure] = useState(100);
  const [zoom, setZoom] = useState(100);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [aiModel, setAiModel] = useState('General Purpose X-Ray AI');
  const [mode, setMode] = useState('Standard');
  const [sensitivity, setSensitivity] = useState(50);
  const [focus, setFocus] = useState(50);
  const [noiseCancellation, setNoiseCancellation] = useState(50);
  const { toast } = useToast();

  const handleImagesUploaded = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setFiles(prevFiles => {
        const updatedFiles = [...prevFiles, ...newFiles];
        setCurrentFileIndex(updatedFiles.length - 1);
        return updatedFiles;
      });
    }
  };

  return (
    <div className="flex h-screen p-4 gap-4 max-w-full overflow-hidden">
      <div className="flex flex-1 gap-4 flex-col md:flex-row">
        <div className="flex gap-4 flex-row md:flex-col">
          <XRayToolbar
            isMeasuring={false}
            setIsMeasuring={() => {}}
            setZoom={setZoom}
            setPosition={() => {}}
            setIsDragging={() => {}}
            isGridView={false}
            setIsGridView={() => {}}
            setContrast={setContrast}
            setExposure={setExposure}
          />
        </div>

        <div className="flex-1 bg-black/90 rounded-lg flex items-center justify-center overflow-hidden relative">
          {files.length > 0 ? (
            <>
              <div className="relative w-full h-[80vh] flex items-center justify-center">
                <DwvComponent imageData={files[currentFileIndex]} />
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-24">
                <XRayQueue
                  images={files.map(f => URL.createObjectURL(f))}
                  currentIndex={currentFileIndex}
                  onSelect={setCurrentFileIndex}
                />
              </div>
            </>
          ) : (
            <ImageUploadHandler onImagesUploaded={handleImagesUploaded} />
          )}
        </div>
      </div>

      <XRayControlPanel
        aiModel={aiModel}
        setAiModel={setAiModel}
        mode={mode}
        setMode={setMode}
        sensitivity={sensitivity}
        setSensitivity={setSensitivity}
        focus={focus}
        setFocus={setFocus}
        noiseCancellation={noiseCancellation}
        setNoiseCancellation={setNoiseCancellation}
        zoom={zoom}
        setZoom={setZoom}
        showHeatmap={showHeatmap}
        setShowHeatmap={setShowHeatmap}
        onFileUpload={handleImagesUploaded}
      />
    </div>
  );
};

export default XRayViewer;