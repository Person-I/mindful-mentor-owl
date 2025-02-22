import React from 'react';
import { Outlet } from "react-router-dom";
import { Navigation } from "@/components/Navigation";

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container py-8">
        <Outlet />
      </main>
    </div>
  );
};
