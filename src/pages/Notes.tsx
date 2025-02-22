import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Note } from "@/types/note";
import { noteService } from "@/services/noteService";
import { useToast } from "@/hooks/use-toast";
import NoteEditor from "@/components/NoteEditor";
import { Toaster } from "@/components/ui/toaster";
import { VoiceAssistant } from "@/components/VoiceAssistant";
import NotesList from "@/components/NotesList";
import { useUser } from "@/context/UserIDContext";

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [content, setContent] = useState<string>("");
  const [hasChanges, setHasChanges] = useState(false);
  const { noteId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isListVisible, setIsListVisible] = useState(true);
  const userId = useUser().userId;

  useEffect(() => {
    loadNotes();
  }, []);

  useEffect(() => {
    if (noteId) {
      if (noteId === 'new') {
        createNote();
      } else {
        loadNote(noteId);
      }
    }
  }, [noteId]);

  useEffect(() => {
    if (selectedNote) {
      setHasChanges(content !== selectedNote.content);
    }
  }, [content, selectedNote]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsListVisible(false);
      } else {
        setIsListVisible(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadNotes = async () => {
    try {
      const data = await noteService.getNotes(userId);
      setNotes(data);
      if (data.length && !noteId) {
        navigate(`/knowledge-base/${data[0].id}`);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load notes",
        variant: "destructive",
      });
    }
  };

  const loadNote = async (id: string) => {
    try {
      const note = await noteService.getNote(id);
      setSelectedNote(note);
      setContent(note.content);
      setHasChanges(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load note",
        variant: "destructive",
      });
    }
  };

  const createNote = async () => {
    try {
      const newNote = await noteService.createNote({
        title: "New Note",
        content: "# New Note\n\nStart writing here...",
      });
      setNotes(prev => [newNote, ...prev]);
      navigate(`/knowledge-base/${newNote.id}`);
      toast({
        title: "Success",
        description: "New note created",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create note",
        variant: "destructive",
      });
    }
  };

  const updateNote = async () => {
    if (!selectedNote || !hasChanges) return;
    try {
      const updated = await noteService.updateNote(selectedNote.id, {
        content,
        title: content.split('\n')[0].replace('# ', ''),
      });
      setNotes(prev => prev.map(n => n.id === updated.id ? updated : n));
      setSelectedNote(updated);
      setHasChanges(false);
      toast({
        title: "Success",
        description: "Note updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update note",
        variant: "destructive",
      });
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await noteService.deleteNote(id);
      setNotes(prev => prev.filter(n => n.id !== id));
      if (selectedNote?.id === id) {
        const remainingNotes = notes.filter(n => n.id !== id);
        if (remainingNotes.length) {
          navigate(`/knowledge-base/${remainingNotes[0].id}`);
        } else {
          navigate('/knowledge-base');
        }
      }
      toast({
        title: "Success",
        description: "Note deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };


  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col md:flex-row gap-4">
      <Toaster />

      {/* Toggle button for mobile */}
      <button
        className="md:hidden p-2 bg-primary text-primary-foreground rounded-lg"
        onClick={() => setIsListVisible(!isListVisible)}
      >
        {isListVisible ? 'Hide Notes' : 'Show Notes'}
      </button>

      <NotesList
        notes={notes}
        selectedNoteId={selectedNote?.id || null}
        onDeleteNote={deleteNote}
        isVisible={isListVisible}
      />

      {/* Editor */}
      {selectedNote ? (
        <NoteEditor
          note={selectedNote}
          content={content}
          hasChanges={hasChanges}
          onContentChange={setContent}
          onSave={updateNote}
        />
      ) : (
        <div className="flex-1 glass rounded-lg p-4 flex items-center justify-center">
          <p className="text-foreground/70">Select a note or create a new one</p>
        </div>
      )}

      <VoiceAssistant />
    </div>
  );
};

export default Notes;
