import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useStore } from '../store/useStore';
import { FormRenderer } from '../components/FormRenderer';

export const Preview: React.FC = () => {
  const { uiId } = useParams<{ uiId: string }>();
  const navigate = useNavigate();
  const { getGeneratedUI, currentUI } = useStore();

  const ui = uiId === 'preview' ? currentUI : getGeneratedUI(uiId!);

  if (!ui) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400 mb-4">UI not found</p>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Preview: {ui.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              This is how your form will look to users
            </p>
          </div>
        </div>
      </div>

      {/* Preview Notice */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          This is a preview. Form submissions will not be sent to your workflow.
        </p>
      </div>

      {/* Form Preview */}
      <div className="max-w-4xl mx-auto">
        <FormRenderer ui={ui} isPreview={true} />
      </div>
    </div>
  );
};
