'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, FileText, Users, Calendar, Box, Megaphone } from 'lucide-react';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Daily Reports', href: '/reports', icon: FileText },
    { name: 'Attendance', href: '/attendance', icon: Users },
    { name: 'Tasks', href: '/tasks', icon: Calendar },
    { name: 'Inventory', href: '/materials', icon: Box },
    { name: 'Announcements', href: '/announcements', icon: Megaphone },
  ];

  return (
    <nav className="sticky top-0 z-40 border-b border-blue-800/70 bg-blue-950 text-white shadow-[0_10px_30px_rgba(15,23,42,0.16)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/dashboard" className="flex items-center space-x-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-sm font-black ring-1 ring-white/15">
              TC
            </span>
            <span className="text-xl font-bold tracking-tight">Tzu Chi Malawi</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative flex items-center space-x-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    pathname === item.href
                      ? 'bg-white/[0.12] text-white shadow-inner'
                      : 'text-blue-100 hover:bg-white/[0.08] hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                  {pathname === item.href && (
                    <span className="absolute inset-x-3 -bottom-[13px] h-0.5 rounded-full bg-blue-200" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-4">
            <span className="hidden rounded-full border border-white/15 bg-white/[0.08] px-3 py-1 text-xs font-semibold text-blue-50 sm:block">
              Operations Console
            </span>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden rounded-lg p-2 hover:bg-white/10"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden space-y-1 pb-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 rounded-lg px-3 py-2 text-base font-medium ${
                    pathname === item.href
                      ? 'bg-white/[0.12]'
                      : 'text-blue-100 hover:bg-white/[0.08]'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
