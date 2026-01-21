import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Eye,
  ExternalLink,
  Copy,
  Trash2,
  BarChart3,
  Clock,
  Share2,
  Download,
  QrCode,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import type { GeneratedUI } from '../types';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { generatedUIs, deleteGeneratedUI, connection } = useStore();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLink = (uiId: string) => {
    const url = `${window.location.origin}/s/${uiId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(uiId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this UI? This action cannot be undone.')) {
      deleteGeneratedUI(id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (!connection) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full mb-4">
          <ExternalLink className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Welcome to n8n UI Maker
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
          Create beautiful, shareable frontend UIs for your n8n workflows in minutes.
        </p>
        <button
          onClick={() => navigate('/settings')}
          className="btn btn-primary inline-flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Get Started - Connect n8n</span>
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your generated workflow UIs
            </p>
          </div>
          {connection.isConnected && (
            <button
              onClick={() => navigate('/workflows')}
              className="btn btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create New UI</span>
            </button>
          )}
        </div>

        {/* Stats */}
        {generatedUIs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Total UIs
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {generatedUIs.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                  <ExternalLink className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Total Submissions
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {generatedUIs.reduce((sum, ui) => sum + (ui.submissionCount || 0), 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Active Workflows
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {new Set(generatedUIs.map((ui) => ui.workflowId)).size}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  <Share2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {generatedUIs.length === 0 && (
        <div className="card p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
            <ExternalLink className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No UIs Created Yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Start by browsing your n8n workflows and selecting one to create a shareable
            UI frontend.
          </p>
          {connection.isConnected ? (
            <button
              onClick={() => navigate('/workflows')}
              className="btn btn-primary inline-flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Your First UI</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/settings')}
              className="btn btn-primary inline-flex items-center space-x-2"
            >
              <span>Connect to n8n First</span>
            </button>
          )}
        </div>
      )}

      {/* UIs Grid */}
      {generatedUIs.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Your Generated UIs
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {generatedUIs.map((ui) => (
              <UICard
                key={ui.id}
                ui={ui}
                onCopyLink={() => handleCopyLink(ui.id)}
                onDelete={() => handleDelete(ui.id)}
                onPreview={() => navigate(`/preview/${ui.id}`)}
                onOpen={() => window.open(`/s/${ui.id}`, '_blank')}
                copied={copiedId === ui.id}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface UICardProps {
  ui: GeneratedUI;
  onCopyLink: () => void;
  onDelete: () => void;
  onPreview: () => void;
  onOpen: () => void;
  copied: boolean;
}

const UICard: React.FC<UICardProps> = ({
  ui,
  onCopyLink,
  onDelete,
  onPreview,
  onOpen,
  copied,
}) => {
  return (
    <div className="card p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: ui.branding.primaryColor }}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {ui.name}
            </h3>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Workflow: {ui.workflowName}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>{ui.submissionCount || 0} submissions</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Created {formatDate(ui.createdAt)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>{ui.fields.length} fields</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={onPreview}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="Preview"
          >
            <Eye className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          <button
            onClick={onOpen}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="Open in new tab"
          >
            <ExternalLink className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          <button
            onClick={onCopyLink}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="Copy link"
          >
            {copied ? (
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                Copied!
              </span>
            ) : (
              <Copy className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>

          <button
            onClick={onDelete}
            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};
