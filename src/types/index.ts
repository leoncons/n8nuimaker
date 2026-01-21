// n8n API Types
export interface N8nWorkflow {
  id: string;
  name: string;
  active: boolean;
  updatedAt: string;
  nodes: N8nNode[];
  connections?: Record<string, any>;
}

export interface N8nNode {
  id: string;
  name: string;
  type: string;
  typeVersion?: number;
  position: [number, number];
  parameters: Record<string, any>;
  webhookId?: string;
}

export interface N8nConnection {
  baseUrl: string;
  apiKey: string;
  isConnected: boolean;
}

// Generated UI Types
export interface GeneratedUI {
  id: string;
  name: string;
  workflowId: string;
  workflowName: string;
  webhookUrl: string;
  branding: UIBranding;
  fields: UIField[];
  layout: UILayout;
  createdAt: string;
  updatedAt: string;
  submissionCount?: number;
  lastUsed?: string;
}

export interface UIBranding {
  logo?: string;
  primaryColor: string;
  title: string;
  description: string;
}

export interface UIField {
  id: string;
  originalKey: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  helpText?: string;
  defaultValue?: any;
  options?: Array<{ label: string; value: string }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export type FieldType =
  | 'text'
  | 'email'
  | 'number'
  | 'tel'
  | 'url'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'time'
  | 'datetime'
  | 'file'
  | 'color'
  | 'range';

export interface UILayout {
  columns: 1 | 2;
  showResults: boolean;
  submitButtonText: string;
  successMessage: string;
  errorMessage?: string;
}

// Webhook Response Types
export interface WebhookResponse {
  success: boolean;
  data?: any;
  error?: string;
}

// Store Types
export interface AppState {
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // n8n Connection
  connection: N8nConnection | null;
  setConnection: (connection: N8nConnection) => void;
  testConnection: () => Promise<boolean>;

  // Workflows
  workflows: N8nWorkflow[];
  setWorkflows: (workflows: N8nWorkflow[]) => void;
  fetchWorkflows: () => Promise<void>;

  // Generated UIs
  generatedUIs: GeneratedUI[];
  addGeneratedUI: (ui: GeneratedUI) => void;
  updateGeneratedUI: (id: string, ui: Partial<GeneratedUI>) => void;
  deleteGeneratedUI: (id: string) => void;
  getGeneratedUI: (id: string) => GeneratedUI | undefined;

  // Current editing UI
  currentUI: GeneratedUI | null;
  setCurrentUI: (ui: GeneratedUI | null) => void;
}
