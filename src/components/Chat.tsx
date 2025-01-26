import React from 'react';

const Chat = () => {
  return (
    <div className="w-80 glass-dark rounded-lg p-6 space-y-4 animate-fadeIn">
      <h2 className="text-xl font-semibold text-white">Chat</h2>
      <div className="h-[calc(100vh-200px)] bg-black/20 rounded-lg p-4 overflow-y-auto">
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
  );
};

export default Chat;