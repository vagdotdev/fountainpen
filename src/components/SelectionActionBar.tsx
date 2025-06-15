
import React from 'react';
import { Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SelectionActionBarProps {
  selectedCount: number;
  onSuperNote: () => void;
  onDeleteSelected: () => void;
  onClearSelection: () => void;
}

const SelectionActionBar = ({
  selectedCount,
  onSuperNote,
  onDeleteSelected,
  onClearSelection,
}: SelectionActionBarProps) => {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-40 animate-scale-in">
      <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm shadow-xl rounded-full p-2 border border-border">
        <span className="text-sm font-medium text-foreground px-3">{selectedCount} selected</span>
        {selectedCount > 1 && (
           <Button
            size="sm"
            className="font-semibold text-white rounded-full bg-gradient-to-r from-supernote to-orange-500 animate-subtle-pulse bg-[length:200%_auto] animate-shine"
            onClick={onSuperNote}
          >
            Super Note
          </Button>
        )}
        <Button
          size="sm"
          className="bg-slate-800 text-white hover:bg-slate-700 rounded-full"
          onClick={onDeleteSelected}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="rounded-full"
          onClick={onClearSelection}
        >
          <X className="w-4 h-4 mr-2" />
          Clear
        </Button>
      </div>
    </div>
  );
};

export default SelectionActionBar;
