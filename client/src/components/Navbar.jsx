import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { notificationAPI } from '../services/notificationAPI';
import { Bell, LogOut, Menu, X, Sparkles } from 'lucide-react';

export default function Navbar({ toggleSidebar, isSidebarOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      notificationAPI.getNotifications()
        .then(res => {
          const list = res.data || res || [];
          setUnreadCount(Array.isArray(list) ? list.filter(n => n && !n.isRead).length : 0);
        })
        .catch(() => {});
    }
  }, [location.pathname, user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-[#090d16]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 py-3.5 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Toggle */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          aria-label="Toggle Sidebar"
          title="Toggle Navigation Menu"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Brand Logo & Title */}
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 p-0.5 shadow-glow-purple group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center text-xl">
              🧠
            </div>
          </div>
          <div>
            <span className="font-display font-bold text-lg bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              MoodPlanner
            </span>
            <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/10 border border-purple-500/30 text-purple-400">
              Pro
            </span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Action Button: Generate Plan */}
        <Link
          to="/planner"
          className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/40 text-xs font-semibold text-purple-300 hover:text-white hover:border-purple-500/80 transition-all shadow-sm hover:shadow-glow-purple"
          title="Generate AI Study Plan"
        >
          <Sparkles size={14} className="text-pink-400 animate-pulse" />
          <span>Generate Plan</span>
        </Link>

        {/* Notifications Icon with Live Unread Badge */}
        <Link
          to="/notifications"
          className="relative p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title="View Notifications"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-pink-500 text-white font-bold text-[10px] flex items-center justify-center shadow-lg animate-bounce">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>

        {/* User Profile Pill & Logout */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <Link
            to="/profile"
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-800/60 transition-colors"
            title="Edit Profile Settings"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-blue-500 text-white font-bold flex items-center justify-center text-xs shadow-md">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-slate-200 line-clamp-1">{user?.name || 'User'}</p>
              <p className="text-[10px] text-slate-400 line-clamp-1">{user?.email || ''}</p>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors ml-1"
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
