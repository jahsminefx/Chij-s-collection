import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { productAPI } from '../../services/api.js';
import ProductForm from '../../components/admin/ProductForm.jsx';
import { showToast } from '../../components/common/Toast.jsx';

export default function AdminProductCreatePage() {
  const navigate = useNavigate();

  const handleCreate = async (payload) => {
    const res = await productAPI.createProduct(payload);
    if (res.success) {
      showToast(`Product "${res.data.name}" created successfully`);
      navigate('/admin/products');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to="/admin/products"
          className="p-1.5 text-zinc-500 hover:text-zinc-900 rounded hover:bg-zinc-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-zinc-900">
            Add New Product
          </h1>
          <p className="text-xs text-zinc-500">
            Create and publish a new garment, shoe, or accessory to your storefront.
          </p>
        </div>
      </div>

      <ProductForm onSubmit={handleCreate} isEditing={false} />
    </div>
  );
}
