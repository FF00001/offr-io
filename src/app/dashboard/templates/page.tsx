'use client';

import { useState, useEffect, useRef } from 'react';
import DashboardLayoutWrapper from '@/components/dashboard/DashboardLayoutWrapper';

interface Template {
  id: string;
  userId: string;
  name: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
  updatedAt: string;
}

interface DeleteModalProps {
  isOpen: boolean;
  templateName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

interface RenameModalProps {
  isOpen: boolean;
  currentName: string;
  onConfirm: (newName: string) => void;
  onCancel: () => void;
}

function DeleteConfirmationModal({ isOpen, templateName, onConfirm, onCancel }: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Confirm Deletion
        </h3>
        <p className="text-gray-600 mb-6">
          Cette action est irréversible. Le template {templateName} sera définitivement perdu.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function RenameModal({ isOpen, currentName, onConfirm, onCancel }: RenameModalProps) {
  const [newName, setNewName] = useState(currentName);

  useEffect(() => {
    setNewName(currentName);
  }, [currentName]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      onConfirm(newName.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Rename Template
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="templateName" className="block text-sm font-medium text-gray-700 mb-2">
              Template Name
            </label>
            <input
              id="templateName"
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              placeholder="Enter template name"
              autoFocus
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newName.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Rename
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [templateName, setTemplateName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    templateId: string | null;
    templateName: string;
  }>({
    isOpen: false,
    templateId: null,
    templateName: '',
  });

  const [renameModal, setRenameModal] = useState<{
    isOpen: boolean;
    templateId: string | null;
    currentName: string;
  }>({
    isOpen: false,
    templateId: null,
    currentName: '',
  });

  // Fetch templates on mount
  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/templates');
      if (!response.ok) {
        throw new Error('Failed to fetch templates');
      }
      const data = await response.json();
      setTemplates(data.templates || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    if (!templateName.trim()) {
      setError('Please enter a template name');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', templateName.trim());

      const response = await fetch('/api/templates', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to upload template');
      }

      setSuccess('Template uploaded successfully!');
      setTemplateName('');
      
      // Refresh templates
      await fetchTemplates();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUploadClick = () => {
    if (!templateName.trim()) {
      setError('Please enter a template name');
      return;
    }
    fileInputRef.current?.click();
  };

  const handleDeleteClick = (templateId: string, templateName: string) => {
    setDeleteModal({
      isOpen: true,
      templateId,
      templateName,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.templateId) return;

    try {
      const response = await fetch('/api/templates', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: deleteModal.templateId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete template');
      }

      // Remove the template from the list
      setTemplates(templates.filter(t => t.id !== deleteModal.templateId));
      
      setDeleteModal({ isOpen: false, templateId: null, templateName: '' });
      setSuccess('Template deleted successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete template');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, templateId: null, templateName: '' });
  };

  const handleRenameClick = (templateId: string, currentName: string) => {
    setRenameModal({
      isOpen: true,
      templateId,
      currentName,
    });
  };

  const handleRenameConfirm = async (newName: string) => {
    if (!renameModal.templateId) return;

    try {
      const response = await fetch('/api/templates', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: renameModal.templateId, 
          name: newName 
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to rename template');
      }

      // Update the template in the list
      setTemplates(templates.map(t => 
        t.id === renameModal.templateId 
          ? { ...t, name: newName, updatedAt: new Date().toISOString() }
          : t
      ));
      
      setRenameModal({ isOpen: false, templateId: null, currentName: '' });
      setSuccess('Template renamed successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to rename template');
    }
  };

  const handleRenameCancel = () => {
    setRenameModal({ isOpen: false, templateId: null, currentName: '' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <DashboardLayoutWrapper>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="mt-4">
          <h1 className="text-3xl font-bold text-gray-900 ml-4">Template Management</h1>
          <p className="mt-2 text-gray-600 ml-4">
            Upload and manage your estimate templates
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Upload New Template
          </h2>

          <div className="space-y-4">
            {/* Template Name Input */}
            <div>
              <label htmlFor="templateNameInput" className="block text-sm font-medium text-gray-700 mb-2">
                Template Name
              </label>
              <input
                id="templateNameInput"
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder="Enter template name"
              />
            </div>

            {/* File Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Template File
              </label>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={handleUploadClick}
                disabled={uploading || !templateName.trim()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-5 h-5 mr-2 text-gray-500"
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
                {uploading ? 'Uploading...' : 'Choose File'}
              </button>
              <p className="mt-2 text-xs text-gray-500">
                Any file type accepted
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
        </div>

        {/* Templates List */}
        {!loading && templates.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Your Templates ({templates.length})
            </h2>

            {/* Templates Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Template Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      File Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Updated
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {templates.map((template) => (
                    <tr key={template.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {template.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {template.fileName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatFileSize(template.fileSize)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(template.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(template.updatedAt)}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleRenameClick(template.id, template.name)}
                            className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
                          >
                            Rename
                          </button>
                          <button
                            onClick={() => handleDeleteClick(template.id, template.name)}
                            className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* No Templates State */}
        {!loading && templates.length === 0 && (
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
            <h3 className="mt-4 text-lg font-medium text-gray-900">No templates yet</h3>
            <p className="mt-2 text-sm text-gray-600">
              Upload your first template to get started
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-sm text-gray-600">Loading templates...</p>
          </div>
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        templateName={deleteModal.templateName}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      <RenameModal
        isOpen={renameModal.isOpen}
        currentName={renameModal.currentName}
        onConfirm={handleRenameConfirm}
        onCancel={handleRenameCancel}
      />
    </DashboardLayoutWrapper>
  );
}
