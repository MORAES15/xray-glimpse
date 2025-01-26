import React, { useEffect, useRef } from 'react';
import dwv from 'dwv';

interface DwvComponentProps {
  imageData?: File;
}

const DwvComponent = ({ imageData }: DwvComponentProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dwvApp = useRef<any>(null);

  useEffect(() => {
    if (!dwv) {
      console.error('DWV library not loaded');
      return;
    }

    // Initialization
    if (!dwvApp.current) {
      try {
        const app = new dwv.App();
        app.init({
          dataViewConfigs: {
            '*': [{
              divId: 'dwv',
              orientation: 'axial',
              colourMap: dwv.tool.colourMaps.plain,
              opacity: 1.0
            }]
          },
          tools: {
            WindowLevel: {},
            ZoomAndPan: {},
            Scroll: {}
          }
        });
        
        // Add load event listeners
        app.addEventListener('loadstart', () => {
          console.log('DWV: Load started');
        });
        
        app.addEventListener('loadend', () => {
          console.log('DWV: Load completed');
          if (containerRef.current) {
            app.render();
          }
        });
        
        app.addEventListener('error', (error: any) => {
          console.error('DWV error:', error);
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
      console.log('Loading new image data:', imageData.name);
      try {
        dwvApp.current.reset();
        dwvApp.current.loadFiles([imageData]);
      } catch (error) {
        console.error('Error loading image:', error);
      }
    }
  }, [imageData]);

  return (
    <div id="dwv" ref={containerRef} className="w-full h-full min-h-[500px] bg-black/90">
      <div className="layerContainer">
        <canvas className="imageLayer">
          Only for HTML5 compatible browsers...
        </canvas>
      </div>
    </div>
  );
};

export default DwvComponent;