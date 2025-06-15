
import React from 'react';
import { FileText } from 'lucide-react';
import NoteCard from './NoteCard';
import { Note, Folder } from '../types/Note';

interface NotesGridProps {
  notes: Note[];
  folders: Folder[];
  onDelete: (noteId: string) => void;
  onMoveToFolder: (noteId: string, folderId: string) => void;
  onDragStart: (e: React.DragEvent, noteId: string) => void;
  onNoteClick: (note: Note) => void;
  selectedNotes: string[];
  onSelect: (noteId: string) => void;
  folderName?: string;
}

const NotesGrid = ({
  notes,
  folders,
  onDelete,
  onMoveToFolder,
  onDragStart,
  onNoteClick,
  selectedNotes,
  onSelect,
  folderName
}: NotesGridProps) => {
  if (notes.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 bg-slate-200 rounded-2xl mx-auto mb-4 flex items-center justify-center">
          <FileText className="w-10 h-10 text-slate-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-600 mb-2">
          No notes in {folderName}
        </h3>
        <p className="text-slate-500">
          Record your first note or move some from other folders
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 animate-scale-in">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          folders={folders}
          onDelete={onDelete}
          onMoveToFolder={onMoveToFolder}
          onDragStart={onDragStart}
          onNoteClick={onNoteClick}
          isSelected={selectedNotes.includes(note.id)}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

export default NotesGrid;
