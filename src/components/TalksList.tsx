
import React from "react";
import { useNavigate } from "react-router-dom";
import { Talk } from "@/types/talk";
import { PlusCircle, Trash2, Clock, MessageCircle } from "lucide-react";

interface TalksListProps {
  talks: Talk[];
  selectedTalkId: string | null;
  onDeleteTalk: (id: string) => void;
  isVisible: boolean;
}

const TalksList: React.FC<TalksListProps> = ({ talks, selectedTalkId, onDeleteTalk, isVisible }) => {
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
        <h2 className="text-lg font-semibold">History</h2>
        <button
          onClick={() => navigate('/history/new')}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          <PlusCircle className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2">
        {talks.map((talk) => (
          <div
            key={talk.id}
            className={`p-3 rounded-lg cursor-pointer flex flex-col group ${
              talk.id === selectedTalkId ? "bg-secondary" : "hover:bg-secondary/50"
            }`}
            onClick={() => navigate(`/history/${talk.id}`)}
          >
            <div className="flex items-center justify-between">
              <span className="truncate font-medium">{talk.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteTalk(talk.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-background rounded transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-foreground/60">
              <Clock className="w-3 h-3" />
              <span>{formatDate(talk.updated_at)}</span>
              <MessageCircle className="w-3 h-3" />
              <span>{talk.messages.length}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TalksList;
