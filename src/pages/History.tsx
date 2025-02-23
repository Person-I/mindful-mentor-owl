
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Talk } from "@/types/talk";
import { historyService } from "@/services/historyService";
import { useToast } from "@/hooks/use-toast";
import ChatBubbles from "@/components/ChatBubbles";
import { Toaster } from "@/components/ui/toaster";
import TalksList from "@/components/TalksList";
import { useUser } from "@/context/UserIDContext";

const History = () => {
  const [talks, setTalks] = useState<Talk[]>([]);
  const [selectedTalk, setSelectedTalk] = useState<Talk | null>(null);
  const { talkId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isListVisible, setIsListVisible] = useState(true);
  const userId = useUser().userId;

  useEffect(() => {
    if (userId) {
      loadTalks();
    }
  }, [userId]);

  useEffect(() => {
    if (talkId && userId) {
      loadTalk(talkId);
    }
  }, [talkId, userId]);

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

  const loadTalks = async () => {
    try {
      const data = await historyService.getTalks(userId);
      setTalks(data);
      if (data.length && !talkId) {
        navigate(`/history/${data[0].id}`);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load talks",
        variant: "destructive",
      });
    }
  };

  const loadTalk = async (id: string) => {
    try {
      const talk = await historyService.getTalk(userId, id);
      setSelectedTalk(talk);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load talk",
        variant: "destructive",
      });
    }
  };

  const deleteTalk = async (id: string) => {
    try {
      await historyService.deleteTalk(userId, id);
      setTalks(prev => prev.filter(t => t.id !== id));
      if (selectedTalk?.id === id) {
        const remainingTalks = talks.filter(t => t.id !== id);
        if (remainingTalks.length) {
          navigate(`/history/${remainingTalks[0].id}`);
        } else {
          navigate('/history');
        }
      }
      toast({
        title: "Success",
        description: "Talk deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete talk",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col md:flex-row gap-4">
      <Toaster />

      {/* Toggle button for mobile */}
      <button
        className="md:hidden p-2 bg-primary text-primary-foreground rounded-lg"
        onClick={() => setIsListVisible(!isListVisible)}
      >
        {isListVisible ? 'Hide History' : 'Show History'}
      </button>

      <TalksList
        talks={talks}
        selectedTalkId={selectedTalk?.id || null}
        onDeleteTalk={deleteTalk}
        isVisible={isListVisible}
      />

      {/* Chat Bubbles */}
      {selectedTalk ? (
        <ChatBubbles messages={selectedTalk.content} />
      ) : (
        <div className="flex-1 glass rounded-lg p-4 flex items-center justify-center">
          <p className="text-foreground/70">Select a conversation from history</p>
        </div>
      )}
    </div>
  );
};

export default History;
