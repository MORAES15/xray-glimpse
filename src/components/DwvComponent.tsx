import React, { useEffect, useRef } from 'react';
import dwv from 'dwv';

interface DwvComponentProps {
  imageData?: File;
}

const DwvComponent = ({ imageData }: DwvComponentProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dwvApp = useRef<any>(null);

  useEffect(() => {
    if (typeof dwv === 'undefined') {
      console.error('DWV library not loaded');
      return;
    }

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

    if (!dwvApp.current) {
      try {
        const app = new dwv.App();
        app.init({
          dataViewConfigs: { 
            '*': [{
              divId: 'dwv',
              orientation: 'axial',
              opacity: 1.0
            }]
          },
          tools: tools,
          binders: [],
          viewOnFirstLoadItem: true,
          defaultCharacterSet: 'UTF-8'
        });
        dwvApp.current = app;
        console.log('DWV App initialized successfully');
      } catch (error) {
        console.error('Error initializing DWV:', error);
      }
    }

    return () => {
      if (dwvApp.current) {
        dwvApp.current.reset();
      }
    };
  }, []);

  useEffect(() => {
    if (imageData && dwvApp.current) {
      console.log('Loading new image data');
      dwvApp.current.reset();
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