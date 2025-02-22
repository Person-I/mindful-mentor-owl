
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import { PlusCircle, Save, Trash2, Clock } from "lucide-react";
import { Note } from "@/types/note";
import { noteService } from "@/services/noteService";
import { useToast } from "@/hooks/use-toast";

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [content, setContent] = useState<string>("");
  const [hasChanges, setHasChanges] = useState(false);
  const { noteId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadNotes();
  }, []);

  useEffect(() => {
    if (noteId) {
      loadNote(noteId);
    }
  }, [noteId]);

  useEffect(() => {
    if (selectedNote) {
      setHasChanges(content !== selectedNote.content);
    }
  }, [content, selectedNote]);

  const loadNotes = async () => {
    try {
      const data = await noteService.getNotes();
      setNotes(data);
      if (data.length && !noteId) {
        navigate(`/notes/${data[0].id}`);
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
      navigate(`/notes/${newNote.id}`);
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
          navigate(`/notes/${remainingNotes[0].id}`);
        } else {
          navigate('/notes');
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
    <div className="h-[calc(100vh-5rem)] flex gap-4">
      {/* Sidebar */}
      <div className="w-64 glass rounded-lg p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Notes</h2>
          <button
            onClick={createNote}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`p-3 rounded-lg cursor-pointer flex flex-col group ${
                note.id === selectedNote?.id ? "bg-secondary" : "hover:bg-secondary/50"
              }`}
              onClick={() => navigate(`/notes/${note.id}`)}
            >
              <div className="flex items-center justify-between">
                <span className="truncate font-medium">{note.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(note.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-background rounded transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-1 mt-1 text-xs text-foreground/60">
                <Clock className="w-3 h-3" />
                <span>{formatDate(note.updatedAt)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      {selectedNote ? (
        <div className="flex-1 glass rounded-lg p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-foreground/60">
              <div>Created: {formatDate(selectedNote.createdAt)}</div>
              <div>Updated: {formatDate(selectedNote.updatedAt)}</div>
            </div>
            <button
              onClick={updateNote}
              disabled={!hasChanges}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                ${hasChanges 
                  ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                  : "bg-secondary text-secondary-foreground cursor-not-allowed"}`}
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>
          <div className="flex-1">
            <MDEditor
              value={content}
              onChange={(val) => setContent(val || "")}
              preview="edit"
              className="h-full"
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 glass rounded-lg p-4 flex items-center justify-center">
          <p className="text-foreground/70">Select a note or create a new one</p>
        </div>
      )}
    </div>
  );
};

export default Notes;
