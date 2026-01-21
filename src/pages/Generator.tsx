import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import {
  Save,
  Eye,
  Palette,
  Layout as LayoutIcon,
  List,
  GripVertical,
  Trash2,
  Plus,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import type { GeneratedUI, UIField, FieldType } from '../types';

export const Generator: React.FC = () => {
  const { workflowId } = useParams<{ workflowId: string }>();
  const navigate = useNavigate();
  const { workflows, connection, addGeneratedUI, setCurrentUI } = useStore();

  const workflow = workflows.find((w) => w.id === workflowId);
  const webhookNode = workflow?.nodes.find(
    (node) => node.type === 'n8n-nodes-base.webhook'
  );

  // UI State
  const [uiName, setUiName] = useState(`${workflow?.name} Form` || 'New Form');
  const [primaryColor, setPrimaryColor] = useState('#6366f1');
  const [title, setTitle] = useState('Submit Your Information');
  const [description, setDescription] = useState('Fill out this form to get started');
  const [columns, setColumns] = useState<1 | 2>(1);
  const [submitButtonText, setSubmitButtonText] = useState('Submit');
  const [successMessage, setSuccessMessage] = useState(
    'Thank you! Your submission was received.'
  );

  // Fields State - Initialize with sample fields
  const [fields, setFields] = useState<UIField[]>([
    {
      id: nanoid(),
      originalKey: 'name',
      label: 'Full Name',
      type: 'text',
      required: true,
      placeholder: 'Enter your full name',
      helpText: '',
    },
    {
      id: nanoid(),
      originalKey: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      placeholder: 'your@email.com',
      helpText: 'We\'ll never share your email',
    },
    {
      id: nanoid(),
      originalKey: 'message',
      label: 'Message',
      type: 'textarea',
      required: false,
      placeholder: 'Your message here...',
      helpText: '',
    },
  ]);

  const [activeTab, setActiveTab] = useState<'branding' | 'fields' | 'layout'>('fields');

  if (!workflow || !webhookNode) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Workflow not found</p>
        <button onClick={() => navigate('/workflows')} className="btn btn-primary mt-4">
          Back to Workflows
        </button>
      </div>
    );
  }

  const webhookUrl = connection?.baseUrl
    ? `${connection.baseUrl}/webhook/${webhookNode.webhookId || webhookNode.parameters.path}`
    : 'https://n8n.example.com/webhook/example';

  const handleSave = () => {
    const generatedUI: GeneratedUI = {
      id: nanoid(),
      name: uiName,
      workflowId: workflow.id,
      workflowName: workflow.name,
      webhookUrl,
      branding: {
        primaryColor,
        title,
        description,
      },
      fields,
      layout: {
        columns,
        showResults: true,
        submitButtonText,
        successMessage,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      submissionCount: 0,
    };

    addGeneratedUI(generatedUI);
    setCurrentUI(generatedUI);
    navigate('/');
  };

  const handlePreview = () => {
    const tempUI: GeneratedUI = {
      id: 'preview',
      name: uiName,
      workflowId: workflow.id,
      workflowName: workflow.name,
      webhookUrl,
      branding: {
        primaryColor,
        title,
        description,
      },
      fields,
      layout: {
        columns,
        showResults: true,
        submitButtonText,
        successMessage,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCurrentUI(tempUI);
    navigate('/preview/preview');
  };

  const addField = () => {
    const newField: UIField = {
      id: nanoid(),
      originalKey: `field_${fields.length + 1}`,
      label: `Field ${fields.length + 1}`,
      type: 'text',
      required: false,
      placeholder: '',
      helpText: '',
    };
    setFields([...fields, newField]);
  };

  const updateField = (id: string, updates: Partial<UIField>) => {
    setFields(fields.map((field) => (field.id === id ? { ...field, ...updates } : field)));
  };

  const deleteField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    const newFields = [...fields];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= fields.length) return;

    [newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]];
    setFields(newFields);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create UI for {workflow.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Customize the form fields and appearance
          </p>
        </div>
        <div className="flex space-x-3">
          <button onClick={handlePreview} className="btn btn-secondary flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </button>
          <button onClick={handleSave} className="btn btn-primary flex items-center space-x-2">
            <Save className="w-4 h-4" />
            <span>Save & Finish</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* UI Name */}
          <div className="card p-6">
            <label className="label">UI Name</label>
            <input
              type="text"
              value={uiName}
              onChange={(e) => setUiName(e.target.value)}
              className="input"
              placeholder="Enter a name for this UI"
            />
          </div>

          {/* Tabs */}
          <div className="card overflow-hidden">
            <div className="border-b border-gray-200 dark:border-gray-800">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('fields')}
                  className={`flex items-center space-x-2 px-6 py-3 font-medium transition-colors border-b-2 ${
                    activeTab === 'fields'
                      ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  <List className="w-4 h-4" />
                  <span>Fields</span>
                </button>
                <button
                  onClick={() => setActiveTab('branding')}
                  className={`flex items-center space-x-2 px-6 py-3 font-medium transition-colors border-b-2 ${
                    activeTab === 'branding'
                      ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  <Palette className="w-4 h-4" />
                  <span>Branding</span>
                </button>
                <button
                  onClick={() => setActiveTab('layout')}
                  className={`flex items-center space-x-2 px-6 py-3 font-medium transition-colors border-b-2 ${
                    activeTab === 'layout'
                      ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  <LayoutIcon className="w-4 h-4" />
                  <span>Layout</span>
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Fields Tab */}
              {activeTab === 'fields' && (
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <FieldEditor
                      key={field.id}
                      field={field}
                      onUpdate={(updates) => updateField(field.id, updates)}
                      onDelete={() => deleteField(field.id)}
                      onMoveUp={index > 0 ? () => moveField(index, 'up') : undefined}
                      onMoveDown={
                        index < fields.length - 1 ? () => moveField(index, 'down') : undefined
                      }
                    />
                  ))}
                  <button onClick={addField} className="btn btn-secondary w-full flex items-center justify-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Add Field</span>
                  </button>
                </div>
              )}

              {/* Branding Tab */}
              {activeTab === 'branding' && (
                <div className="space-y-6">
                  <div>
                    <label className="label">Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="input"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="label">Primary Color</label>
                    <div className="flex space-x-3">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-16 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="input flex-1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Layout Tab */}
              {activeTab === 'layout' && (
                <div className="space-y-6">
                  <div>
                    <label className="label">Form Layout</label>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setColumns(1)}
                        className={`flex-1 py-3 rounded-lg border-2 transition-colors ${
                          columns === 1
                            ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-300 dark:border-gray-700'
                        }`}
                      >
                        Single Column
                      </button>
                      <button
                        onClick={() => setColumns(2)}
                        className={`flex-1 py-3 rounded-lg border-2 transition-colors ${
                          columns === 2
                            ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-300 dark:border-gray-700'
                        }`}
                      >
                        Two Columns
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="label">Submit Button Text</label>
                    <input
                      type="text"
                      value={submitButtonText}
                      onChange={(e) => setSubmitButtonText(e.target.value)}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Success Message</label>
                    <textarea
                      value={successMessage}
                      onChange={(e) => setSuccessMessage(e.target.value)}
                      className="input"
                      rows={2}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-20">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Preview</h3>
            <div
              className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6"
              style={{ borderColor: primaryColor + '40' }}
            >
              <h2 className="text-xl font-bold mb-2" style={{ color: primaryColor }}>
                {title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{description}</p>
              <div className="space-y-3">
                {fields.slice(0, 3).map((field) => (
                  <div key={field.id}>
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {field.label}
                      {field.required && <span className="text-red-500"> *</span>}
                    </label>
                    <div className="mt-1 h-8 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700" />
                  </div>
                ))}
                {fields.length > 3 && (
                  <p className="text-xs text-gray-500">+ {fields.length - 3} more fields</p>
                )}
              </div>
              <button
                className="w-full mt-4 py-2 rounded-lg text-white font-medium"
                style={{ backgroundColor: primaryColor }}
              >
                {submitButtonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface FieldEditorProps {
  field: UIField;
  onUpdate: (updates: Partial<UIField>) => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

const FieldEditor: React.FC<FieldEditorProps> = ({
  field,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const fieldTypes: FieldType[] = [
    'text',
    'email',
    'number',
    'tel',
    'url',
    'textarea',
    'select',
    'checkbox',
    'date',
    'time',
    'file',
  ];

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div className="flex items-center space-x-3">
        <div className="flex flex-col space-y-1">
          {onMoveUp && (
            <button
              onClick={onMoveUp}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            >
              <GripVertical className="w-4 h-4 text-gray-400" />
            </button>
          )}
          {onMoveDown && (
            <button
              onClick={onMoveDown}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            >
              <GripVertical className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
        <div className="flex-1">
          <input
            type="text"
            value={field.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            className="input"
            placeholder="Field label"
          />
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-3 py-2 text-sm text-primary-600 dark:text-primary-400 hover:underline"
        >
          {isExpanded ? 'Less' : 'More'}
        </button>
        <button
          onClick={onDelete}
          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-3 pl-10">
          <div>
            <label className="label text-xs">Field Type</label>
            <select
              value={field.type}
              onChange={(e) => onUpdate({ type: e.target.value as FieldType })}
              className="input"
            >
              {fieldTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label text-xs">Placeholder</label>
            <input
              type="text"
              value={field.placeholder || ''}
              onChange={(e) => onUpdate({ placeholder: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="label text-xs">Help Text</label>
            <input
              type="text"
              value={field.helpText || ''}
              onChange={(e) => onUpdate({ helpText: e.target.value })}
              className="input"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={field.required}
              onChange={(e) => onUpdate({ required: e.target.checked })}
              className="w-4 h-4 text-primary-600 rounded"
            />
            <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Required field
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
