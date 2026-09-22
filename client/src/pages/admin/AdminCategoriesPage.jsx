import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, FolderTree, AlertCircle } from 'lucide-react';
import { categoryAPI } from '../../services/api.js';
import { useStore } from '../../context/StoreContext.jsx';
import CategoryModal from '../../components/admin/CategoryModal.jsx';
import ConfirmModal from '../../components/common/ConfirmModal.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { showToast } from '../../components/common/Toast.jsx';

export default function AdminCategoriesPage() {
  const { refreshCategories } = useStore();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await categoryAPI.getAdminCategories();
      if (res.success) {
        setCategories(res.data);
      }
    } catch (err) {
      showToast(err.message || 'Error loading categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setModalOpen(true);
  };

  const handlePromptDelete = (cat) => {
    // Specification Rule #47 & #79: Check if category contains products
    if (cat.productCount > 0) {
      showToast(
        `Cannot delete "${cat.name}" because it contains ${cat.productCount} product(s). Reassign or remove these products first.`,
        'error',
        6000
      );
      return;
    }
    setCategoryToDelete(cat);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    try {
      setDeleteLoading(true);
      await categoryAPI.deleteCategory(categoryToDelete.id);
      showToast(`Category "${categoryToDelete.name}" deleted successfully.`);
      setCategories((prev) => prev.filter((c) => c.id !== categoryToDelete.id));
      setDeleteModalOpen(false);
      refreshCategories();
    } catch (err) {
      showToast(err.message || 'Failed to delete category', 'error');
    } finally {
      setDeleteLoading(false);
      setCategoryToDelete(null);
    }
  };

  const handleModalSuccess = () => {
    loadCategories();
    refreshCategories();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-zinc-900">
            Category Management
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Organize products into customer-facing departments (Shirts, Trousers, Shoes, etc.).
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-primary text-white text-xs font-semibold rounded uppercase tracking-wider hover:bg-zinc-800 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories Table / Cards */}
      <div className="bg-white rounded-lg border border-zinc-200 shadow-xs overflow-hidden">
        {categories.length === 0 && !loading ? (
          <EmptyState
            title="No categories created yet"
            description="Create your first clothing or footwear category to organize your catalog."
            actionText="Add First Category"
            onAction={handleOpenCreate}
            icon={FolderTree}
          />
        ) : (
          <>
            {/* Mobile Card View with proper spacing from card borders */}
            <div className="md:hidden divide-y divide-zinc-200">
              {categories.map((cat) => (
                <div
                  key={`mobile-${cat.id}`}
                  className="p-4 sm:p-5 bg-white space-y-3"
                >
                  {/* Category Header Row */}
                  <div className="flex items-start gap-3 justify-between">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {cat.image ? (
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-12 h-12 rounded-lg object-cover bg-zinc-100 flex-shrink-0 border border-zinc-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-zinc-100 text-zinc-500 flex items-center justify-center font-bold text-sm flex-shrink-0 border border-zinc-200">
                          {cat.name.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-zinc-900 text-sm truncate">
                          {cat.name}
                        </h3>
                        <p className="font-mono text-[11px] text-zinc-400 truncate mt-0.5">
                          /category/{cat.slug}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider flex-shrink-0 ${
                        cat.isActive
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-zinc-100 text-zinc-600'
                      }`}
                    >
                      {cat.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    {cat.description || <span className="text-zinc-400 italic">No description provided</span>}
                  </p>

                  {/* Bottom Stats & Actions Row (With guaranteed breathing room from right & bottom borders) */}
                  <div className="pt-3 pb-1 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-y-2.5 gap-x-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-zinc-100 text-zinc-700 flex-shrink-0">
                      <span>📦</span>
                      <span>{cat.productCount} {cat.productCount === 1 ? 'Product' : 'Products'}</span>
                    </span>

                    <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(cat)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition-colors flex-shrink-0"
                        title="Edit Category"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePromptDelete(cat)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-red-50 text-red-700 hover:bg-red-100 text-xs font-semibold transition-colors flex-shrink-0"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 text-zinc-500 uppercase tracking-wider text-[10px] border-b border-zinc-200">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">Category</th>
                    <th className="py-3.5 px-4 font-semibold">Slug (URL)</th>
                    <th className="py-3.5 px-4 font-semibold">Description</th>
                    <th className="py-3.5 px-4 font-semibold">Products</th>
                    <th className="py-3.5 px-4 font-semibold">Status</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-zinc-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {cat.image ? (
                            <img
                              src={cat.image}
                              alt={cat.name}
                              className="w-8 h-8 rounded object-cover bg-zinc-100 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded bg-zinc-100 text-zinc-400 flex items-center justify-center font-bold text-xs">
                              {cat.name.charAt(0)}
                            </div>
                          )}
                          <span className="font-bold text-zinc-900">{cat.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-zinc-500">
                        /category/{cat.slug}
                      </td>
                      <td className="py-3.5 px-4 text-zinc-500 max-w-xs truncate">
                        {cat.description || '—'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-zinc-800">
                          {cat.productCount} {cat.productCount === 1 ? 'Product' : 'Products'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${
                            cat.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-zinc-100 text-zinc-600'
                          }`}
                        >
                          {cat.isActive ? 'Active' : 'Hidden'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(cat)}
                          className="p-1.5 text-blue-600 hover:text-blue-800"
                          title="Edit Category"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePromptDelete(cat)}
                          className="p-1.5 text-red-600 hover:text-red-800"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Category Create / Edit Modal */}
      <CategoryModal
        isOpen={modalOpen}
        category={editingCategory}
        onClose={() => setModalOpen(false)}
        onSuccess={handleModalSuccess}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Category?"
        message={`Are you sure you want to delete the category "${categoryToDelete?.name}"?`}
        confirmText="Delete Category"
        isDestructive={true}
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
}
