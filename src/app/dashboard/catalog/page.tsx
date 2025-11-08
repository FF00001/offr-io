'use client';

import { useState, useEffect, useRef, DragEvent } from 'react';
import DashboardLayoutWrapper from '@/components/dashboard/DashboardLayoutWrapper';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/lib/i18n';

interface CatalogItem {
  description: string;
  unit: string;
  unitPrice: number;
}

interface Catalog {
  id: string;
  userId: string;
  name: string;
  data: CatalogItem[];
  uploadedAt: string;
}

interface DeleteModalProps {
  isOpen: boolean;
  catalogName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteConfirmationModal({ isOpen, catalogName, onConfirm, onCancel }: DeleteModalProps) {
  const t = useTranslation();
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t.catalog.confirmDelete}
        </h3>
        <p className="text-gray-600 mb-6">
          {t.catalog.deleteCatalogMessage.replace('{catalogName}', catalogName)}
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            {t.dashboard.cancel}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
          >
            {t.dashboard.confirmButton}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  const t = useTranslation();
  const { language } = useLanguage();
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [selectedCatalog, setSelectedCatalog] = useState<Catalog | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    catalogId: string | null;
    catalogName: string;
  }>({
    isOpen: false,
    catalogId: null,
    catalogName: '',
  });

  // Fetch catalogs on mount
  useEffect(() => {
    fetchCatalogs();
  }, []);

  const fetchCatalogs = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/catalogs');
      if (!response.ok) {
        throw new Error('Failed to fetch catalogs');
      }
      const data = await response.json();
      setCatalogs(data.catalogs || []);
      if (data.catalogs && data.catalogs.length > 0) {
        setSelectedCatalog(data.catalogs[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load catalogs');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', file.name.replace('.csv', ''));

      let response;
      if (selectedCatalog) {
        // Update existing catalog
        formData.append('catalogId', selectedCatalog.id);
        response = await fetch('/api/catalogs', {
          method: 'PUT',
          body: formData,
        });
      } else {
        // Create new catalog
        response = await fetch('/api/catalogs', {
          method: 'POST',
          body: formData,
        });
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to upload catalog');
      }

      const data = await response.json();
      setSuccess(
        selectedCatalog
          ? 'Catalog updated successfully!'
          : 'Catalog uploaded successfully!'
      );

      // Refresh catalogs
      await fetchCatalogs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const locale = language === 'fr' ? 'fr-FR' : 'en-US';
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDeleteClick = (catalogId: string, catalogName: string) => {
    setDeleteModal({
      isOpen: true,
      catalogId,
      catalogName,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.catalogId) return;

    try {
      const response = await fetch('/api/catalogs', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ catalogId: deleteModal.catalogId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete catalog');
      }

      // Remove the catalog from the list
      setCatalogs(catalogs.filter(c => c.id !== deleteModal.catalogId));
      
      // If the deleted catalog was selected, clear the selection
      if (selectedCatalog?.id === deleteModal.catalogId) {
        setSelectedCatalog(null);
      }
      
      setDeleteModal({ isOpen: false, catalogId: null, catalogName: '' });
      setSuccess('Catalog deleted successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete catalog');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, catalogId: null, catalogName: '' });
  };

  return (
    <DashboardLayoutWrapper>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="mt-4">
          <h1 className="text-3xl font-bold text-gray-900 ml-4">{t.catalog.title}</h1>
          <p className="mt-2 text-gray-600 ml-4">
            {t.catalog.description}
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {selectedCatalog ? t.catalog.updateCatalog : t.catalog.uploadNewCatalog}
          </h2>

          {/* Catalog Selector */}
          {catalogs.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.catalog.selectCatalogLabel}
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedCatalog?.id || ''}
                  onChange={(e) => {
                    const catalog = catalogs.find((c) => c.id === e.target.value);
                    setSelectedCatalog(catalog || null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                >
                  <option value="">{t.catalog.createNewCatalog}</option>
                  {catalogs.map((catalog) => (
                    <option key={catalog.id} value={catalog.id}>
                      {catalog.name} ({catalog.data.length} {t.catalog.items})
                    </option>
                  ))}
                </select>
                {selectedCatalog && (
                  <button
                    onClick={() => handleDeleteClick(selectedCatalog.id, selectedCatalog.name)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors"
                  >
                    {t.catalog.deleteCatalog}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Drag and Drop Area */}
          <div
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
              ${
                isDragging
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 bg-gray-50 hover:border-gray-400'
              }
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileInputChange}
              className="hidden"
            />

            <div className="space-y-4">
              {/* Upload Icon */}
              <div className="flex justify-center">
                <svg
                  className={`w-12 h-12 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>

              <div>
                <p className="text-base font-medium text-gray-900">
                  {isDragging ? t.catalog.dropFileHere : t.catalog.dragAndDrop}
                </p>
                <p className="text-sm text-gray-600 mt-1">{t.catalog.or}</p>
              </div>

              <button
                type="button"
                onClick={handleBrowseClick}
                disabled={uploading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? t.catalog.uploading : t.catalog.browseFiles}
              </button>

              <p className="text-xs text-gray-500">
                {t.catalog.csvFormat}
              </p>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          {/* CSV Format Example */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">{t.catalog.csvFormatExample}</h3>
            <pre className="text-xs text-blue-800 font-mono overflow-x-auto">
              {`description,unit,unitPrice
Water heater 200L,unit,450.00
PVC pipe 50mm,meter,15.50
Bathroom mixer,unit,89.99`}
            </pre>
          </div>
        </div>

        {/* Current Catalog Display */}
        {selectedCatalog && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedCatalog.name}
                </h2>
                <p className="text-sm text-gray-600">
                  {selectedCatalog.data.length} {t.catalog.items} • {t.catalog.lastUpdated}: {formatDate(selectedCatalog.uploadedAt)}
                </p>
              </div>
            </div>

            {/* Catalog Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.catalog.description}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.catalog.unit}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.catalog.unitPrice}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedCatalog.data.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-sm text-gray-500">
                        {t.catalog.noItems}
                      </td>
                    </tr>
                  ) : (
                    selectedCatalog.data.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.description}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {item.unit}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">
                          €{item.unitPrice.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* No Catalogs State */}
        {!loading && catalogs.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">{t.catalog.noCatalogsYet}</h3>
            <p className="mt-2 text-sm text-gray-600">
              {t.catalog.uploadFirstCatalog}
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-sm text-gray-600">{t.catalog.loadingCatalogs}</p>
          </div>
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        catalogName={deleteModal.catalogName}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </DashboardLayoutWrapper>
  );
}
