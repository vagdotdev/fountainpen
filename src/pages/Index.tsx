import React, { useState } from 'react';
import MicButton from '../components/MicButton';
import RecordingCard from '../components/RecordingCard';
import NotesGallery from '../components/NotesGallery';
import { Note } from '../types/Note';

const Index = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [showRecordingCard, setShowRecordingCard] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [currentSummary, setCurrentSummary] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);

  const handleStartRecording = () => {
    setIsRecording(true);
    setShowRecordingCard(true);
    console.log('Started recording...');
    
    // Simulate recording for demo
    setTimeout(() => {
      setIsRecording(false);
      setIsTranscribing(true);
      console.log('Recording finished, starting transcription...');
      
      // Simulate transcription and AI processing
      setTimeout(() => {
        const mockTranscript = "I had an amazing meeting today where we discussed the new project roadmap. The team is really excited about the upcoming features and we identified some key milestones for the next quarter. I think we're on track to deliver something really special.";
        const mockSummary = "Had a productive meeting about the new project roadmap. Team is excited about upcoming features and identified key milestones for next quarter. Project is on track to deliver something special.";
        const mockTitle = "Project Roadmap Meeting";
        
        setCurrentTranscript(mockTranscript);
        setCurrentSummary(mockSummary);
        setCurrentTitle(mockTitle);
        setIsTranscribing(false);
        console.log('Transcription completed!');
      }, 2000);
    }, 3000);
  };

  const handleSaveNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: currentTitle,
      summary: currentSummary,
      transcript: currentTranscript,
      createdAt: new Date(),
      folder: 'home'
    };
    
    setNotes(prev => [newNote, ...prev]);
    setShowRecordingCard(false);
    setCurrentTranscript('');
    setCurrentSummary('');
    setCurrentTitle('');
    console.log('Note saved successfully!');
  };

  const handleCloseCard = () => {
    setShowRecordingCard(false);
    setIsRecording(false);
    setIsTranscribing(false);
    setCurrentTranscript('');
    setCurrentSummary('');
    setCurrentTitle('');
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    console.log('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 relative">
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        {!showRecordingCard && notes.length === 0 && (
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-800 mb-4">Voice Notes</h1>
            <p className="text-xl text-slate-600">Tap the mic to start recording your thoughts</p>
          </div>
        )}
        
        {!showRecordingCard && (
          <MicButton onStartRecording={handleStartRecording} />
        )}
        
        {notes.length > 0 && !showRecordingCard && (
          <NotesGallery 
            notes={notes} 
            setNotes={setNotes}
            onStartRecording={handleStartRecording}
          />
        )}
      </div>

      {/* Recording Card Overlay */}
      {showRecordingCard && (
        <RecordingCard
          isRecording={isRecording}
          isTranscribing={isTranscribing}
          transcript={currentTranscript}
          summary={currentSummary}
          title={currentTitle}
          onSave={handleSaveNote}
          onClose={handleCloseCard}
          onCopy={handleCopyToClipboard}
          setTitle={setCurrentTitle}
          setSummary={setCurrentSummary}
        />
      )}
    </div>
  );
};

export default Index;
