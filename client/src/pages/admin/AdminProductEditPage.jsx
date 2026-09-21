import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { productAPI } from '../../services/api.js';
import ProductForm from '../../components/admin/ProductForm.jsx';
import { showToast } from '../../components/common/Toast.jsx';

export default function AdminProductEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await productAPI.getAdminProductById(id);
        if (res.success) {
          setProduct(res.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to load product details.');
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const handleUpdate = async (payload) => {
    const res = await productAPI.updateProduct(id, payload);
    if (res.success) {
      showToast(`Product "${res.data.name}" updated successfully`);
      navigate('/admin/products');
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="w-8 h-8 text-brand-primary animate-spin mx-auto mb-2" />
        <p className="text-xs text-zinc-500 uppercase tracking-wider">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="py-16 text-center max-w-md mx-auto">
        <h2 className="font-display text-xl font-bold text-zinc-900 mb-2">Product Not Found</h2>
        <p className="text-xs text-zinc-500 mb-4">{error}</p>
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-1 text-xs font-bold text-brand-accent hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Products</span>
        </Link>
      </div>
    );
  }

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
            Edit Product
          </h1>
          <p className="text-xs text-zinc-500">
            Editing <strong className="text-zinc-800">{product.name}</strong>
          </p>
        </div>
      </div>

      <ProductForm initialData={product} onSubmit={handleUpdate} isEditing={true} />
    </div>
  );
}
