
import React, { useState } from 'react';
import { MoreVertical, Trash2, Copy, X, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { Note, Folder } from '../types/Note';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NoteCardProps {
  note: Note;
  folders: Folder[];
  onDelete: (noteId: string) => void;
  onMoveToFolder: (noteId: string, folderId: string) => void;
  onDragStart: (e: React.DragEvent, noteId: string) => void;
  onClick: () => void;
  isSelected: boolean;
  isMerging: boolean;
  isNewlyMerged?: boolean;
  isExpanded: boolean;
}

const NoteCard = ({ note, folders, onDelete, onMoveToFolder, onDragStart, onClick, isSelected, isMerging, isNewlyMerged = false, isExpanded }: NoteCardProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(prev => !prev);
    setShowMoveMenu(false);
  };
  
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(note.summary);
    setShowMenu(false);
    console.log('Note copied to clipboard!');
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(note.id);
    setShowMenu(false);
  };

  const handleMoveToFolder = (e: React.MouseEvent, folderId: string) => {
    e.stopPropagation();
    onMoveToFolder(note.id, folderId);
    setShowMoveMenu(false);
    setShowMenu(false);
  };

  const handleToggleMoveMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMoveMenu(prev => !prev);
  }

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    onDragStart(e, note.id);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const formatDate = (date: Date) => {
    return format(date, 'MMM dd yyyy');
  };

  const cardContent = (
    <div
      draggable={!isExpanded}
      onDragStart={isExpanded ? undefined : handleDragStart}
      onDragEnd={isExpanded ? undefined : handleDragEnd}
      className={cn(
        'bg-white p-5 cursor-pointer hover:shadow-lg transition-all duration-200 flex flex-col',
        'rounded-2xl',
        isDragging && 'opacity-50',
        isSelected && !isExpanded ? 'border-black ring-2 ring-black/10' : 'border-slate-200 border',
        isMerging && isSelected && 'animate-merge-out',
        isExpanded ? 'h-auto min-h-[16rem]' : 'h-64'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h3 className={cn("text-sm font-semibold text-slate-800 leading-tight pr-2 flex-1", !isExpanded && "line-clamp-3")}>
          {note.title}
        </h3>
        <button
          onClick={isExpanded ? (e) => { e.stopPropagation(); onClick() } : handleMenuClick}
          className="p-1 text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0 z-10"
        >
          {isExpanded ? <X className="w-5 h-5" /> : <MoreVertical className="w-4 h-4" />}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 mb-4 overflow-y-auto">
        <p className={cn("text-xs text-slate-600 leading-relaxed", !isExpanded && "line-clamp-6")}>
          {isExpanded && showTranscript ? note.transcript : note.summary}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto">
        <span className="text-xs text-slate-400 font-times">
          {formatDate(note.createdAt)}
        </span>
        {isExpanded && note.transcript && (
          <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); setShowTranscript(p => !p)}}>
            <FileText className="mr-2" />
            {showTranscript ? 'Show Summary' : 'Show Transcript'}
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="relative group" onClick={isExpanded ? undefined : onClick}>
      <div
        className={cn(
          'rounded-2xl shadow-sm transition-all duration-200',
          isNewlyMerged && !isExpanded ? 'p-0.5 bg-gradient-to-r from-supernote to-orange-500' : ''
        )}
      >
        <div className={cn(isNewlyMerged && !isExpanded ? 'rounded-[15px]' : 'rounded-2xl')}>
          {cardContent}
        </div>
      </div>
      
      {!isExpanded && (
        <>
          {/* Selection Indicator */}
          <div className="absolute bottom-4 right-4 pointer-events-none">
            {isSelected ? (
              <div className="w-6 h-6 flex items-center justify-center rounded-full bg-black text-white border-2 border-white shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full border-2 border-slate-300 bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </div>

          {/* Context Menu */}
          {showMenu && (
            <div className="absolute top-10 right-0 bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-[160px]">
              <button onClick={handleCopy} className="flex items-center gap-2 w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 first:rounded-t-lg">
                <Copy className="w-4 h-4" /> Copy
              </button>
              <button onClick={handleToggleMoveMenu} className="flex items-center gap-2 w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50">
                Move to folder
              </button>
              {showMoveMenu && (
                <div className="bg-white border-t border-slate-200 z-20">
                  {folders.filter(f => f.id !== note.folder).map((folder) => (
                    <button key={folder.id} onClick={(e) => handleMoveToFolder(e, folder.id)} className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50">
                      {folder.name}
                    </button>
                  ))}
                </div>
              )}
              <button onClick={handleDelete} className="flex items-center gap-2 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 last:rounded-b-lg">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NoteCard;
