
import React from 'react';
import { Plus, Home, Briefcase, User, Gamepad2 } from 'lucide-react';
import { Folder } from '../types/Note';

interface FolderDockProps {
  folders: Folder[];
  selectedFolder: string;
  onFolderSelect: (folderId: string) => void;
  onCreateFolder: () => void;
}

const FolderDock = ({ folders, selectedFolder, onFolderSelect, onCreateFolder }: FolderDockProps) => {
  const getFolderIcon = (iconName: string) => {
    switch (iconName) {
      case 'home':
        return <Home className="w-6 h-6" />;
      case 'briefcase':
        return <Briefcase className="w-6 h-6" />;
      case 'user':
        return <User className="w-6 h-6" />;
      case 'gamepad':
        return <Gamepad2 className="w-6 h-6" />;
      default:
        return <Home className="w-6 h-6" />;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 shadow-lg">
      <div className="flex items-center justify-center gap-4 py-4 px-6">
        {/* Folder Icons */}
        <div className="flex items-center gap-2">
          {folders.map((folder) => (
            <button
              key={folder.id}
              onClick={() => onFolderSelect(folder.id)}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all transform hover:scale-105 ${
                selectedFolder === folder.id
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {getFolderIcon(folder.icon)}
              <span className="text-xs font-medium truncate max-w-16">{folder.name}</span>
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-slate-300 mx-2" />

        {/* Create Folder Button */}
        <button
          onClick={onCreateFolder}
          className="flex flex-col items-center gap-1 p-3 rounded-xl text-slate-600 hover:bg-slate-100 transition-all transform hover:scale-105"
        >
          <Plus className="w-6 h-6" />
          <span className="text-xs font-medium">New</span>
        </button>
      </div>
    </div>
  );
};

export default FolderDock;
