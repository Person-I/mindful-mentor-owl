import React from 'react';
import { Outlet } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
