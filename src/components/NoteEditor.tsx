import MDEditor from "@uiw/react-md-editor";
import { Save } from "lucide-react";
import { Note } from "@/types/note";

interface NoteEditorProps {
  note: Note;
  content: string;
  hasChanges: boolean;
  onContentChange: (content: string) => void;
  onSave: () => void;
}

const NoteEditor = ({ note, content, hasChanges, onContentChange, onSave }: NoteEditorProps) => {
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
    <div className="flex-1 glass rounded-lg p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-foreground/60">
          <div>Created: {formatDate(note.created_at)}</div>
          <div>Updated: {formatDate(note.updated_at)}</div>
        </div>
        <button
          onClick={onSave}
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
          onChange={(val) => onContentChange(val || "")}
          preview="edit"
          className="h-full min-h-[300px]"
        />
      </div>
    </div>
  );
};

export default NoteEditor; 