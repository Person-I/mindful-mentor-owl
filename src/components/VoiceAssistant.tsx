'use client';

import { useConversation } from '@11labs/react';
import { useCallback, useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Mic, MicOff } from 'lucide-react';
import './VoiceAssistant.css'; // Import the CSS file for styles
import { characters } from '@/data/characters'; // Import the characters array
import { useCharacter } from '@/context/CharacterContext'; // Import the useCharacter hook
import { Character } from '@/types/character';
import { useUser } from '@/context/UserIDContext';

export function VoiceAssistant() {
  const { toast } = useToast();
  const { selectedId } = useCharacter(); // Use the useCharacter hook to get selectedId
  const conversation = useConversation({
    // onConnect: () => {
    //   console.log('Connected');
    //   toast({ title: 'Connected', description: 'You are now connected to the agent.' });
    // },
    // onDisconnect: () => {
    //   console.log('Disconnected');
    //   toast({ title: 'Disconnected', description: 'You have been disconnected from the agent.' });
    // },
    onMessage: (message) => {
      console.log('Message:', message);
      setMessages((prevMessages) => [...prevMessages, message]);
      // toast({ title: 'New Message', description: `Message received: ${message}` });
    },
    onError: (error) => {
      console.error('Error:', error);
      toast({ title: 'Error', description: `An error occurred: ${error.message}` });
    },
  });
  const convStatus = conversation.status;
  const userId = useUser().userId;
  console.log(userId);

  const [character, setCharacter] = useState<Character | null>(null);
  const [messages, setMessages] = useState<{ message: string; source: string }[]>([
    { message: 'Hello, how can I help you today?', source: 'ai' },
    { message: 'I need your help to summarize my journal.', source: 'user' },
  ]);

  const chatContainerRef = useRef<HTMLDivElement | null>(null); // Create a ref for the chat container

  useEffect(() => {
    if (selectedId) {
      const selectedCharacter = characters.find(c => c.id === selectedId);
      if (selectedCharacter) {
        setCharacter(selectedCharacter);
      }
    }
  }, [selectedId]); // Add selectedId as a dependency

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth', // Add smooth scrolling
      });
    }
  }, [messages]); // Add messages as a dependency

  const startConversation = useCallback(async () => {
    try {
      if (convStatus !== 'connected') {
        // Request microphone permission
        await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log(character);
        setMessages([]);
        // Start the conversation with your agent
        await conversation.startSession({
          agentId: 'BoXuSDsm0Qq78Gp3aMFA',
          dynamicVariables: {
            agent_name: character.name,
            keyFeatures: character.keyFeatures.join(', '),
            context: 'Yesterday I had a meeting with very important VC investor.',
            user_id: userId
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
  }, [conversation, toast]);

  const endConversation = useCallback(async () => {
    if (convStatus === 'connected') {
      await conversation.endSession();
    }
  }, [conversation]);

  return (
    <>
      {character && (
        <div className="">
          {
            convStatus === 'connected' ? (
              <div
                className="fixed max-w-[300px] bottom-4 right-4 p-4 rounded-lg shadow-lg flex flex-col items-center gap-2 transition-colors cursor-pointer bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 wave-animation"
              >
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
                {(
                  <div
                    ref={chatContainerRef} // Attach the ref to the chat container
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
                    {
                      messages.length > 0 && messages[messages.length - 1].source === 'user' && (
                        <div className="bg-gray-600 p-2 rounded-lg mb-2 animate-pulse w-8">
                          ...
                        </div>
                      )
                    }
                  </div>
                )}
                {(
                  <button
                    className="mt-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 ml-auto"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering startConversation
                      endConversation();
                    }}
                  >
                    End Conversation
                  </button>
                )}
              </div>
            ) : (
              <div onClick={startConversation} className="flex items-center gap-2 fixed max-w-[300px] bottom-4 right-4 p-4 rounded-lg shadow-lg flex transition-colors cursor-pointer bg-blue-500 hover:bg-blue-600">
                <div  className="w-8 h-8 rounded-full overflow-hidden bg-secondary border-white border-2">
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
            )
          }
        </div>
      )}
    </>
  );
}
