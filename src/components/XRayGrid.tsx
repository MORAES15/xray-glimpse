import React from 'react';

interface XRayGridProps {
  images: string[];
  startIndex: number;
}

const XRayGrid = ({ images, startIndex }: XRayGridProps) => {
  const gridImages = images.slice(startIndex, startIndex + 4);
  
  return (
    <div className="grid grid-cols-2 gap-4 w-full h-full p-4">
      {gridImages.map((img, index) => (
        <div key={index} className="relative w-full h-full">
          <img
            src={img}
            alt={`X-Ray ${startIndex + index + 1}`}
            className="w-full h-full object-contain"
          />
          <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-sm text-white">
            {startIndex + index + 1}
          </div>
        </div>
      ))}
    </div>
  );
};

export default XRayGrid;