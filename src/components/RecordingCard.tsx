
import React, { useState } from 'react';
import { Save, Copy, X, RotateCcw, Edit } from 'lucide-react';

interface RecordingCardProps {
  isRecording: boolean;
  isTranscribing: boolean;
  transcript: string;
  summary: string;
  title: string;
  onSave: () => void;
  onClose: () => void;
  onCopy: (text: string) => void;
  setTitle: (title: string) => void;
  setSummary: (summary: string) => void;
}

const RecordingCard = ({
  isRecording,
  isTranscribing,
  transcript,
  summary,
  title,
  onSave,
  onClose,
  onCopy,
  setTitle,
  setSummary
}: RecordingCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSummary, setEditedSummary] = useState(summary);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleFlip = () => {
    setIsAnimating(true);
    
    // Start the flip animation
    setTimeout(() => {
      setIsFlipped(!isFlipped);
    }, 350); // Mid-point of the animation
    
    // End animation state
    setTimeout(() => {
      setIsAnimating(false);
    }, 700); // Full duration of flip
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedSummary(summary);
  };

  const handleSaveEdit = () => {
    setSummary(editedSummary);
    setIsEditing(false);
  };

  const handleCopyTranscript = () => {
    onCopy(transcript);
  };

  const handleCopySummary = () => {
    onCopy(summary);
  };

  if (isRecording || isTranscribing) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 shadow-2xl animate-scale-in max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full mx-auto mb-6 flex items-center justify-center">
              {isRecording ? (
                <div className="w-6 h-6 bg-white rounded-sm animate-pulse" />
              ) : (
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
              )}
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              {isRecording ? 'Recording...' : 'Transcribing...'}
            </h3>
            <p className="text-slate-600">
              {isRecording ? 'Ramble as much as you want' : 'Processing your thoughts'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="relative max-w-2xl w-full">
        <div 
          className={`transform transition-transform duration-700 ${isFlipped ? 'rotate-y-180' : ''}`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {!isFlipped ? (
            // Front side - Summary view
            <div className="bg-white rounded-2xl p-8 shadow-2xl animate-scale-in min-h-[600px] flex flex-col" style={{ backfaceVisibility: 'hidden' }}>
              <div className="flex items-start justify-between mb-6">
                <button
                  onClick={handleFlip}
                  className={`flex items-center gap-2 p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
                >
                  <RotateCcw className="w-5 h-5" />
                  <span className="text-sm font-medium">Transcript</span>
                </button>
                <button
                  onClick={onClose}
                  className={`p-2 text-slate-400 hover:text-slate-600 transition-colors ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className={`mb-6 transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-2xl font-bold text-slate-800 w-full bg-transparent border-none outline-none focus:bg-slate-50 rounded px-2 py-1 transition-colors"
                  placeholder="Enter title..."
                />
              </div>

              <div className={`mb-8 flex-1 flex flex-col transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
                {isEditing ? (
                  <div className="flex-1 flex flex-col">
                    <textarea
                      value={editedSummary}
                      onChange={(e) => setEditedSummary(e.target.value)}
                      className="w-full flex-1 min-h-[300px] p-4 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg leading-relaxed"
                      placeholder="Edit your summary..."
                    />
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={handleSaveEdit}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col">
                    <div className="flex-1 overflow-y-auto">
                      <p className="text-slate-700 text-lg leading-relaxed">{summary}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className={`flex justify-between transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
                <button
                  onClick={handleCopySummary}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
                <button
                  onClick={onSave}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
              </div>
            </div>
          ) : (
            // Back side - Transcript view
            <div className="bg-white rounded-2xl p-8 shadow-2xl rotate-y-180 min-h-[600px] flex flex-col" style={{ backfaceVisibility: 'hidden' }}>
              <div className="flex items-start justify-between mb-6">
                <button
                  onClick={handleFlip}
                  className={`flex items-center gap-2 p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
                >
                  <RotateCcw className="w-5 h-5" />
                  <span className="text-sm font-medium">Summary</span>
                </button>
                <button
                  onClick={onClose}
                  className={`p-2 text-slate-400 hover:text-slate-600 transition-colors ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <h3 className={`text-2xl font-bold text-slate-800 mb-6 transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
                Full Transcript
              </h3>

              <div className={`mb-8 flex-1 overflow-y-auto transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
                <p className="text-slate-700 leading-relaxed text-lg">{transcript}</p>
              </div>

              <div className={`flex justify-between transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
                <button
                  onClick={handleCopyTranscript}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Copy Transcript
                </button>
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecordingCard;
