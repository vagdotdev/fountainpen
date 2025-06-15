import React, { useState, useEffect } from 'react';
import { Mic, FileText, Trash2, X, Undo } from 'lucide-react';
import NoteCard from './NoteCard';
import FolderDock from './FolderDock';
import CreateFolderDialog from './CreateFolderDialog';
import NoteView from './NoteView';
import { Note, Folder as FolderType } from '../types/Note';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface NotesGalleryProps {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  onStartRecording: () => void;
}

const NotesGallery = ({ notes, setNotes, onStartRecording }: NotesGalleryProps) => {
  const [selectedFolder, setSelectedFolder] = useState('library');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [folders, setFolders] = useState<FolderType[]>([
    { id: 'library', name: 'Library', type: 'folder' },
    { id: 'walkins', name: 'Walkins', type: 'folder' },
    { id: 'ycp', name: 'YCP', type: 'folder' },
    { id: 'think', name: 'Think', type: 'folder' }
  ]);
  const [deletedFolder, setDeletedFolder] = useState<FolderType | null>(null);
  const [deletedNotes, setDeletedNotes] = useState<Note[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (deletedNotes.length > 0) {
      const timer = setTimeout(() => {
        setDeletedNotes([]);
      }, 5000); // 5 seconds to undo
      return () => clearTimeout(timer);
    }
  }, [deletedNotes]);

  const filteredNotes = notes.filter(note => note.folder === selectedFolder);

  const handleDeleteNote = (noteId: string) => {
    const noteToDelete = notes.find(n => n.id === noteId);
    if (noteToDelete) {
        setNotes(prev => prev.filter(note => note.id !== noteId));
        setDeletedNotes([noteToDelete]);
    }
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

  const handleDeleteFolder = (folderId: string) => {
    if (folderId === 'library') {
      toast({
        title: "Cannot delete Library",
        description: "The Library folder cannot be deleted as it's the default folder.",
        variant: "destructive"
      });
      return;
    }

    const folderToDelete = folders.find(f => f.id === folderId);
    if (!folderToDelete) return;

    // Move all notes from deleted folder to library
    const notesInFolder = notes.filter(note => note.folder === folderId);
    setNotes(prev => prev.map(note => 
      note.folder === folderId ? { ...note, folder: 'library' } : note
    ));

    // Remove folder
    setFolders(prev => prev.filter(f => f.id !== folderId));
    setDeletedFolder(folderToDelete);

    // If currently viewing the deleted folder, switch to library
    if (selectedFolder === folderId) {
      setSelectedFolder('library');
    }

    // Show toast with undo option
    toast({
      title: `Deleted folder "${folderToDelete.name}"`,
      description: `${notesInFolder.length} notes moved to Library`,
      action: (
        <button
          onClick={handleUndoDelete}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
        >
          Undo
        </button>
      )
    });
  };

  const handleUndoDelete = () => {
    if (!deletedFolder) return;

    // Restore the folder
    setFolders(prev => [...prev, deletedFolder]);
    
    // Move notes back to the restored folder
    setNotes(prev => prev.map(note => 
      note.folder === 'library' ? { ...note, folder: deletedFolder.id } : note
    ));

    setDeletedFolder(null);
    
    toast({
      title: "Folder restored",
      description: `"${deletedFolder.name}" has been restored with its notes.`
    });
  };

  const handleUndoDeleteNotes = () => {
    setNotes(prev => [...deletedNotes, ...prev]);
    setDeletedNotes([]);
  };

  const handleNoteClick = (note: Note) => {
    if (selectedNotes.length > 0) {
      return; // Do not open note when in selection mode
    }
    setSelectedNote(note);
  };
  
  const handleToggleSelection = (noteId: string) => {
    if (selectedNote) {
      handleCloseNoteView();
    }
    setSelectedNotes(prev =>
      prev.includes(noteId)
        ? prev.filter(id => id !== noteId)
        : [...prev, noteId]
    );
  };

  const handleClearSelection = () => {
    setSelectedNotes([]);
  };

  const handleDeleteSelected = () => {
    const notesToDelete = notes.filter(note => selectedNotes.includes(note.id));
    if (notesToDelete.length > 0) {
      setNotes(prev => prev.filter(note => !selectedNotes.includes(note.id)));
      setDeletedNotes(notesToDelete);
    }
    setSelectedNotes([]);
  };

  const handleCloseNoteView = () => {
    setSelectedNote(null);
  };

  const handleSaveNote = (updatedNote: Note) => {
    setNotes(prev => prev.map(note => 
      note.id === updatedNote.id ? updatedNote : note
    ));
    setSelectedNote(null);
    toast({ title: "Note saved!" });
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

      {/* Notes Grid - Kanban Style */}
      <div className="px-6 pb-40">
        {filteredNotes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 animate-scale-in" key={selectedFolder}>
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                folders={folders}
                onDelete={handleDeleteNote}
                onMoveToFolder={handleMoveToFolder}
                onDragStart={handleDragStart}
                onNoteClick={handleNoteClick}
                isSelected={selectedNotes.includes(note.id)}
                onSelect={handleToggleSelection}
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
      
      {/* Selection Action Bar */}
      {selectedNotes.length > 0 && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-40 animate-scale-in">
          <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm shadow-xl rounded-full p-2 border border-border">
            <span className="text-sm font-medium text-foreground px-3">{selectedNotes.length} selected</span>
            <Button
              size="sm"
              className="bg-slate-800 text-white hover:bg-slate-700 rounded-full"
              onClick={handleDeleteSelected}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="rounded-full"
              onClick={handleClearSelection}
            >
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Undo Delete Notification */}
      {deletedNotes.length > 0 && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 animate-scale-in">
          <div className="flex items-center gap-3 bg-slate-800 text-white shadow-xl rounded-full p-2 pl-2 pr-4 border border-slate-700">
            <button
              onClick={handleUndoDeleteNotes}
              className="flex items-center gap-1.5 bg-slate-600 hover:bg-slate-500 rounded-full px-3 py-1 text-sm font-medium transition-colors"
            >
              <Undo className="w-3.5 h-3.5" />
              <span>undo</span>
            </button>
            <span className="text-sm text-slate-300">
              {deletedNotes.length > 1 ? `${deletedNotes.length} notes deleted` : 'note deleted'}
            </span>
          </div>
        </div>
      )}

      {/* Folder Dock */}
      <FolderDock
        folders={folders}
        selectedFolder={selectedFolder}
        onFolderSelect={setSelectedFolder}
        onCreateFolder={() => setShowCreateDialog(true)}
        onDeleteFolder={handleDeleteFolder}
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
        <NoteView
          initialNote={selectedNote}
          onSave={handleSaveNote}
          onClose={handleCloseNoteView}
        />
      )}
    </div>
  );
};

export default NotesGallery;
