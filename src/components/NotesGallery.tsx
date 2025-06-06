
import React, { useState } from 'react';
import { Mic, FileText } from 'lucide-react';
import NoteCard from './NoteCard';
import FolderDock from './FolderDock';
import CreateFolderDialog from './CreateFolderDialog';
import { Note, Folder as FolderType } from '../types/Note';

interface NotesGalleryProps {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  onStartRecording: () => void;
}

const NotesGallery = ({ notes, setNotes, onStartRecording }: NotesGalleryProps) => {
  const [selectedFolder, setSelectedFolder] = useState('home');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [folders, setFolders] = useState<FolderType[]>([
    { id: 'home', name: 'Home', icon: 'home' },
    { id: 'work', name: 'Work', icon: 'briefcase' },
    { id: 'personal', name: 'Personal', icon: 'user' },
    { id: 'play', name: 'Play', icon: 'gamepad' }
  ]);

  const filteredNotes = notes.filter(note => note.folder === selectedFolder);

  const handleDeleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
  };

  const handleMoveToFolder = (noteId: string, folderId: string) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId ? { ...note, folder: folderId } : note
    ));
  };

  const handleDragStart = (e: React.DragEvent, noteId: string) => {
    e.dataTransfer.setData('text/plain', noteId);
  };

  const handleCreateFolder = (name: string, icon: string) => {
    const newFolder: FolderType = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      icon,
      isCustom: true
    };
    setFolders(prev => [...prev, newFolder]);
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <h1 className="text-2xl font-bold text-slate-800">
          {folders.find(f => f.id === selectedFolder)?.name || 'Notes'}
        </h1>
        <button
          onClick={onStartRecording}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105"
        >
          <Mic className="w-4 h-4" />
          Record
        </button>
      </div>

      {/* Notes Grid */}
      <div className="px-6">
        {filteredNotes.length > 0 ? (
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-6">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                folders={folders}
                onDelete={handleDeleteNote}
                onMoveToFolder={handleMoveToFolder}
                onDragStart={handleDragStart}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-200 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <FileText className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-600 mb-2">
              No notes in {folders.find(f => f.id === selectedFolder)?.name}
            </h3>
            <p className="text-slate-500">
              Record your first note or move some from other folders
            </p>
          </div>
        )}
      </div>

      {/* Folder Dock */}
      <FolderDock
        folders={folders}
        selectedFolder={selectedFolder}
        onFolderSelect={setSelectedFolder}
        onCreateFolder={() => setShowCreateDialog(true)}
      />

      {/* Create Folder Dialog */}
      <CreateFolderDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onCreateFolder={handleCreateFolder}
      />
    </div>
  );
};

export default NotesGallery;
