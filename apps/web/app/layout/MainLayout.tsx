"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-200">
      <Header />

      <div className="flex flex-1 container mx-auto">
        <main className="flex-1 p-6">{children}</main>
      </div>

      <Footer />
    </div>
  );
}
