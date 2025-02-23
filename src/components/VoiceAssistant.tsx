'use client';

import { useConversation } from '@11labs/react';
import { useCallback, useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Mic, MicOff } from 'lucide-react';
import './VoiceAssistant.css';
import { characters } from '@/data/characters';
import { useCharacter } from '@/context/CharacterContext';
import { Character } from '@/types/character';
import { useUser } from '@/context/UserIDContext';
import { historyService } from '@/services/historyService';

interface CVAnalysis {
  id: number;
  user_id: string;
  summary: string;
  text: string;
  created_at: string;
}

export function VoiceAssistant() {
  const { toast } = useToast();
  const { selectedId } = useCharacter();
  const userId = useUser().userId;
  const [character, setCharacter] = useState<Character | null>(null);
  const [messages, setMessages] = useState<{ message: string; source: string }[]>([]);
  const messagesRef = useRef(messages);
  const [conversationHistory, setConversationHistory] = useState<string>('');

  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const saveConversation = async () => {
    console.log(`Saving conversation: ${messagesRef.current.length}`);
    if (messagesRef.current.length > 0) {
      try {
        let formattedMessages = JSON.stringify(
          messagesRef.current.map((msg, index) => ({
            content: msg.message,
            role: msg.source === 'ai' ? 'assistant' : 'user',
          }))
        );

        await historyService.createTalk(userId, formattedMessages);

        toast({
          title: "Conversation saved",
          description: "Your conversation has been saved to history.",
        });
      } catch (error) {
        console.error('Failed to save conversation:', error);
        toast({
          title: "Error",
          description: "Failed to save conversation to history.",
          variant: "destructive",
        });
      }
    }
  };

  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected');
    },
    onDisconnect: () => {
      console.log('Disconnected');
      saveConversation();
    },
    onMessage: (message) => {
      console.log(`Messages: ${messages.length}`);
      setMessages((prevMessages) => [...prevMessages, message]);
    },
    onError: (error) => {
      console.error('Error:', error);
      toast({ title: 'Error', description: `An error occurred: ${error.message}` });
    },
  });
  const convStatus = conversation.status;

  useEffect(() => {
    if (selectedId) {
      const selectedCharacter = characters.find(c => c.id === selectedId);
      if (selectedCharacter) {
        setCharacter(selectedCharacter);
      }
    }
  }, [selectedId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  useEffect(() => {
    const fetchConversationHistory = async () => {
      try {
        if (userId){
          const talks = await historyService.getTalks(userId);
          const formattedHistory = talks.map(talk => {
            const dateHeader = `Conversation started on: ${new Date(talk.created_at).toLocaleString()}`;
            const messages = talk.content.map((msg: { content: string, role: string }) => `${msg.role.toUpperCase()}: ${msg.content}`).join('\n');
            return `${dateHeader}\n${messages}`;
          }).join('\n\n');
          setConversationHistory(formattedHistory);
        }
       
      } catch (error) {
        console.error('Failed to fetch conversation history:', error);
      }
    };

    fetchConversationHistory();
  }, [userId]);

  const startConversation = useCallback(async () => {
    try {
      if (convStatus !== 'connected') {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setMessages([]);
        await conversation.startSession({
          agentId: 'BoXuSDsm0Qq78Gp3aMFA',
          dynamicVariables: {
            agent_name: character.name,
            keyFeatures: character.keyFeatures.join(', '),
            context: `Previous conversations:\n${conversationHistory}`,
            user_id: userId,
            start_date: '2024-02-23',
            end_date: '2024-03-23'
          },
          overrides: {
            tts: {
              voiceId: character.voiceId,
            },
          },
        });
      }
    } catch (error) {
      console.error('Failed to toggle conversation:', error);
      toast({ title: 'Error', description: `Failed to toggle conversation.\n ${error.reason}` });
    }
  }, [conversation, toast, character, userId, conversationHistory]);

  const endConversation = useCallback(async () => {
    if (convStatus === 'connected') {
      await conversation.endSession();
    }
  }, [conversation, convStatus]);

  return (
    <>
      {character && (
        <div className="relative z-50">
          {convStatus === 'connected' ? (
            <div className="fixed max-w-[300px] bottom-4 right-4 p-4 rounded-lg shadow-lg flex flex-col items-center gap-2 transition-colors cursor-pointer bg-gradient-to-r from-indigo-500 to-indigo-800 wave-animation">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-secondary border-white border-2">
                  <img
                    src={character.avatarUrl}
                    alt={character.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm font-medium">
                  Talking to {character.name}
                </span>
              </div>
              <div
                ref={chatContainerRef}
                className="chat-container mt-4 w-full max-h-64 overflow-y-auto bg-secondary rounded-lg p-2 min-h-64"
              >
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`${msg.source === 'ai' ? 'bg-gray-600 mr-12' : 'bg-indigo-600 ml-12'} p-2 rounded-lg mb-2`}
                  >
                    {msg.message}
                  </div>
                ))}
                {messages.length > 0 && messages[messages.length - 1].source === 'user' && (
                  <div className="bg-gray-600 p-2 rounded-lg mb-2 animate-pulse w-8">
                    ...
                  </div>
                )}
              </div>
              <button
                className="mt-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 ml-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  endConversation();
                }}
              >
                End Conversation
              </button>
            </div>
          ) : (
            <div onClick={startConversation} className="flex items-center gap-2 fixed max-w-[300px] bottom-4 right-4 p-4 rounded-lg shadow-lg flex transition-colors cursor-pointer bg-blue-500 hover:bg-blue-600">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-secondary border-white border-2">
                <img
                  src={character.avatarUrl}
                  alt={character.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm font-medium">
                Talk to {character.name}
              </span>
            </div>
          )}
        </div>
      )}
    </>
  );
}
