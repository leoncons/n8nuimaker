import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Server, Key, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useStore } from '../store/useStore';

interface SettingsForm {
  baseUrl: string;
  apiKey: string;
}

export const Settings: React.FC = () => {
  const { connection, setConnection, testConnection } = useStore();
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SettingsForm>({
    defaultValues: {
      baseUrl: connection?.baseUrl || '',
      apiKey: connection?.apiKey || '',
    },
  });

  const onSubmit = async (data: SettingsForm) => {
    setIsTesting(true);
    setTestResult(null);

    // Save connection data
    setConnection({
      baseUrl: data.baseUrl,
      apiKey: data.apiKey,
      isConnected: false,
    });

    // Test the connection
    const success = await testConnection();
    setTestResult(success ? 'success' : 'error');
    setIsTesting(false);
  };

  const handleTestConnection = async () => {
    const formData = watch();
    if (!formData.baseUrl || !formData.apiKey) {
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    setConnection({
      baseUrl: formData.baseUrl,
      apiKey: formData.apiKey,
      isConnected: false,
    });

    const success = await testConnection();
    setTestResult(success ? 'success' : 'error');
    setIsTesting(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Configure your n8n instance connection to start creating UI frontends for your
          workflows.
        </p>
      </div>

      <div className="card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
            <Server className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              n8n Connection
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Connect to your n8n instance
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Base URL */}
          <div>
            <label htmlFor="baseUrl" className="label">
              n8n Base URL
            </label>
            <input
              id="baseUrl"
              type="url"
              className="input"
              placeholder="https://my-n8n.example.com"
              {...register('baseUrl', {
                required: 'Base URL is required',
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: 'Please enter a valid URL',
                },
              })}
            />
            {errors.baseUrl && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.baseUrl.message}
              </p>
            )}
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              The base URL of your n8n instance
            </p>
          </div>

          {/* API Key */}
          <div>
            <label htmlFor="apiKey" className="label">
              API Key
            </label>
            <div className="relative">
              <input
                id="apiKey"
                type={showApiKey ? 'text' : 'password'}
                className="input pr-20"
                placeholder="Enter your n8n API key"
                {...register('apiKey', {
                  required: 'API Key is required',
                  minLength: {
                    value: 10,
                    message: 'API key seems too short',
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                {showApiKey ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.apiKey && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.apiKey.message}
              </p>
            )}
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Generate an API key in your n8n instance settings
            </p>
          </div>

          {/* Test Result */}
          {testResult && (
            <div
              className={`flex items-center space-x-2 p-4 rounded-lg ${
                testResult === 'success'
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                  : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300'
              }`}
            >
              {testResult === 'success' ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">
                    Connection successful! You're ready to create UIs.
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5" />
                  <span className="font-medium">
                    Connection failed. Please check your credentials and try again.
                  </span>
                </>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="btn btn-secondary flex items-center space-x-2"
            >
              {isTesting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Testing...</span>
                </>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  <span>Test Connection</span>
                </>
              )}
            </button>

            <button type="submit" disabled={isTesting} className="btn btn-primary">
              Save Settings
            </button>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
            How to get your API key
          </h3>
          <ol className="text-sm text-blue-800 dark:text-blue-400 space-y-1 list-decimal list-inside">
            <li>Log in to your n8n instance</li>
            <li>Go to Settings → API</li>
            <li>Create a new API key</li>
            <li>Copy and paste it here</li>
          </ol>
        </div>
      </div>

      {/* Security Notice */}
      <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <p className="text-sm text-yellow-800 dark:text-yellow-300">
          <strong>Security Note:</strong> Your API key is stored locally in your browser
          and never sent to any external servers. It's only used to communicate directly
          with your n8n instance.
        </p>
      </div>
    </div>
  );
};
