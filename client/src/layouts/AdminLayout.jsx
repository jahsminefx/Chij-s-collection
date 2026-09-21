import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar.jsx';
import AdminMobileHeader from '../components/admin/AdminMobileHeader.jsx';
import { ToastContainer } from '../components/common/Toast.jsx';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col lg:flex-row text-zinc-900 font-sans">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminMobileHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}
