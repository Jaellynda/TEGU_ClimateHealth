import React from 'react';
import { Menu, Bell, RefreshCw, Clock } from 'lucide-react';

export default function TopBar({ onMenuClick, title, subtitle }) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-UG', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Kampala' });
  const dateStr = now.toLocaleDateString('en-UG', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <header className="h-14 bg-white border-b border-border flex items-center px-4 gap-4 flex-shrink-0">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-1.5 rounded-md hover:bg-muted transition-colors"
      >
        <Menu className="w-5 h-5 text-foreground" />
      </button>

      <div className="flex-1">
        <h2 className="text-[15px] font-semibold text-[#1B4F72] leading-tight">{title}</h2>
        {subtitle && <p className="text-[11px] text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="hidden md:flex items-center gap-1.5 text-[11px] text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
        <Clock className="w-3 h-3" />
        <span>{timeStr} EAT · {dateStr}</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">3</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-green-600 font-medium">
          <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: '3s' }} />
          <span className="hidden sm:inline">Live</span>
        </div>
      </div>
    </header>
  );
}