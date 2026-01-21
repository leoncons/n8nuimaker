import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, CheckCircle, AlertCircle, Upload } from 'lucide-react';
import type { GeneratedUI, UIField } from '../types';
import { useStore } from '../store/useStore';

interface FormRendererProps {
  ui: GeneratedUI;
  isPreview: boolean;
}

export const FormRenderer: React.FC<FormRendererProps> = ({ ui, isPreview }) => {
  const { updateGeneratedUI } = useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<'success' | 'error' | null>(null);
  const [resultData, setResultData] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setSubmitResult(null);
    setResultData(null);

    try {
      if (isPreview) {
        // Simulate API delay in preview mode
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setSubmitResult('success');
        setResultData(data);
      } else {
        // In production, this would POST to the webhook URL
        // const response = await fetch(ui.webhookUrl, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(data),
        // });
        // const result = await response.json();

        // For now, simulate success
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setSubmitResult('success');
        setResultData({ message: 'Your submission was received successfully!' });

        // Update submission count
        updateGeneratedUI(ui.id, {
          submissionCount: (ui.submissionCount || 0) + 1,
          lastUsed: new Date().toISOString(),
        });
      }

      reset();
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitResult('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: UIField) => {
    const fieldId = `field-${field.id}`;
    const hasError = errors[field.originalKey];

    const baseInputClasses = `input ${
      hasError ? 'border-red-500 focus:ring-red-500' : ''
    }`;

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            id={fieldId}
            className={baseInputClasses}
            placeholder={field.placeholder}
            rows={4}
            {...register(field.originalKey, {
              required: field.required ? `${field.label} is required` : false,
            })}
          />
        );

      case 'select':
        return (
          <select
            id={fieldId}
            className={baseInputClasses}
            {...register(field.originalKey, {
              required: field.required ? `${field.label} is required` : false,
            })}
          >
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              id={fieldId}
              type="checkbox"
              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
              {...register(field.originalKey, {
                required: field.required ? `${field.label} is required` : false,
              })}
            />
            <label
              htmlFor={fieldId}
              className="ml-2 text-sm text-gray-700 dark:text-gray-300"
            >
              {field.placeholder || field.label}
            </label>
          </div>
        );

      case 'file':
        return (
          <div className="relative">
            <input
              id={fieldId}
              type="file"
              className="hidden"
              {...register(field.originalKey, {
                required: field.required ? `${field.label} is required` : false,
              })}
            />
            <label
              htmlFor={fieldId}
              className="flex items-center justify-center space-x-2 input cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <Upload className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">
                {field.placeholder || 'Choose file'}
              </span>
            </label>
          </div>
        );

      default:
        return (
          <input
            id={fieldId}
            type={field.type}
            className={baseInputClasses}
            placeholder={field.placeholder}
            {...register(field.originalKey, {
              required: field.required ? `${field.label} is required` : false,
              ...(field.type === 'email' && {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              }),
              ...(field.validation && {
                min: field.validation.min,
                max: field.validation.max,
                pattern: field.validation.pattern
                  ? {
                      value: new RegExp(field.validation.pattern),
                      message: field.validation.message || 'Invalid format',
                    }
                  : undefined,
              }),
            })}
          />
        );
    }
  };

  return (
    <div className="card p-8">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-3xl font-bold mb-3"
          style={{ color: ui.branding.primaryColor }}
        >
          {ui.branding.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">{ui.branding.description}</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div
          className={`grid gap-6 ${
            ui.layout.columns === 2 ? 'md:grid-cols-2' : 'grid-cols-1'
          }`}
        >
          {ui.fields.map((field) => (
            <div key={field.id} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
              <label htmlFor={`field-${field.id}`} className="label">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {renderField(field)}

              {field.helpText && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {field.helpText}
                </p>
              )}

              {errors[field.originalKey] && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors[field.originalKey]?.message as string}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-6 rounded-lg text-white font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: ui.branding.primaryColor,
            }}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center space-x-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Submitting...</span>
              </span>
            ) : (
              ui.layout.submitButtonText
            )}
          </button>
        </div>
      </form>

      {/* Result Messages */}
      {submitResult === 'success' && ui.layout.showResults && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 animate-fade-in">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-green-900 dark:text-green-300 mb-1">
                Success!
              </h3>
              <p className="text-sm text-green-800 dark:text-green-400">
                {ui.layout.successMessage}
              </p>
              {isPreview && resultData && (
                <details className="mt-3">
                  <summary className="text-sm text-green-700 dark:text-green-500 cursor-pointer hover:underline">
                    View submitted data
                  </summary>
                  <pre className="mt-2 p-3 bg-green-100 dark:bg-green-900/40 rounded text-xs overflow-x-auto">
                    {JSON.stringify(resultData, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      )}

      {submitResult === 'error' && (
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 animate-fade-in">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-900 dark:text-red-300 mb-1">
                Submission Failed
              </h3>
              <p className="text-sm text-red-800 dark:text-red-400">
                {ui.layout.errorMessage ||
                  'Something went wrong. Please try again later.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
