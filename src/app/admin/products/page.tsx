/**
 * Admin Products Management Page
 * Interface for managing site products and services
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useAdminApi, useAdminLogger } from '../../../hooks/useSuperadmin';
import {
  Package,
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
  Image as ImageIcon,
  Save,
  X,
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface SiteProduct {
  id: string;
  title: string;
  description: string;
  features: string[];
  image_url?: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ProductFormData {
  title: string;
  description: string;
  features: string[];
  image_url: string;
  order_index: number;
  is_active: boolean;
}

const defaultFormData: ProductFormData = {
  title: '',
  description: '',
  features: [''],
  image_url: '',
  order_index: 0,
  is_active: true
};

export default function ProductsManagementPage() {
  const { adminFetch, isReady } = useAdminApi();
  const { logAction } = useAdminLogger();

  // State management
  const [products, setProducts] = useState<SiteProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SiteProduct | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(defaultFormData);

  // Load products on component mount
  useEffect(() => {
    if (isReady) {
      loadProducts();
    }
  }, [isReady]);

  // Auto-hide success messages
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminFetch('/api/admin/products');
      const data = await response.json();
      
      if (data.products) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setError(error instanceof Error ? error.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: SiteProduct) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      features: product.features.length ? product.features : [''],
      image_url: product.image_url || '',
      order_index: product.order_index,
      is_active: product.is_active
    });
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setFormData(defaultFormData);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      // Filter out empty features
      const cleanFeatures = formData.features.filter(feature => feature.trim());
      
      const productData = {
        ...formData,
        features: cleanFeatures
      };
      
      let response;
      let actionType;
      
      if (editingProduct) {
        response = await adminFetch(`/api/admin/products/${editingProduct.id}`, {
          method: 'PUT',
          body: JSON.stringify(productData)
        });
        actionType = 'update';
      } else {
        response = await adminFetch('/api/admin/products', {
          method: 'POST',
          body: JSON.stringify(productData)
        });
        actionType = 'create';
      }
      
      const result = await response.json();
      
      if (result.product) {
        await loadProducts();
        setIsModalOpen(false);
        setSuccessMessage(
          `Ürün başarıyla ${actionType === 'update' ? 'güncellendi' : 'oluşturuldu'}`
        );
        
        // Log the action
        await logAction(actionType, 'product', result.product.id);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      setError(error instanceof Error ? error.message : 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product: SiteProduct) => {
    if (!confirm(`"${product.title}" ürününü silmek istediğinizden emin misiniz?`)) {
      return;
    }
    
    try {
      setError(null);
      
      await adminFetch(`/api/admin/products/${product.id}`, {
        method: 'DELETE'
      });
      
      await loadProducts();
      setSuccessMessage('Ürün başarıyla silindi');
      
      // Log the action
      await logAction('delete', 'product', product.id);
    } catch (error) {
      console.error('Error deleting product:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete product');
    }
  };

  const handleToggleActive = async (product: SiteProduct) => {
    try {
      setError(null);
      
      const response = await adminFetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...product,
          is_active: !product.is_active
        })
      });
      
      if (response.ok) {
        await loadProducts();
        setSuccessMessage(
          `Ürün ${!product.is_active ? 'aktifleştirildi' : 'devre dışı bırakıldı'}`
        );
        
        // Log the action
        await logAction('toggle_active', 'product', product.id);
      }
    } catch (error) {
      console.error('Error toggling product status:', error);
      setError(error instanceof Error ? error.message : 'Failed to update product status');
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, '']
    });
  };

  const removeFeature = (index: number) => {
    if (formData.features.length > 1) {
      const newFeatures = formData.features.filter((_, i) => i !== index);
      setFormData({ ...formData, features: newFeatures });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-slate-400">Ürünler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Ürün Yönetimi</h1>
          <p className="text-slate-400 mt-1">
            Site ürünlerini ve hizmetlerini yönetin
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Ürün</span>
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-4 flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span className="text-green-400">{successMessage}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <span className="text-red-400">{error}</span>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className={`bg-slate-800 rounded-lg p-6 border ${
              product.is_active ? 'border-slate-700' : 'border-slate-600 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                {/* Drag Handle */}
                <div className="mt-2">
                  <GripVertical className="w-5 h-5 text-slate-500" />
                </div>
                
                {/* Product Image Placeholder */}
                <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-slate-500" />
                  )}
                </div>
                
                {/* Product Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-white">{product.title}</h3>
                    {!product.is_active && (
                      <span className="px-2 py-1 bg-yellow-900/50 text-yellow-400 text-xs rounded-full">
                        Pasif
                      </span>
                    )}
                  </div>
                  <p className="text-slate-300 mb-3">{product.description}</p>
                  
                  {/* Features */}
                  <div className="space-y-1">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-slate-400">
                        <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleToggleActive(product)}
                  className={`p-2 rounded-lg transition-colors ${
                    product.is_active
                      ? 'text-green-400 hover:bg-green-900/20'
                      : 'text-slate-500 hover:bg-slate-700'
                  }`}
                  title={product.is_active ? 'Devre dışı bırak' : 'Aktifleştir'}
                >
                  {product.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                
                <button
                  onClick={() => handleEdit(product)}
                  className="p-2 text-blue-400 hover:bg-blue-900/20 rounded-lg transition-colors"
                  title="Düzenle"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => handleDelete(product)}
                  className="p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {products.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-slate-400 text-lg font-medium">Henüz ürün yok</h3>
            <p className="text-slate-500 mt-2">İlk ürününüzü oluşturmak için "Yeni Ürün" butonuna tıklayın</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">
                  {editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-white"
                  disabled={saving}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Ürün Başlığı *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Ürün başlığını girin..."
                  disabled={saving}
                />
              </div>
              
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Açıklama *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Ürün açıklamasını girin..."
                  disabled={saving}
                />
              </div>
              
              {/* Features */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-300">
                    Özellikler
                  </label>
                  <button
                    onClick={addFeature}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                    disabled={saving}
                  >
                    + Özellik Ekle
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                        placeholder={`Özellik ${index + 1}`}
                        disabled={saving}
                      />
                      {formData.features.length > 1 && (
                        <button
                          onClick={() => removeFeature(index)}
                          className="text-red-400 hover:text-red-300 p-2"
                          disabled={saving}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Görsel URL
                </label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="https://example.com/image.jpg"
                  disabled={saving}
                />
              </div>
              
              {/* Order Index */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Sıra Numarası
                </label>
                <input
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  min="0"
                  disabled={saving}
                />
              </div>
              
              {/* Active Status */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                  disabled={saving}
                />
                <label htmlFor="is_active" className="text-sm text-slate-300">
                  Ürün aktif durumda
                </label>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-700 flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                disabled={saving}
              >
                İptal
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formData.title.trim() || !formData.description.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                <Save className="w-4 h-4" />
                <span>{saving ? 'Kaydediliyor...' : 'Kaydet'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}