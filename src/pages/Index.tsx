import React from 'react';
import XRayViewer from '../components/XRayViewer';
import Chat from '../components/Chat';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <XRayViewer />
      <Chat />
    </div>
  );
};

export default Index;