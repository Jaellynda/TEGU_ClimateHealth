import React from 'react';
import { Shield, Github, Globe } from 'lucide-react';

export default function AppFooter() {
  return (
    <footer className="bg-[#0D2B45] text-white px-5 py-3 flex flex-wrap items-center gap-3 text-[11px] flex-shrink-0">
      <div className="flex items-center gap-1.5">
        <Shield className="w-3.5 h-3.5 text-[#E67E22]" />
        <span className="font-semibold text-[#E67E22]">TEGU Climate-Health Protocol</span>
      </div>

      <span className="text-white/30 hidden sm:inline">·</span>

      <span className="bg-green-700/40 text-green-300 border border-green-600/40 px-2 py-0.5 rounded-full text-[10px] font-semibold">
        ✓ Digital Public Good — Candidate
      </span>

      <span className="bg-blue-700/40 text-blue-300 border border-blue-600/40 px-2 py-0.5 rounded-full text-[10px] font-semibold">
        📄 Licensed under MIT
      </span>

      <span className="text-white/30 hidden sm:inline">·</span>

      <span className="text-white/50">Powered by TEGU Systems · Dispatch Engine v1.0</span>

      <div className="ml-auto flex items-center gap-3 text-white/40">
        <div className="flex items-center gap-1 hover:text-white/70 cursor-pointer transition-colors">
          <Github className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Open Source</span>
        </div>
        <div className="flex items-center gap-1 hover:text-white/70 cursor-pointer transition-colors">
          <Globe className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Uganda MOH</span>
        </div>
        <span className="text-white/30">© 2026 SCHP</span>
      </div>
    </footer>
  );
}