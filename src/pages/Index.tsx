import React, { useEffect } from 'react';
import { motion } from "framer-motion";
import { ArrowRight, Brain, Sparkles, Target } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6"
      >
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Your Personal AI Mentor
        </h1>
        <p className="text-lg md:text-xl text-foreground/80 max-w-2xl">
          Get personalized guidance and support on your journey to success with our AI-powered mentoring platform.
        </p>
        <Link
          to="/select-character"
          className="inline-flex items-center px-6 py-3 text-lg font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Start Talking <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl"
      >
        <FeatureCard
          icon={<Brain className="w-6 h-6" />}
          title="Smart Guidance"
          description="Receive intelligent, personalized advice tailored to your goals"
        />
        <FeatureCard
          icon={<Target className="w-6 h-6" />}
          title="Personalized assitant"
          description="Select the character and attitude of assistant tailored to your needs"
        />
        <FeatureCard
          icon={<Sparkles className="w-6 h-6" />}
          title="Instant Feedback"
          description="Get immediate, constructive feedback on your ideas"
        />
      </motion.div>
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="glass p-6 rounded-xl space-y-4"
  >
    <div className="p-3 w-fit rounded-lg bg-primary/10">
      {icon}
    </div>
    <h3 className="text-xl font-semibold">{title}</h3>
    <p className="text-foreground/70">{description}</p>
  </motion.div>
);

export default Index;
