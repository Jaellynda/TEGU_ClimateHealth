import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import AppFooter from './AppFooter';
import AlertBanner from './AlertBanner';

const PAGE_META = {
  '/identity': { title: 'Sentinel Network Hub', subtitle: 'Geospatial Verification & Sensor Health · AirQo Uganda · H3-Indexed Nodes' },
  '/identity-dashboard': { title: 'Sentinel Network Manager', subtitle: 'AirQo Sensor Calibration · School Vulnerability Profiles · Accuracy Verification' },
  '/': { title: 'Live Climate Risk Map', subtitle: 'Uganda · TEGU Systems · Real-time environmental monitoring across 8 sentinel schools' },
  '/sensors': { title: 'DePIN Sensor Network', subtitle: 'Distributed IoT Nodes — Kampala & Jinja Regions' },
  '/predictor': { title: 'AI Anomaly Predictor', subtitle: 'Explainable AI (XAI) · Sentinel Engine v1.0' },
  '/forecasts': { title: 'Predictive Morbidity Forecasts', subtitle: 'Climate-sensitive disease projection · 48-hour window' },
  '/dispatch': { title: 'Anticipatory Action Log', subtitle: 'Admin · TEGU Systems Dispatch Orders & Supply Chain Status' },
  '/district-reports': { title: 'District Health Reports', subtitle: 'Admin · DHIS2-Ready Export · Uganda MOH Integration' },
  '/trends': { title: '30-Day Trend Analysis', subtitle: 'Historical PM2.5 & Heat Index patterns · NGO & policy reporting' },
  '/inventory': { title: 'Medical Supply Inventory', subtitle: 'Admin · Stock Management · Linked to Dispatch System' },
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
        <div style={{
          background: "#1a1a00",
          border: "1px solid #eab308",
          borderLeft: "4px solid #eab308",
          padding: "6px 16px",
          fontFamily: "monospace",
          fontSize: 11,
          color: "#eab308",
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexShrink: 0,
        }}>
          ⚠ PROTOTYPE — Simulated sensor data. Target schools identified for Phase 1 deployment pending partnerships.
        </div>
        <main className="flex-1 overflow-y-auto">
          <AlertBanner />
          <Outlet />
        </main>
        <AppFooter />
      </div>
    </div>
  );
}