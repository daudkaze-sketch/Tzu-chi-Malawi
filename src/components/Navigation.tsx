'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, LogOut, Home, FileText, Users, Calendar, Box, Megaphone } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleLogout = () => {
    localStorage.removeItem('token');
    signOut({ callbackUrl: '/login' });
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Daily Reports', href: '/reports', icon: FileText },
    { name: 'Attendance', href: '/attendance', icon: Users },
    { name: 'Tasks', href: '/tasks', icon: Calendar },
    { name: 'Inventory', href: '/materials', icon: Box },
    { name: 'Announcements', href: '/announcements', icon: Megaphone },
  ];

  return (
    <nav className="bg-blue-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">Tzu Chi Malawi</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 ${
                    pathname === item.href
                      ? 'bg-blue-700'
                      : 'hover:bg-blue-800'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-4">
            {session?.user && (
              <span className="text-sm hidden sm:block">
                {session.user.name || session.user.username || session.user.email}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md text-sm"
            >
              <LogOut size={18} />
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2 ${
                    pathname === item.href
                      ? 'bg-blue-700'
                      : 'hover:bg-blue-800'
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
