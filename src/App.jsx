import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import Home from '@/pages/Home';
import CardRequest from '@/pages/CardRequest';
import NetworkPay from '@/pages/NetworkPay';
import Payment from '@/pages/Payment';
import Confirmation from '@/pages/Confirmation';
import OtpApp from '@/pages/OtpApp';
import OtpVerify from '@/pages/OtpVerify';
import AdminDashboard from '@/pages/AdminDashboard';

const AuthenticatedApp = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/card-request" element={<CardRequest />} />
      <Route path="/network-pay" element={<NetworkPay />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/confirmation" element={<Confirmation />} />
      <Route path="/otp-app" element={<OtpApp />} />
      <Route path="/otp-verify" element={<OtpVerify />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App