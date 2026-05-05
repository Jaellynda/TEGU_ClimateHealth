import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/lib/authContext';
import {
  Map, Activity, AlertTriangle, Package, BarChart2,
  FileText, Shield, LogIn, LogOut, Menu, X, Wifi, Radio, TrendingUp, ShoppingCart
} from 'lucide-react';

const NAV_PUBLIC = [
  { path: '/', label: 'Live Map', icon: Map, desc: 'Uganda Climate Risk Map' },
  { path: '/sensors', label: 'Sensor Network', icon: Radio, desc: 'DePIN Node Status' },
  { path: '/predictor', label: 'AI Predictor', icon: Activity, desc: 'XAI Anomaly Engine' },
  { path: '/forecasts', label: 'Morbidity Forecasts', icon: BarChart2, desc: 'Predictive Analytics' },
  { path: '/trends', label: 'Trend Analysis', icon: TrendingUp, desc: '30-Day Climate Patterns' },
];

const NAV_ADMIN = [
  { path: '/dispatch', label: 'Dispatch Log', icon: Package, desc: 'Anticipatory Actions' },
  { path: '/inventory', label: 'Inventory', icon: ShoppingCart, desc: 'Medical Supply Stock' },
  { path: '/district-reports', label: 'District Reports', icon: FileText, desc: 'DHIS2-Ready Reports' },
];

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const location = useLocation();
  const { isAdmin, login, logout } = useAdminAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onMobileClose} />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-64 z-50 flex flex-col
        bg-[#0D2B45] text-white
        transition-transform duration-300
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#E67E22] flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-[13px] font-bold text-white leading-tight">TEGU Climate-Health</h1>
              <p className="text-[10px] text-blue-300/70">by TEGU Systems · v1.0</p>
            </div>
          </div>
          {/* Close mobile */}
          <button onClick={onMobileClose} className="absolute top-4 right-4 lg:hidden text-white/60 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live status */}
        <div className="px-5 py-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[11px] text-green-300 font-medium">AirQo Feed: LIVE</span>
            <Wifi className="w-3 h-3 text-green-400 ml-auto" />
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="text-[11px] text-blue-300">DHIS2 Sync: Active</span>
          </div>
        </div>

        {/* Public Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="text-[10px] uppercase tracking-widest text-blue-400/60 px-2 mb-2">Public Dashboard</p>
          {NAV_PUBLIC.map(({ path, label, icon: Icon, desc }) => (
            <Link
              key={path}
              to={path}
              onClick={onMobileClose}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all group
                ${isActive(path)
                  ? 'bg-[#E67E22] text-white'
                  : 'text-blue-200/80 hover:bg-white/8 hover:text-white'}
              `}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <div>
                <p className="text-[13px] font-medium">{label}</p>
                <p className={`text-[10px] ${isActive(path) ? 'text-orange-100' : 'text-blue-400/60'}`}>{desc}</p>
              </div>
            </Link>
          ))}

          {/* Admin Nav */}
          {isAdmin && (
            <>
              <p className="text-[10px] uppercase tracking-widest text-orange-400/70 px-2 mb-2 mt-5">Admin Access</p>
              {NAV_ADMIN.map(({ path, label, icon: Icon, desc }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={onMobileClose}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all
                    ${isActive(path)
                      ? 'bg-[#E67E22] text-white'
                      : 'text-orange-200/80 hover:bg-orange-500/10 hover:text-white'}
                  `}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <div>
                    <p className="text-[13px] font-medium">{label}</p>
                    <p className={`text-[10px] ${isActive(path) ? 'text-orange-100' : 'text-orange-400/60'}`}>{desc}</p>
                  </div>
                </Link>
              ))}
            </>
          )}

          {/* Alert count */}
          <div className="mt-5 mx-2 p-3 rounded-lg bg-red-900/30 border border-red-500/30">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-[12px] font-semibold text-red-300">Active Alerts</span>
            </div>
            <p className="text-2xl font-bold text-red-400">3</p>
            <p className="text-[10px] text-red-300/70 mt-0.5">Red Alert across 3 schools</p>
          </div>
        </nav>

        {/* Login/Logout */}
        <div className="px-4 py-4 border-t border-white/10">
          {isAdmin ? (
            <div>
              <div className="flex items-center gap-2 mb-2 px-1">
                <div className="w-6 h-6 rounded-full bg-[#E67E22] flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white">A</span>
                </div>
                <div>
                  <p className="text-[12px] font-medium text-white">Admin Access</p>
                  <p className="text-[10px] text-green-400">Health Worker Mode</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-300 hover:bg-red-900/30 transition-colors text-[13px]"
              >
                <LogOut className="w-4 h-4" />
                Exit Admin View
              </button>
            </div>
          ) : (
            <button
              onClick={login}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#E67E22] hover:bg-[#D35400] text-white font-semibold text-[13px] transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Login — Health Worker
            </button>
          )}
          <p className="text-[9px] text-blue-400/40 text-center mt-2">Digital Public Good · MIT License</p>
        </div>
      </aside>
    </>
  );
}