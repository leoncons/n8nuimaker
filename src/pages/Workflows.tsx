import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Workflow as WorkflowIcon,
  Clock,
  Circle,
  CheckCircle,
  ExternalLink,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import type { N8nWorkflow } from '../types';

export const Workflows: React.FC = () => {
  const navigate = useNavigate();
  const { connection, workflows, fetchWorkflows } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    if (connection?.isConnected) {
      loadWorkflows();
    }
  }, [connection]);

  const loadWorkflows = async () => {
    setIsLoading(true);
    await fetchWorkflows();
    setIsLoading(false);
  };

  // Filter workflows based on search and status
  const filteredWorkflows = workflows.filter((workflow) => {
    const matchesSearch = workflow.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === 'all' ||
      (filter === 'active' && workflow.active) ||
      (filter === 'inactive' && !workflow.active);
    return matchesSearch && matchesFilter;
  });

  // Only show workflows with webhook triggers
  const webhookWorkflows = filteredWorkflows.filter((workflow) =>
    workflow.nodes.some((node) => node.type === 'n8n-nodes-base.webhook')
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  if (!connection) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
          <AlertCircle className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No n8n Connection
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Please configure your n8n connection first
        </p>
        <button
          onClick={() => navigate('/settings')}
          className="btn btn-primary"
        >
          Go to Settings
        </button>
      </div>
    );
  }

  if (!connection.isConnected) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full mb-4">
          <AlertCircle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Connection Not Tested
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Please test your n8n connection before browsing workflows
        </p>
        <button
          onClick={() => navigate('/settings')}
          className="btn btn-primary"
        >
          Test Connection
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
              Workflows
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Select a workflow to create a shareable UI frontend
            </p>
          </div>
          <button
            onClick={loadWorkflows}
            disabled={isLoading}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search workflows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'active'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('inactive')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'inactive'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              Inactive
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading workflows...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && webhookWorkflows.length === 0 && (
        <div className="text-center py-12 card">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
            <WorkflowIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Workflows Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
            {searchQuery
              ? 'No workflows match your search query'
              : 'No workflows with webhook triggers found. Only workflows with webhooks can have UI frontends.'}
          </p>
        </div>
      )}

      {/* Workflows Grid */}
      {!isLoading && webhookWorkflows.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {webhookWorkflows.map((workflow) => (
            <WorkflowCard
              key={workflow.id}
              workflow={workflow}
              onSelect={() => navigate(`/generate/${workflow.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface WorkflowCardProps {
  workflow: N8nWorkflow;
  onSelect: () => void;
}

const WorkflowCard: React.FC<WorkflowCardProps> = ({ workflow, onSelect }) => {
  return (
    <div className="card p-6 hover:shadow-md transition-shadow cursor-pointer group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
            <WorkflowIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {workflow.name}
            </h3>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          {workflow.active ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Active</span>
            </>
          ) : (
            <>
              <Circle className="w-4 h-4 text-gray-400" />
              <span>Inactive</span>
            </>
          )}
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <Clock className="w-4 h-4" />
          <span>Updated {formatDate(workflow.updatedAt)}</span>
        </div>
      </div>

      <button
        onClick={onSelect}
        className="w-full btn btn-primary flex items-center justify-center space-x-2"
      >
        <span>Create UI</span>
        <ExternalLink className="w-4 h-4" />
      </button>
    </div>
  );
};
