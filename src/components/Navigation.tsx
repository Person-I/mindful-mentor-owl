
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, Home, StickyNote, Users, History } from "lucide-react";
import { useState } from "react";
import { useUser } from "@/context/UserIDContext";

export const Navigation = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userId = useUser();

  return (
    <nav className="sticky top-0 z-50 bg-background/50 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold text-primary hover:text-primary/90 transition-colors">
            PersonAI
          </Link>
          {/* {userId.userId} */}
          <button
            className="block md:hidden text-xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>

          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" icon={<Home className="w-5 h-5" />} label="Home" active={location.pathname === "/"} />
            <NavLink to="/select-character" icon={<Users className="w-5 h-5" />} label="Mentors" active={location.pathname === "/select-character"} />
            <NavLink 
              to="/knowledge-base" 
              icon={<StickyNote className="w-5 h-5" />} 
              label="Knowledge Base" 
              active={location.pathname.startsWith("/knowledge-base")} 
            />
            <NavLink 
              to="/history" 
              icon={<History className="w-5 h-5" />} 
              label="History" 
              active={location.pathname.startsWith("/history")} 
            />
          </div>
        </div>
        
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-background/95 backdrop-blur-lg shadow-lg border-b border-border/50 md:hidden">
            <div className="flex flex-col items-start space-y-4 p-4">
              <NavLink to="/" icon={<Home className="w-5 h-5" />} label="Home" active={location.pathname === "/"} onClick={() => setIsMenuOpen(false)} />
              <NavLink to="/select-character" icon={<Users className="w-5 h-5" />} label="Mentors" active={location.pathname === "/select-character"} onClick={() => setIsMenuOpen(false)} />
              <NavLink 
                to="/knowledge-base" 
                icon={<StickyNote className="w-5 h-5" />} 
                label="Knowledge Base" 
                active={location.pathname.startsWith("/knowledge-base")} 
                onClick={() => setIsMenuOpen(false)}
              />
              <NavLink 
                to="/history" 
                icon={<History className="w-5 h-5" />} 
                label="History" 
                active={location.pathname.startsWith("/history")} 
                onClick={() => setIsMenuOpen(false)}
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick?: () => void;
}

const NavLink = ({ to, icon, label, active, onClick }: NavLinkProps) => (
  <Link to={to} className="relative group" onClick={onClick}>
    <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors hover:bg-primary/10 text-foreground/80 hover:text-primary ${active ? 'bg-primary/15 text-primary' : ''}`}>
      {icon}
      <span>{label}</span>
    </div>
    {active && (
      <motion.div
        layoutId="activeNavLink"
        className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
      />
    )}
  </Link>
);

export default Navigation;
