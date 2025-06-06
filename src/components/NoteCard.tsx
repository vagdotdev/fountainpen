
import React, { useState } from 'react';
import { MoreVertical, Trash2, FolderOpen, Copy } from 'lucide-react';
import { Note, Folder } from '../types/Note';

interface NoteCardProps {
  note: Note;
  folders: Folder[];
  onDelete: (noteId: string) => void;
  onMoveToFolder: (noteId: string, folderId: string) => void;
}

const NoteCard = ({ note, folders, onDelete, onMoveToFolder }: NoteCardProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showMoveMenu, setShowMoveMenu] = useState(false);

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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group">
      <div className="p-6">
        {/* Header with menu */}
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800 line-clamp-2 flex-1">
            {note.title}
          </h3>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-8 bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-[160px]">
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
                  <FolderOpen className="w-4 h-4" />
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
            
            {showMoveMenu && (
              <div className="absolute right-0 top-24 bg-white border border-slate-200 rounded-lg shadow-lg z-20 min-w-[140px]">
                {folders.filter(f => f.id !== 'all' && f.id !== note.folder).map((folder) => (
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
        </div>

        {/* Summary */}
        <p className="text-slate-600 text-sm line-clamp-4 mb-4">
          {note.summary}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>{formatDate(note.createdAt)}</span>
          <span className="capitalize">{note.folder === 'all' ? 'general' : note.folder}</span>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
