'use client';

import { useConversation } from '@11labs/react';
import { useCallback, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Mic, MicOff } from 'lucide-react';
import './VoiceAssistant.css'; // Import the CSS file for styles
import { characters } from '@/data/characters'; // Import the characters array
import { useCharacter } from '@/context/CharacterContext'; // Import the useCharacter hook
import { Character } from '@/types/character';

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
      // toast({ title: 'New Message', description: `Message received: ${message}` });
    },
    onError: (error) => {
      console.error('Error:', error);
      toast({ title: 'Error', description: `An error occurred: ${error.message}` });
    },
  });
  const convStatus = conversation.status;

  const [character, setCharacter] = useState<Character| null>(null);

  useEffect(() => {
    if (selectedId) {
      const selectedCharacter = characters.find(c => c.id === selectedId);
      if (selectedCharacter) {
        setCharacter(selectedCharacter);
      }
    }
  }, [selectedId]); // Add selectedId as a dependency

  const toggleConversation = useCallback(async () => {
    try {
      if (convStatus === 'connected') {
        await conversation.endSession();
      } else {
        // Request microphone permission
        await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log(character);
        // Start the conversation with your agent
        await conversation.startSession({
          agentId: 'BoXuSDsm0Qq78Gp3aMFA',
          dynamicVariables: {
            agent_name: character.name,
            keyFeatures: character.keyFeatures.join(', '),
            context: 'Yesterday I had a meeting with very important VC investor.'
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

  return (
    <>
      {character && (
        <div className="flex flex-col items-center gap-4">
          <div
            className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg flex items-center gap-2 cursor-pointer transition-colors ${
              convStatus === 'connected' ? 'bg-red-500 hover:bg-red-600 wave-animation' : 'bg-blue-500 hover:bg-blue-600'
            }`}
            onClick={toggleConversation}
          >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-secondary">
              <img
                src={character.avatarUrl}
                alt={character.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="icon-wrapper">
              {/* {convStatus === 'connected' ? <MicOff size={24} className="hover-icon" /> : <Mic size={24} />} */}
            </span>
            <span className="text-sm font-medium">
              {convStatus === 'connected' ? 'Talking to ' + character.name : 'Talk to ' + character.name}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
