
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Note, Folder as FolderType } from '../types/Note';
import { Button } from '@/components/ui/button';

interface UseNotesProps {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}

export const useNotes = ({ notes, setNotes }: UseNotesProps) => {
  const [selectedFolder, setSelectedFolder] = useState('library');
  const [folders, setFolders] = useState<FolderType[]>([
    { id: 'library', name: 'Library', type: 'folder' },
    { id: 'walkins', name: 'Walkins', type: 'folder' },
    { id: 'ycp', name: 'YCP', type: 'folder' },
    { id: 'think', name: 'Think', type: 'folder' }
  ]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [deletedFolder, setDeletedFolder] = useState<FolderType | null>(null);
  const [deletedNotes, setDeletedNotes] = useState<Note[]>([]);
  const [mergedNotesInfo, setMergedNotesInfo] = useState<{ superNote: Note, originalNotes: Note[] } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (deletedNotes.length > 0) {
      const timer = setTimeout(() => {
        setDeletedNotes([]);
      }, 5000); // 5 seconds to undo
      return () => clearTimeout(timer);
    }
  }, [deletedNotes]);

  useEffect(() => {
    if (mergedNotesInfo) {
      const timer = setTimeout(() => {
        setMergedNotesInfo(null);
      }, 5000); // 5 seconds to undo
      return () => clearTimeout(timer);
    }
  }, [mergedNotesInfo]);

  const filteredNotes = notes.filter(note => note.folder === selectedFolder);
  const currentFolder = folders.find(f => f.id === selectedFolder);

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

  const handleUndoDelete = () => {
    if (!deletedFolder) return;

    setFolders(prev => [...prev, deletedFolder]);
    
    setNotes(prev => prev.map(note => 
      note.folder === 'library' ? { ...note, folder: deletedFolder.id } : note
    ));

    setDeletedFolder(null);
    
    toast({
      title: "Folder restored",
      description: `"${deletedFolder.name}" has been restored with its notes.`
    });
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

    const notesInFolder = notes.filter(note => note.folder === folderId);
    setNotes(prev => prev.map(note => 
      note.folder === folderId ? { ...note, folder: 'library' } : note
    ));

    setFolders(prev => prev.filter(f => f.id !== folderId));
    setDeletedFolder(folderToDelete);

    if (selectedFolder === folderId) {
      setSelectedFolder('library');
    }

    toast({
      title: `Deleted folder "${folderToDelete.name}"`,
      description: `${notesInFolder.length} notes moved to Library`,
      action: (
        <Button
          onClick={handleUndoDelete}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
        >
          Undo
        </Button>
      )
    });
  };
  
  const handleUndoDeleteNotes = () => {
    setNotes(prev => [...deletedNotes, ...prev]);
    setDeletedNotes([]);
  };

  const handleSuperNote = () => {
    const notesToMerge = notes.filter(note => selectedNotes.includes(note.id));
    if (notesToMerge.length < 2) return;

    const newTitle = notesToMerge.map(n => n.title).join(' & ');
    const newSummary = notesToMerge.map(n => n.summary).join('\n\n---\n\n');
    const newTranscript = notesToMerge.map(n => n.transcript).join('\n\n---\n\n');

    const superNote: Note = {
      id: Date.now().toString(),
      title: `Super Note: ${newTitle}`,
      summary: newSummary,
      transcript: newTranscript,
      createdAt: new Date(),
      folder: selectedFolder,
    };

    setNotes(prev => [superNote, ...prev.filter(note => !selectedNotes.includes(note.id))]);
    setMergedNotesInfo({ superNote, originalNotes: notesToMerge });
    setSelectedNotes([]);
  };

  const handleUndoSuperNote = () => {
    if (!mergedNotesInfo) return;
    const { superNote, originalNotes } = mergedNotesInfo;
    setNotes(prev => [
      ...originalNotes,
      ...prev.filter(note => note.id !== superNote.id)
    ]);
    setMergedNotesInfo(null);
  };
  
  const handleNoteClick = (note: Note) => {
    if (selectedNotes.length > 0) return;
    setSelectedNote(note);
  };
  
  const handleToggleSelection = (noteId: string) => {
    if (selectedNote) handleCloseNoteView();
    setSelectedNotes(prev =>
      prev.includes(noteId)
        ? prev.filter(id => id !== noteId)
        : [...prev, noteId]
    );
  };

  const handleClearSelection = () => setSelectedNotes([]);

  const handleDeleteSelected = () => {
    const notesToDelete = notes.filter(note => selectedNotes.includes(note.id));
    if (notesToDelete.length > 0) {
      setNotes(prev => prev.filter(note => !selectedNotes.includes(note.id)));
      setDeletedNotes(notesToDelete);
    }
    setSelectedNotes([]);
  };

  const handleCloseNoteView = () => setSelectedNote(null);
  
  const handleSaveNote = (updatedNote: Note) => {
    setNotes(prev => prev.map(note => 
      note.id === updatedNote.id ? updatedNote : note
    ));
    setSelectedNote(null);
    toast({ title: "Note saved!" });
  };
  
  const handleDragStart = (e: React.DragEvent, noteId: string) => {
    e.dataTransfer.setData('text/plain', noteId);
  };

  return {
    folders,
    selectedFolder,
    selectedNote,
    selectedNotes,
    deletedNotes,
    mergedNotesInfo,
    filteredNotes,
    currentFolder,
    setSelectedFolder,
    handleDeleteNote,
    handleMoveToFolder,
    handleDragStart,
    handleDropNote,
    handleCreateFolder,
    handleDeleteFolder,
    handleUndoDeleteNotes,
    handleSuperNote,
    handleUndoSuperNote,
    handleNoteClick,
    handleToggleSelection,
    handleClearSelection,
    handleDeleteSelected,
    handleCloseNoteView,
    handleSaveNote,
  };
};
