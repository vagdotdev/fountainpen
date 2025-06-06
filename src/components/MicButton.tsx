
import React from 'react';
import { Mic } from 'lucide-react';

interface MicButtonProps {
  onStartRecording: () => void;
}

const MicButton = ({ onStartRecording }: MicButtonProps) => {
  return (
    <button
      onClick={onStartRecording}
      className="group relative w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 active:scale-95"
    >
      <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <Mic className="w-8 h-8 text-white mx-auto" />
      
      {/* Pulse animation */}
      <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping opacity-75" />
      <div className="absolute inset-2 rounded-full border-2 border-blue-300 animate-ping opacity-50 animation-delay-75" />
    </button>
  );
};

export default MicButton;
