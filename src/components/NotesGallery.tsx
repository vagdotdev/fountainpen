
import React, { useState } from 'react';
import { Plus, Folder, Briefcase, User, Gamepad2, Mic } from 'lucide-react';
import NoteCard from './NoteCard';
import { Note, Folder as FolderType } from '../types/Note';

interface NotesGalleryProps {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  onStartRecording: () => void;
}

const NotesGallery = ({ notes, setNotes, onStartRecording }: NotesGalleryProps) => {
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [folders] = useState<FolderType[]>([
    { id: 'all', name: 'All Notes', icon: 'folder' },
    { id: 'work', name: 'Work', icon: 'briefcase' },
    { id: 'personal', name: 'Personal', icon: 'user' },
    { id: 'play', name: 'Play', icon: 'gamepad' }
  ]);

  const filteredNotes = selectedFolder === 'all' 
    ? notes 
    : notes.filter(note => note.folder === selectedFolder);

  const handleDeleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
  };

  const handleMoveToFolder = (noteId: string, folderId: string) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId ? { ...note, folder: folderId } : note
    ));
  };

  const getFolderIcon = (iconName: string) => {
    switch (iconName) {
      case 'briefcase':
        return <Briefcase className="w-5 h-5" />;
      case 'user':
        return <User className="w-5 h-5" />;
      case 'gamepad':
        return <Gamepad2 className="w-5 h-5" />;
      default:
        return <Folder className="w-5 h-5" />;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Voice Notes</h1>
        <button
          onClick={onStartRecording}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105"
        >
          <Mic className="w-5 h-5" />
          New Recording
        </button>
      </div>

      {/* Folder Navigation */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {folders.map((folder) => (
          <button
            key={folder.id}
            onClick={() => setSelectedFolder(folder.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              selectedFolder === folder.id
                ? 'bg-blue-500 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {getFolderIcon(folder.icon)}
            {folder.name}
          </button>
        ))}
      </div>

      {/* Notes Grid */}
      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              folders={folders}
              onDelete={handleDeleteNote}
              onMoveToFolder={handleMoveToFolder}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Folder className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-600 mb-2">
            {selectedFolder === 'all' ? 'No notes yet' : `No notes in ${folders.find(f => f.id === selectedFolder)?.name}`}
          </h3>
          <p className="text-slate-500">
            {selectedFolder === 'all' 
              ? 'Start recording to create your first note'
              : 'Move some notes to this folder or record new ones'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default NotesGallery;
