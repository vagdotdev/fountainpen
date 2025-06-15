
import React, { useState } from 'react';
import { MoreVertical, Trash2, Copy } from 'lucide-react';
import { Note, Folder } from '../types/Note';

interface NoteCardProps {
  note: Note;
  folders: Folder[];
  onDelete: (noteId: string) => void;
  onMoveToFolder: (noteId: string, folderId: string) => void;
  onDragStart: (e: React.DragEvent, noteId: string) => void;
  onNoteClick: (note: Note) => void;
}

const NoteCard = ({ note, folders, onDelete, onMoveToFolder, onDragStart, onNoteClick }: NoteCardProps) => {
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

  const handleClick = () => {
    onNoteClick(note);
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
        onClick={handleClick}
        className={`bg-white rounded-lg shadow-sm border border-slate-200 p-4 cursor-pointer hover:shadow-md transition-all duration-200 ${
          isDragging ? 'opacity-50' : ''
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 leading-tight pr-2">
            {note.title}
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 text-slate-400 hover:text-slate-600 transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-3">
          <p className="text-xs text-slate-600 line-clamp-4 leading-relaxed">
            {note.summary}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {formatDate(note.createdAt)}
          </span>
        </div>
      </div>

      {/* Context Menu */}
      {showMenu && (
        <div className="absolute top-8 right-0 bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-[160px]">
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
