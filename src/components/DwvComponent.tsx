import React, { useEffect, useRef } from 'react';
import dwv from 'dwv';

interface DwvComponentProps {
  imageData?: File;
}

const DwvComponent = ({ imageData }: DwvComponentProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dwvApp = useRef<dwv.App | null>(null);

  useEffect(() => {
    // DWV configuration
    const tools = {
      Scroll: {
        options: ['mousewheel', 'touchstart']
      },
      ZoomAndPan: {
        options: ['mousedown', 'mousemove', 'mouseup', 'touchstart', 'touchmove', 'touchend']
      },
      WindowLevel: {
        options: ['mousedown', 'mousemove', 'mouseup', 'touchstart', 'touchmove', 'touchend']
      }
    };

    // Initialize DWV
    if (!dwvApp.current) {
      dwvApp.current = new dwv.App();
      dwvApp.current.init({
        dataViewConfigs: { 
          '*': [{
            divId: 'dwv',
            orientation: 'axial',
            colourMap: 'plain',
            opacity: 1.0
          }]
        },
        tools: tools,
        binders: [],
        viewOnFirstLoadItem: true,
        defaultCharacterSet: 'UTF-8'
      });
    }

    return () => {
      if (dwvApp.current) {
        dwvApp.current.reset();
      }
    };
  }, []);

  useEffect(() => {
    if (imageData && dwvApp.current) {
      // Reset the viewer
      dwvApp.current.reset();
      // Load the image
      dwvApp.current.loadFiles([imageData]);
    }
  }, [imageData]);

  return (
    <div id="dwv" ref={containerRef} className="w-full h-full min-h-[500px]">
      <div className="layerContainer">
        <div className="dropBox"></div>
      </div>
    </div>
  );
};

export default DwvComponent;