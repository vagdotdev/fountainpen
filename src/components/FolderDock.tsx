
import React, { useState } from 'react';
import { Plus, Folder, Users, Trash2 } from 'lucide-react';
import { Folder as FolderType } from '../types/Note';

interface FolderDockProps {
  folders: FolderType[];
  selectedFolder: string;
  onFolderSelect: (folderId: string) => void;
  onCreateFolder: () => void;
  onDeleteFolder: (folderId: string) => void;
  onDropNote: (noteId: string, folderId: string) => void;
}

const FolderDock = ({ folders, selectedFolder, onFolderSelect, onCreateFolder, onDeleteFolder, onDropNote }: FolderDockProps) => {
  const [dragOverFolder, setDragOverFolder] = useState<string | null>(null);

  const getFolderIcon = (type: string) => {
    if (type === 'shared') {
      return <Users className="w-6 h-6" />;
    }
    return <Folder className="w-6 h-6" />;
  };

  const handleDragOver = (e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    setDragOverFolder(folderId);
  };

  const handleDragLeave = () => {
    setDragOverFolder(null);
  };

  const handleDrop = (e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    const noteId = e.dataTransfer.getData('text/plain');
    if (noteId) {
      onDropNote(noteId, folderId);
    }
    setDragOverFolder(null);
  };

  const handleDeleteFolder = (e: React.MouseEvent, folderId: string) => {
    e.stopPropagation();
    onDeleteFolder(folderId);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 shadow-lg">
      <div className="flex items-center justify-center gap-4 py-4 px-6">
        {/* Folder Icons */}
        <div className="flex items-center gap-2">
          {folders.map((folder) => (
            <div key={folder.id} className="relative group">
              <button
                onClick={() => onFolderSelect(folder.id)}
                onDragOver={(e) => handleDragOver(e, folder.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, folder.id)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all transform hover:scale-105 ${
                  selectedFolder === folder.id
                    ? 'bg-blue-500 text-white shadow-md'
                    : dragOverFolder === folder.id
                    ? 'bg-green-200 text-green-800 scale-110'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {getFolderIcon(folder.type || 'folder')}
                <span className="text-xs font-medium truncate max-w-16">{folder.name}</span>
              </button>
              
              {/* Delete button for custom folders */}
              {folder.isCustom && (
                <button
                  onClick={(e) => handleDeleteFolder(e, folder.id)}
                  className="absolute -top-1 -right-1 bg-slate-500 hover:bg-slate-600 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
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
          <span className="text-xs font-medium">New Folder</span>
        </button>

        {/* Delete Folder Button */}
        <button
          onClick={() => {
            if (selectedFolder !== 'library') {
              onDeleteFolder(selectedFolder);
            }
          }}
          disabled={selectedFolder === 'library'}
          className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all transform hover:scale-105 ${
            selectedFolder === 'library' 
              ? 'text-slate-300 cursor-not-allowed' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Trash2 className="w-6 h-6" />
          <span className="text-xs font-medium">Delete Folder</span>
        </button>
      </div>
    </div>
  );
};

export default FolderDock;
