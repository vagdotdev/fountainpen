
import React, { useState } from 'react';
import { MoreVertical, Trash2, Copy } from 'lucide-react';
import { format } from 'date-fns';
import { Note, Folder } from '../types/Note';
import { cn } from '@/lib/utils';

interface NoteCardProps {
  note: Note;
  folders: Folder[];
  onDelete: (noteId: string) => void;
  onMoveToFolder: (noteId: string, folderId: string) => void;
  onDragStart: (e: React.DragEvent, noteId: string) => void;
  onNoteClick: (note: Note) => void;
  isSelected: boolean;
  onSelect: (noteId: string) => void;
  selectedCount: number;
  isMerging: boolean;
}

const NoteCard = ({ note, folders, onDelete, onMoveToFolder, onDragStart, onNoteClick, isSelected, onSelect, selectedCount, isMerging }: NoteCardProps) => {
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

  const handleViewNote = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNoteClick(note);
  };

  const formatDate = (date: Date) => {
    return format(date, 'MMM dd yyyy');
  };

  return (
    <div className="relative group" onClick={() => onSelect(note.id)}>
      <div
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        className={cn(
          'bg-white rounded-2xl shadow-sm border p-5 cursor-pointer hover:shadow-lg transition-all duration-200 h-64 flex flex-col',
          isDragging && 'opacity-50',
          {
            'border-slate-200': !isSelected,
            'border-black ring-2 ring-black/10': isSelected && selectedCount === 1,
            'border-supernote ring-2 ring-supernote/30': isSelected && selectedCount >= 2,
            'animate-merge-out': isMerging && isSelected,
          }
        )}
      >
        {/* Header */}
        <div onClick={handleViewNote} className="flex items-start justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-800 line-clamp-3 leading-tight pr-2 flex-1">
            {note.title}
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 text-slate-400 hover:text-slate-600 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div onClick={handleViewNote} className="flex-1 mb-4">
          <p className="text-xs text-slate-600 line-clamp-6 leading-relaxed">
            {note.summary}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xs text-slate-400 font-times">
            {formatDate(note.createdAt)}
          </span>
        </div>
      </div>

      {/* Selection Indicator */}
      <div className="absolute bottom-4 right-4 pointer-events-none">
        {isSelected ? (
          <div className="w-5 h-5 flex items-center justify-center bg-blue-500 rounded-full text-white border-2 border-white shadow">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          </div>
        ) : (
          <div className="w-5 h-5 rounded-full border border-slate-300 bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>

      {/* Context Menu */}
      {showMenu && (
        <div className="absolute top-10 right-0 bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-[160px]">
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
        <div className="absolute top-28 right-0 bg-white border border-slate-200 rounded-lg shadow-lg z-20 min-w-[140px]">
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
