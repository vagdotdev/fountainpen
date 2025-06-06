
import React, { useState } from 'react';
import { MoreVertical, Trash2, Copy } from 'lucide-react';
import { Note, Folder } from '../types/Note';

interface NoteCardProps {
  note: Note;
  folders: Folder[];
  onDelete: (noteId: string) => void;
  onMoveToFolder: (noteId: string, folderId: string) => void;
  onDragStart: (e: React.DragEvent, noteId: string) => void;
}

const NoteCard = ({ note, folders, onDelete, onMoveToFolder, onDragStart }: NoteCardProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(note.summary);
    setShowMenu(false);
    console.log('Note copied to clipboard!');
  };

  const handleDelete = () => {
    onDelete(note.id);
    setShowMenu(false);
  };

  const handleMoveToFolder = (folderId: string) => {
    onMoveToFolder(note.id, folderId);
    setShowMoveMenu(false);
    setShowMenu(false);
  };

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    onDragStart(e, note.id);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="relative group">
      <div
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        className={`flex flex-col items-center cursor-move hover:scale-105 transition-all duration-200 ${
          isDragging ? 'opacity-50' : ''
        }`}
      >
        {/* App-like Icon - Original Design Restored */}
        <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg flex items-center justify-center mb-2 group-hover:shadow-xl transition-shadow">
          {/* Menu Button */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          >
            <MoreVertical className="w-3 h-3 text-slate-600" />
          </button>

          {/* Date Badge */}
          <div className="absolute -bottom-1 -right-1 bg-white text-xs text-slate-600 px-1.5 py-0.5 rounded-full shadow-sm">
            {formatDate(note.createdAt)}
          </div>
        </div>

        {/* Title */}
        <div className="text-center max-w-20">
          <h3 className="text-sm font-medium text-slate-800 line-clamp-2 leading-tight">
            {note.title}
          </h3>
        </div>
      </div>

      {/* Context Menu */}
      {showMenu && (
        <div className="absolute top-0 right-0 bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-[160px]">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 first:rounded-t-lg"
          >
            <Copy className="w-4 h-4" />
            Copy
          </button>
          <button
            onClick={() => setShowMoveMenu(!showMoveMenu)}
            className="flex items-center gap-2 w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50"
          >
            Move to folder
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 last:rounded-b-lg"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      )}

      {/* Move Menu */}
      {showMoveMenu && (
        <div className="absolute top-24 right-0 bg-white border border-slate-200 rounded-lg shadow-lg z-20 min-w-[140px]">
          {folders.filter(f => f.id !== note.folder).map((folder) => (
            <button
              key={folder.id}
              onClick={() => handleMoveToFolder(folder.id)}
              className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 first:rounded-t-lg last:rounded-b-lg"
            >
              {folder.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default NoteCard;
