
import React from 'react';
import { Undo } from 'lucide-react';

interface UndoBarProps {
  isVisible: boolean;
  message: string;
  onUndo: () => void;
}

const UndoBar = ({ isVisible, message, onUndo }: UndoBarProps) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 animate-scale-in">
      <div className="flex items-center gap-3 bg-slate-800 text-white shadow-xl rounded-full p-2 pl-4 pr-2 border border-slate-700">
        <span className="text-sm text-slate-300">
          {message}
        </span>
        <button
          onClick={onUndo}
          className="flex items-center gap-1.5 bg-slate-600 hover:bg-slate-500 rounded-full px-3 py-1 text-sm font-medium transition-colors"
        >
          <Undo className="w-3.5 h-3.5" />
          <span>undo</span>
        </button>
      </div>
    </div>
  );
};

export default UndoBar;
