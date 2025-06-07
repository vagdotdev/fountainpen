
import React, { useState } from 'react';
import { Mic, FileText } from 'lucide-react';
import NoteCard from './NoteCard';
import FolderDock from './FolderDock';
import CreateFolderDialog from './CreateFolderDialog';
import RecordingCard from './RecordingCard';
import { Note, Folder as FolderType } from '../types/Note';

interface NotesGalleryProps {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  onStartRecording: () => void;
}

const NotesGallery = ({ notes, setNotes, onStartRecording }: NotesGalleryProps) => {
  const [selectedFolder, setSelectedFolder] = useState('home');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [folders, setFolders] = useState<FolderType[]>([
    { id: 'home', name: 'Home', type: 'folder' },
    { id: 'walkins', name: 'Walkins', type: 'folder' },
    { id: 'ycp', name: 'YCP', type: 'folder' },
    { id: 'think', name: 'Think', type: 'folder' }
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

  const handleDropNote = (noteId: string, folderId: string) => {
    handleMoveToFolder(noteId, folderId);
    console.log(`Note ${noteId} moved to folder ${folderId}`);
  };

  const handleCreateFolder = (name: string, type: string) => {
    const newFolder: FolderType = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      type,
      isCustom: true
    };
    setFolders(prev => [...prev, newFolder]);
  };

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
  };

  const handleCloseNoteView = () => {
    setSelectedNote(null);
  };

  const handleSaveNote = () => {
    if (selectedNote) {
      setNotes(prev => prev.map(note => 
        note.id === selectedNote.id ? selectedNote : note
      ));
      setSelectedNote(null);
    }
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    console.log('Copied to clipboard!');
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
                onNoteClick={handleNoteClick}
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
        onDropNote={handleDropNote}
      />

      {/* Create Folder Dialog */}
      <CreateFolderDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onCreateFolder={handleCreateFolder}
      />

      {/* Note View */}
      {selectedNote && (
        <RecordingCard
          isRecording={false}
          isTranscribing={false}
          transcript={selectedNote.transcript}
          summary={selectedNote.summary}
          title={selectedNote.title}
          onSave={handleSaveNote}
          onClose={handleCloseNoteView}
          onCopy={handleCopyToClipboard}
          setTitle={(title) => setSelectedNote(prev => prev ? {...prev, title} : null)}
          setSummary={(summary) => setSelectedNote(prev => prev ? {...prev, summary} : null)}
        />
      )}
    </div>
  );
};

export default NotesGallery;
