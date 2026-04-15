import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import AppFooter from './AppFooter';

const PAGE_META = {
  '/': { title: 'Live Climate Risk Map', subtitle: 'Uganda · Real-time environmental monitoring across 8 sentinel schools' },
  '/sensors': { title: 'DePIN Sensor Network', subtitle: 'Distributed IoT Nodes — Kampala & Jinja Regions' },
  '/predictor': { title: 'AI Anomaly Predictor', subtitle: 'Explainable AI (XAI) · Sentinel Engine v1.0' },
  '/forecasts': { title: 'Predictive Morbidity Forecasts', subtitle: 'Climate-sensitive disease projection · 48-hour window' },
  '/dispatch': { title: 'Anticipatory Action Log', subtitle: 'Admin · Dispatch Orders & Supply Chain Status' },
  '/district-reports': { title: 'District Health Reports', subtitle: 'Admin · DHIS2-Ready Export · Uganda MOH Integration' },
  '/trends': { title: '30-Day Trend Analysis', subtitle: 'Historical PM2.5 & Heat Index patterns · NGO & policy reporting' },
};

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const meta = PAGE_META[location.pathname] || { title: 'Sentinel Climate-Health Protocol', subtitle: '' };

  return (
    <div className="flex h-screen overflow-hidden bg-background font-inter">
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          onMenuClick={() => setMobileOpen(true)}
          title={meta.title}
          subtitle={meta.subtitle}
        />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
        <AppFooter />
      </div>
    </div>
  );
}