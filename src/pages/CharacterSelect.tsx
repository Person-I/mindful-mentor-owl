import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Character } from "@/types/character";
import { characters } from '@/data/characters'; // Import the characters array
import { useCharacter } from "@/context/CharacterContext"; // Import the hook

const CharacterSelect = () => {
  const { selectedId, setSelectedId } = useCharacter(); // Use the context
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const savedId = localStorage.getItem("selectedCharacterId");
    if (savedId) {
      setSelectedId(savedId);
    }
  }, [setSelectedId]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    localStorage.setItem("selectedCharacterId", id);
    toast({
      title: "Character Selected",
      description: "Your mentor preference has been saved.",
    });
    setTimeout(() => navigate("/knowledge-base"), 1000);
  };

  return (
    <div className="container max-w-4xl mx-auto">
      <div className="text-center mb-12 animate-fade-down">
        <h1 className="text-4xl font-bold mb-4">Choose Your Mentor</h1>
        <p className="text-lg text-foreground/70">
          Select the mentor that best fits your learning style and goals
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {characters.map((character) => (
          <motion.div
            key={character.id}
            whileHover={{ y: -5 }}
            onClick={() => handleSelect(character.id)}
            className={`
              glass p-6 rounded-xl cursor-pointer relative overflow-hidden
              ${selectedId === character.id ? "ring-2 ring-primary" : ""}
            `}
          >
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-4 bg-secondary">
                <img
                  src={character.avatarUrl}
                  alt={character.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">{character.name}</h3>
              <p className="text-sm text-foreground/70">{character.role}</p>
              
              {selectedId === character.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 bg-primary rounded-full p-1"
                >
                  <UserCheck className="w-5 h-5 text-primary-foreground" />
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CharacterSelect;
