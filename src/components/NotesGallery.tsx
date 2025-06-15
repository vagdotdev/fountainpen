
import React, { useState } from 'react';
import FolderDock from './FolderDock';
import CreateFolderDialog from './CreateFolderDialog';
import NoteView from './NoteView';
import { Note } from '../types/Note';
import NotesGalleryHeader from './NotesGalleryHeader';
import NotesGrid from './NotesGrid';
import SelectionActionBar from './SelectionActionBar';
import UndoBar from './UndoBar';
import { useNotes } from '../hooks/useNotes';

interface NotesGalleryProps {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  onStartRecording: () => void;
}

const NotesGallery = ({ notes, setNotes, onStartRecording }: NotesGalleryProps) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  const {
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
  } = useNotes({ notes, setNotes });

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-24">
      <NotesGalleryHeader
        folderName={currentFolder?.name || 'Notes'}
        onStartRecording={onStartRecording}
      />

      <div className="px-6 pb-40" key={selectedFolder}>
        <NotesGrid
          notes={filteredNotes}
          folders={folders}
          onDelete={handleDeleteNote}
          onMoveToFolder={handleMoveToFolder}
          onDragStart={handleDragStart}
          onNoteClick={handleNoteClick}
          selectedNotes={selectedNotes}
          onSelect={handleToggleSelection}
          folderName={currentFolder?.name}
        />
      </div>
      
      <SelectionActionBar
        selectedCount={selectedNotes.length}
        onSuperNote={handleSuperNote}
        onDeleteSelected={handleDeleteSelected}
        onClearSelection={handleClearSelection}
      />

      <UndoBar
        isVisible={deletedNotes.length > 0}
        message={deletedNotes.length > 1 ? `${deletedNotes.length} notes deleted` : 'note deleted'}
        onUndo={handleUndoDeleteNotes}
      />
      
      {mergedNotesInfo && (
        <UndoBar
          isVisible={!!mergedNotesInfo}
          message={`${mergedNotesInfo.originalNotes.length} notes merged`}
          onUndo={handleUndoSuperNote}
        />
      )}

      <FolderDock
        folders={folders}
        selectedFolder={selectedFolder}
        onFolderSelect={setSelectedFolder}
        onCreateFolder={() => setShowCreateDialog(true)}
        onDeleteFolder={handleDeleteFolder}
        onDropNote={handleDropNote}
      />

      <CreateFolderDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onCreateFolder={(name, type) => {
          handleCreateFolder(name, type);
          setShowCreateDialog(false);
        }}
      />

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
