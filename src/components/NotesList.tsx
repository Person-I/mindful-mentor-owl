import React from "react";
import { useNavigate } from "react-router-dom";
import { Note } from "@/types/note";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Save, Trash2, Clock } from "lucide-react";


interface NotesListProps {
  notes: Note[];
  selectedNoteId: string | null;
  onDeleteNote: (id: string) => void;
  isVisible: boolean;
}

const NotesList: React.FC<NotesListProps> = ({ notes, selectedNoteId, onDeleteNote, isVisible }) => {
  const navigate = useNavigate();

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
    <div className={`w-64 glass rounded-lg p-4 flex flex-col ${isVisible ? 'block' : 'hidden'} md:block`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Notes</h2>
        <button
          onClick={() => navigate('/knowledge-base/new')}
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
              note.id === selectedNoteId ? "bg-secondary" : "hover:bg-secondary/50"
            }`}
            onClick={() => navigate(`/knowledge-base/${note.id}`)}
          >
            <div className="flex items-center justify-between">
              <span className="truncate font-medium">{note.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteNote(note.id);
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
  );
};

export default NotesList; 