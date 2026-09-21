import React from 'react';
import { Outlet } from 'react-router-dom';
import AnnouncementBar from '../components/common/AnnouncementBar.jsx';
import Header from '../components/common/Header.jsx';
import Footer from '../components/common/Footer.jsx';
import FloatingWhatsApp from '../components/common/FloatingWhatsApp.jsx';
import { ToastContainer } from '../components/common/Toast.jsx';

export default function StorefrontLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-background text-brand-text">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <FloatingWhatsApp />
      <Footer />
      <ToastContainer />
    </div>
  );
}
