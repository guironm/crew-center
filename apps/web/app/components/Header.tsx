"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import logo from "../assets/images/logo.png";
import { Cog6ToothIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Button from "./ui/Button";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Employees", path: "/employees" },
    { name: "Departments", path: "/departments" },
  ];

  return (
    <header className="bg-slate-100 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link href="/dashboard">
            <Image src={logo} alt="Crew Center Logo" width={75} height={75} />
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Button 
                  key={item.path}
                  href={item.path}
                  isActive={isActive}
                >
                  {item.name}
                </Button>
              );
            })}
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            href="/settings"
            icon={<Cog6ToothIcon className="w-5 h-5" />}
            className="hidden md:flex"
            aria-label="Settings"
          >
            <span className="sr-only">Settings</span>
          </Button>
          <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center">
            <span className="font-bold text-slate-700">A</span>
          </div>
          
          {/* Mobile Menu Button */}
          <Button
            className="md:hidden p-1"
            icon={mobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">{mobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-200 px-4 py-2 shadow-inner">
          <nav className="flex flex-col space-y-2 py-2">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Button
                  key={item.path}
                  href={item.path}
                  className="w-full justify-start"
                  isActive={isActive}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Button>
              );
            })}
            <Button
              href="/settings"
              icon={<Cog6ToothIcon className="w-5 h-5" />}
              className="w-full justify-start"
              onClick={() => setMobileMenuOpen(false)}
            >
              Settings
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
