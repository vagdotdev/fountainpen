
import React from 'react';
import { Mic } from 'lucide-react';

interface NotesGalleryHeaderProps {
  folderName: string;
  onStartRecording: () => void;
}

const NotesGalleryHeader = ({ folderName, onStartRecording }: NotesGalleryHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-6">
      <h1 className="text-2xl font-bold text-slate-800">
        {folderName}
      </h1>
      <button
        onClick={onStartRecording}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105"
      >
        <Mic className="w-4 h-4" />
        Record
      </button>
    </div>
  );
};

export default NotesGalleryHeader;
