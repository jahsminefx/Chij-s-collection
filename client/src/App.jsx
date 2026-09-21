import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Providers
import { AuthProvider } from './context/AuthContext.jsx';
import { StoreProvider } from './context/StoreContext.jsx';

// Layouts
import StorefrontLayout from './layouts/StorefrontLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import ProtectedRoute from './layouts/ProtectedRoute.jsx';

// Storefront Pages
import HomePage from './pages/storefront/HomePage.jsx';
import ShopPage from './pages/storefront/ShopPage.jsx';
import CategoryPage from './pages/storefront/CategoryPage.jsx';
import ProductDetailPage from './pages/storefront/ProductDetailPage.jsx';
import AboutPage from './pages/storefront/AboutPage.jsx';
import ContactPage from './pages/storefront/ContactPage.jsx';
import PoliciesPage from './pages/storefront/PoliciesPage.jsx';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage.jsx';
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx';
import AdminProductsPage from './pages/admin/AdminProductsPage.jsx';
import AdminProductCreatePage from './pages/admin/AdminProductCreatePage.jsx';
import AdminProductEditPage from './pages/admin/AdminProductEditPage.jsx';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage.jsx';
import AdminSettingsPage from './pages/admin/AdminSettingsPage.jsx';

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <Routes>
          {/* Public Storefront Routes */}
          <Route element={<StorefrontLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/products/:slug" element={<ProductDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/policies" element={<PoliciesPage />} />
          </Route>

          {/* Admin Login Route */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/products" element={<AdminProductsPage />} />
              <Route path="/admin/products/new" element={<AdminProductCreatePage />} />
              <Route path="/admin/products/:id/edit" element={<AdminProductEditPage />} />
              <Route path="/admin/categories" element={<AdminCategoriesPage />} />
              <Route path="/admin/settings" element={<AdminSettingsPage />} />
            </Route>
          </Route>

          {/* Fallback Catch-all Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </StoreProvider>
    </AuthProvider>
  );
}
