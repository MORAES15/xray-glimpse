import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const Chat = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div 
      className={`fixed right-4 top-4 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-12' : 'w-64'
      } glass-dark rounded-lg flex h-[calc(100vh-2rem)]`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="p-2 hover:bg-medical/10 transition-colors absolute left-0 top-2"
      >
        {isCollapsed ? (
          <ChevronLeft className="text-white" />
        ) : (
          <ChevronRight className="text-white" />
        )}
      </button>
      
      <div className={`flex-1 p-4 space-y-4 ${isCollapsed ? 'hidden' : 'block'} ml-8`}>
        <h2 className="text-xl font-semibold text-white">Chat</h2>
        <div className="h-[calc(100vh-12rem)] bg-black/20 rounded-lg p-4 overflow-y-auto">
          <p className="text-gray-400 text-sm">Chat functionality coming soon...</p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 bg-black/20 rounded-lg px-4 py-2 text-white"
            disabled
          />
          <button 
            className="bg-medical px-4 py-2 rounded-lg text-white disabled:opacity-50"
            disabled
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;