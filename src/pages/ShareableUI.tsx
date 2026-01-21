import React from 'react';
import { useParams } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { useStore } from '../store/useStore';
import { FormRenderer } from '../components/FormRenderer';

export const ShareableUI: React.FC = () => {
  const { uiId } = useParams<{ uiId: string }>();
  const { getGeneratedUI } = useStore();

  const ui = getGeneratedUI(uiId!);

  if (!ui) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
            <ExternalLink className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Form Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            This form may have been removed or the link is incorrect.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <FormRenderer ui={ui} isPreview={false} />

        {/* Powered by footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Powered by{' '}
            <a
              href="/"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              n8n UI Maker
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
