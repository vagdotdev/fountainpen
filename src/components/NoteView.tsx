
import React, { useState } from 'react';
import { Note } from '../types/Note';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X, Save, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NoteViewProps {
  initialNote: Note;
  onSave: (updatedNote: Note) => void;
  onClose: () => void;
}

const NoteView = ({ initialNote, onSave, onClose }: NoteViewProps) => {
  const [editedNote, setEditedNote] = useState<Note>(initialNote);
  const { toast } = useToast();

  const handleSave = () => {
    onSave(editedNote);
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(editedNote.summary);
    toast({ title: "Note summary copied to clipboard!" });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-scale-in relative">
        <div className="p-6 border-b">
          <Input 
            value={editedNote.title}
            onChange={(e) => setEditedNote(prev => ({...prev, title: e.target.value}))}
            className="text-2xl font-bold border-none focus-visible:ring-transparent focus-visible:ring-offset-0 p-0 h-auto"
            placeholder="Note Title"
          />
        </div>
        <div className="p-6 flex-1 overflow-y-auto">
          <Textarea 
            value={editedNote.summary}
            onChange={(e) => setEditedNote(prev => ({...prev, summary: e.target.value}))}
            className="w-full h-full text-base border-none resize-none focus-visible:ring-transparent focus-visible:ring-offset-0 p-0 leading-relaxed"
            placeholder="Start writing your summary..."
            style={{minHeight: '200px'}}
          />
        </div>
        <div className="p-4 border-t flex items-center justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={handleCopySummary} className="text-slate-600">
                <Copy className="w-4 h-4 mr-2" />
                Copy
            </Button>
            <Button onClick={handleSave} className="bg-slate-900 text-white hover:bg-slate-800">
                <Save className="w-4 h-4 mr-2" />
                Save & Close
            </Button>
        </div>
        <button onClick={onClose} className="absolute top-3 right-3 p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default NoteView;
