import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import QuickActions from './components/QuickActions';
import RealWorldOperations from './components/RealWorldOperations';
import PlatformStats from './components/PlatformStats';
import AboutPlatform from './components/AboutPlatform';
import HowItWorks from './components/HowItWorks';
import Services from './components/Services';
import Stakeholders from './components/Stakeholders';
import DigitalCertificate from './components/DigitalCertificate';
import QrVerification from './components/QrVerification';
import InstrumentPassport from './components/InstrumentPassport';
import InstrumentsDashboard from './components/InstrumentsDashboard';
import ApplicationsDashboard from './components/ApplicationsDashboard';
import FieldVerification from './components/FieldVerification';
import ExpiryAlerts from './components/ExpiryAlerts';
import SecuritySection from './components/SecuritySection';
import TransparencyBenefits from './components/TransparencyBenefits';
import FaqSection from './components/FaqSection';
import FinalCta from './components/FinalCta';
import Footer from './components/Footer';

// Modals
import LoginModal from './components/modals/LoginModal';
import ApplyModal from './components/modals/ApplyModal';
import TrackModal from './components/modals/TrackModal';
import HelpModal from './components/modals/HelpModal';

export default function App() {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [loginDefaultRole, setLoginDefaultRole] = useState('BUSINESS / INSTRUMENT OWNER');
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [trackModalOpen, setTrackModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [trackedAppId, setTrackedAppId] = useState('APP-2026-9812');
  const [selectedSampleCert, setSelectedSampleCert] = useState('LM-CERT-2026-00001');

  // Track logged-in user to re-render InstrumentsDashboard after login
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const targetId = window.location.hash;
    if (!targetId) return undefined;

    const scrollToHashTarget = () => {
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({ block: 'start' });
        return true;
      }
      return false;
    };

    if (scrollToHashTarget()) return undefined;
    const retry = window.setTimeout(scrollToHashTarget, 120);
    return () => window.clearTimeout(retry);
  }, []);

  const handleOpenLogin = (mode = 'login') => {
    setAuthMode(mode);
    setLoginModalOpen(true);
  };

  const handleOpenRegister = () => {
    setAuthMode('register');
    setLoginModalOpen(true);
  };

  const handleOpenLoginWithRole = (role) => {
    setLoginDefaultRole(role);
    setAuthMode('login');
    setLoginModalOpen(true);
  };

  const handleScrollToSection = (sectionId) => {
    const el = document.querySelector(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectSample = (certNo) => {
    setSelectedSampleCert(certNo);
    handleScrollToSection('#qr-verification');
  };

  const handleTrackCreatedApp = (appId) => {
    setTrackedAppId(appId);
    setTrackModalOpen(true);
  };

  const handleLoginSuccess = (user) => {
    setLoggedInUser(user);
    // Scroll down to the live instruments dashboard
    setTimeout(() => handleScrollToSection('#instruments'), 300);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased selection:bg-sky-200 selection:text-[#0a3a60]">
      
      {/* 1. Navbar */}
      <Navbar
        onOpenLogin={(mode) => handleOpenLogin(mode || 'login')}
        onOpenRegister={handleOpenRegister}
        onOpenVerify={() => handleScrollToSection('#qr-verification')}
        onOpenApply={() => setApplyModalOpen(true)}
        onOpenTrack={() => setTrackModalOpen(true)}
      />

      <main className="flex-1">
        {/* 3. Hero Section */}
        <Hero
          onOpenApply={() => setApplyModalOpen(true)}
          onOpenVerify={() => handleScrollToSection('#qr-verification')}
          onOpenTrack={() => setTrackModalOpen(true)}
          onSelectSampleCert={handleSelectSample}
        />

        {/* 4. Quick Actions */}
        <QuickActions
          onOpenApply={() => setApplyModalOpen(true)}
          onOpenVerify={() => handleScrollToSection('#qr-verification')}
          onOpenTrack={() => setTrackModalOpen(true)}
          onOpenCertModal={() => handleScrollToSection('#certificate-preview')}
          onScrollToExpiry={() => handleScrollToSection('#expiry-alerts')}
        />

        {/* 5. Real-world field operations */}
        <RealWorldOperations />

        {/* 6. Platform Stats */}
        <PlatformStats />

        {/* 7. About Platform */}
        <AboutPlatform
          onOpenApply={() => setApplyModalOpen(true)}
          onOpenVerify={() => handleScrollToSection('#qr-verification')}
        />

        {/* 8. How It Works (Priority) */}
        <HowItWorks />

        {/* 8. Services */}
        <Services
          onOpenApply={() => setApplyModalOpen(true)}
          onOpenVerify={() => handleScrollToSection('#qr-verification')}
          onOpenTrack={() => setTrackModalOpen(true)}
          onOpenCertModal={() => handleScrollToSection('#certificate-preview')}
        />

        {/* 9. Stakeholders */}
        <Stakeholders
          onSelectRoleLogin={handleOpenLoginWithRole}
        />

        {/* 10. Live Instruments Dashboard (API-connected, login-gated) */}
        <InstrumentsDashboard
          key={loggedInUser?.id}
          onOpenApply={() => setApplyModalOpen(true)}
        />

        {/* 10b. Verification Applications Dashboard & SIH Workflow (API-connected) */}
        <ApplicationsDashboard
          key={`apps-${loggedInUser?.id || 'guest'}`}
          onOpenApply={() => setApplyModalOpen(true)}
          onTrackApp={handleTrackCreatedApp}
          onUserChange={(u) => setLoggedInUser(u)}
        />

        {/* 11. Digital Certificate (Priority) */}
        <DigitalCertificate
          onOpenVerify={() => handleScrollToSection('#qr-verification')}
          onSelectSampleCert={handleSelectSample}
        />

        {/* 12. QR Verification (Priority) */}
        <QrVerification
          initialCert={selectedSampleCert}
        />

        {/* 13. Digital Instrument Passport (Priority Innovation) */}
        <InstrumentPassport />

        {/* 14. Field Verification Mockup (Priority) */}
        <FieldVerification />

        {/* 15. Expiry Alerts */}
        <ExpiryAlerts
          onOpenApply={() => setApplyModalOpen(true)}
        />

        {/* 16. Security Architecture */}
        <SecuritySection />

        {/* 17. Transparency & Benefits */}
        <TransparencyBenefits
          onOpenVerify={() => handleScrollToSection('#qr-verification')}
          onOpenApply={() => setApplyModalOpen(true)}
        />

        {/* 18. FAQ Section */}
        <FaqSection />

        {/* 19. Final Call to Action */}
        <FinalCta
          onOpenApply={() => setApplyModalOpen(true)}
          onOpenVerify={() => handleScrollToSection('#qr-verification')}
        />
      </main>

      {/* 20. Footer */}
      <Footer onOpenHelp={() => setHelpModalOpen(true)} />

      {/* Interactive Modals */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        initialMode={authMode}
        defaultRole={loginDefaultRole}
        onLoginSuccess={handleLoginSuccess}
      />

      <ApplyModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        onTrackApplication={handleTrackCreatedApp}
      />

      <TrackModal
        isOpen={trackModalOpen}
        onClose={() => setTrackModalOpen(false)}
        initialAppId={trackedAppId}
      />

      <HelpModal
        isOpen={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
      />

    </div>
  );
}
