import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  LayoutDashboard,
  Smile,
  CheckSquare,
  Calendar,
  Timer,
  BarChart3,
  Bell,
  User,
  LogOut,
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Mood', path: '/mood', icon: Smile },
  { name: 'Tasks', path: '/tasks', icon: CheckSquare },
  { name: 'Study Planner', path: '/planner', icon: Calendar },
  { name: 'Study Sessions', path: '/sessions', icon: Timer },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Notifications', path: '/notifications', icon: Bell },
  { name: 'Profile', path: '/profile', icon: User },
];

export default function Sidebar({ isOpen, closeSidebar }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    closeSidebar();
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-[65px] left-0 z-40 w-64 h-screen lg:h-[calc(100vh-65px)] bg-[#090d16] border-r border-slate-800/80 p-4 transition-transform duration-300 ease-in-out flex flex-col justify-between overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Main Navigation
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/20 text-white border border-purple-500/40 shadow-glow-purple'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                    }`
                  }
                >
                  <Icon size={18} className="shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Productivity Card & Logout */}
        <div className="space-y-3 pt-4 border-t border-slate-800/80 mt-4">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-900/30 to-blue-900/20 border border-purple-500/20 text-center">
            <span className="text-2xl mb-1 block">⚡</span>
            <h4 className="font-display font-semibold text-xs text-purple-200">Study Streak Active</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Plan around your mood to keep momentum high.</p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
          >
            <LogOut size={18} className="shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
