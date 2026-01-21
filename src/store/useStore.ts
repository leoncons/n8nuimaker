import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, N8nConnection, N8nWorkflow, GeneratedUI } from '../types';

// Mock workflows for development
const mockWorkflows: N8nWorkflow[] = [
  {
    id: 'workflow-1',
    name: 'Customer Onboarding',
    active: true,
    updatedAt: new Date().toISOString(),
    nodes: [
      {
        id: 'webhook-1',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        position: [250, 300],
        parameters: {
          path: 'customer-onboarding',
          responseMode: 'responseNode',
          options: {},
        },
        webhookId: 'abc123',
      },
    ],
  },
  {
    id: 'workflow-2',
    name: 'Lead Collection Form',
    active: true,
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    nodes: [
      {
        id: 'webhook-2',
        name: 'Form Webhook',
        type: 'n8n-nodes-base.webhook',
        position: [250, 300],
        parameters: {
          path: 'lead-form',
          responseMode: 'responseNode',
        },
        webhookId: 'def456',
      },
    ],
  },
  {
    id: 'workflow-3',
    name: 'Support Ticket Submission',
    active: true,
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
    nodes: [
      {
        id: 'webhook-3',
        name: 'Support Webhook',
        type: 'n8n-nodes-base.webhook',
        position: [250, 300],
        parameters: {
          path: 'support-ticket',
        },
        webhookId: 'ghi789',
      },
    ],
  },
  {
    id: 'workflow-4',
    name: 'Email Newsletter Signup',
    active: false,
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
    nodes: [
      {
        id: 'webhook-4',
        name: 'Newsletter Webhook',
        type: 'n8n-nodes-base.webhook',
        position: [250, 300],
        parameters: {
          path: 'newsletter',
        },
        webhookId: 'jkl012',
      },
    ],
  },
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'light',
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
        // Apply theme to document
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      // n8n Connection
      connection: null,
      setConnection: (connection: N8nConnection) => set({ connection }),
      testConnection: async () => {
        const { connection } = get();
        if (!connection) return false;

        try {
          // In production, this would make an actual API call to n8n
          // For now, we'll simulate a successful connection
          console.log('Testing connection to:', connection.baseUrl);

          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 500));

          // Mock successful connection
          set({
            connection: { ...connection, isConnected: true },
          });

          return true;
        } catch (error) {
          console.error('Connection test failed:', error);
          set({
            connection: { ...connection, isConnected: false },
          });
          return false;
        }
      },

      // Workflows
      workflows: [],
      setWorkflows: (workflows: N8nWorkflow[]) => set({ workflows }),
      fetchWorkflows: async () => {
        const { connection } = get();

        if (!connection?.isConnected) {
          console.warn('Not connected to n8n');
          return;
        }

        try {
          // In production, this would fetch from the n8n API:
          // const response = await fetch(`${connection.baseUrl}/api/v1/workflows`, {
          //   headers: {
          //     'X-N8N-API-KEY': connection.apiKey,
          //   },
          // });
          // const data = await response.json();

          // For now, use mock data
          await new Promise((resolve) => setTimeout(resolve, 300));
          set({ workflows: mockWorkflows });
        } catch (error) {
          console.error('Failed to fetch workflows:', error);
          // Still set mock data for development
          set({ workflows: mockWorkflows });
        }
      },

      // Generated UIs
      generatedUIs: [],
      addGeneratedUI: (ui: GeneratedUI) => {
        set((state) => ({
          generatedUIs: [...state.generatedUIs, ui],
        }));
      },
      updateGeneratedUI: (id: string, updates: Partial<GeneratedUI>) => {
        set((state) => ({
          generatedUIs: state.generatedUIs.map((ui) =>
            ui.id === id ? { ...ui, ...updates, updatedAt: new Date().toISOString() } : ui
          ),
        }));
      },
      deleteGeneratedUI: (id: string) => {
        set((state) => ({
          generatedUIs: state.generatedUIs.filter((ui) => ui.id !== id),
        }));
      },
      getGeneratedUI: (id: string) => {
        return get().generatedUIs.find((ui) => ui.id === id);
      },

      // Current editing UI
      currentUI: null,
      setCurrentUI: (ui: GeneratedUI | null) => set({ currentUI: ui }),
    }),
    {
      name: 'n8n-ui-maker-storage',
      partialize: (state) => ({
        theme: state.theme,
        connection: state.connection,
        generatedUIs: state.generatedUIs,
      }),
    }
  )
);

// Initialize theme on load
const theme = useStore.getState().theme;
if (theme === 'dark') {
  document.documentElement.classList.add('dark');
}
