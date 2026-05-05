import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { AdminAuthProvider } from '@/lib/authContext';

// Layout
import AppLayout from './components/schp/AppLayout';

// Pages
import LiveMap from './pages/LiveMap';
import SensorNetwork from './pages/SensorNetwork';
import AIPredictor from './pages/AIPredictor';
import MorbidityForecasts from './pages/MorbidityForecasts';
import DispatchLog from './pages/DispatchLog';
import DistrictReports from './pages/DistrictReports';
import TrendAnalysis from './pages/TrendAnalysis';
import SchoolProfile from './pages/SchoolProfile';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#0D2B45]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#1B4F72] border-t-[#E67E22] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-white/60 text-[12px] font-inter">TEGU Climate-Health Protocol</p>
          <p className="text-white/30 text-[10px]">Initializing...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') return <UserNotRegisteredError />;
    if (authError.type === 'auth_required') { navigateToLogin(); return null; }
  }

  return (
    <AdminAuthProvider>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<LiveMap />} />
          <Route path="/sensors" element={<SensorNetwork />} />
          <Route path="/predictor" element={<AIPredictor />} />
          <Route path="/forecasts" element={<MorbidityForecasts />} />
          <Route path="/dispatch" element={<DispatchLog />} />
          <Route path="/district-reports" element={<DistrictReports />} />
          <Route path="/trends" element={<TrendAnalysis />} />
          <Route path="/school/:schoolId" element={<SchoolProfile />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </AdminAuthProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;