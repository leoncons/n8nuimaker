# n8n UI Maker

A web application that automatically generates clean, shareable frontend UIs for n8n workflows. This tool allows technical users to expose their n8n workflows to non-technical clients without building custom interfaces each time.

## Features

### 🔌 n8n Connection Setup
- Configure your n8n instance connection
- Secure API key storage (localStorage only)
- Connection testing and validation

### 📋 Workflow Browser
- Browse all workflows from your n8n instance
- Filter workflows with webhook triggers
- Search and filter by status (active/inactive)
- Real-time workflow synchronization

### 🎨 Auto-Generated Frontend UI
- Smart field detection from webhook parameters
- Multiple field types support (text, email, number, textarea, select, date, file, etc.)
- Automatic form generation based on workflow input schema
- Responsive design for mobile and desktop

### ✨ UI Customization
- **Branding**: Custom colors, titles, and descriptions
- **Field Customization**: Rename labels, add help text, reorder fields
- **Layout Options**: Single or two-column layouts
- **Validation**: Required fields, custom validation rules
- **Success Messages**: Customizable success and error messages

### 🚀 Share & Export
- Generate unique shareable URLs
- Public-facing clean UI (no app navigation)
- Copy link functionality
- Preview mode before publishing

### 📊 Dashboard
- List of all generated UIs
- Usage statistics (submission counts)
- Quick actions (preview, copy link, delete)
- Workflow management

### 🌓 Theme Support
- Light and dark mode toggle
- Persistent theme preference
- Modern, clean design inspired by Linear and Notion

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: Zustand with persistence
- **Form Handling**: React Hook Form
- **Icons**: Lucide React
- **ID Generation**: nanoid

## Project Structure

```
n8nuimaker/
├── src/
│   ├── components/
│   │   ├── Layout.tsx          # Main app layout with navigation
│   │   └── FormRenderer.tsx    # Dynamic form rendering component
│   ├── pages/
│   │   ├── Dashboard.tsx       # Main dashboard with UI list
│   │   ├── Settings.tsx        # n8n connection configuration
│   │   ├── Workflows.tsx       # Browse n8n workflows
│   │   ├── Generator.tsx       # UI customization panel
│   │   ├── Preview.tsx         # Preview generated UI
│   │   └── ShareableUI.tsx     # Public shareable form page
│   ├── store/
│   │   └── useStore.ts         # Zustand store with persistence
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   ├── utils/
│   │   ├── nodeValidator.js    # Node validation utilities
│   │   └── nodeValidator.test.js # Comprehensive test suite
│   ├── App.tsx                 # Main app component with routes
│   ├── main.tsx                # App entry point
│   └── index.css               # Global styles and Tailwind
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- An n8n instance with API access
- API key from your n8n instance

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd n8nuimaker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Running Tests

```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Generate coverage report:
```bash
npm run test:coverage
```

## Usage Guide

### 1. Connect to n8n

1. Navigate to **Settings**
2. Enter your n8n base URL (e.g., `https://my-n8n.example.com`)
3. Enter your n8n API key
4. Click "Test Connection" to verify
5. Click "Save Settings"

### 2. Browse Workflows

1. Navigate to **Workflows**
2. Browse your n8n workflows that have webhook triggers
3. Use the search bar to filter workflows
4. Filter by status (all/active/inactive)
5. Click "Create UI" on any workflow

### 3. Customize Your UI

1. **Fields Tab**:
   - Add, remove, or reorder fields
   - Customize labels, placeholders, and help text
   - Set field types and validation rules
   - Mark fields as required or optional

2. **Branding Tab**:
   - Set a custom title and description
   - Choose a primary color for your form
   - Add a logo (coming soon)

3. **Layout Tab**:
   - Choose between single or two-column layout
   - Customize submit button text
   - Set success/error messages

4. Click "Preview" to test your form
5. Click "Save & Finish" when ready

### 4. Share Your UI

1. From the **Dashboard**, find your generated UI
2. Click the copy icon to copy the shareable link
3. Share the link with your users
4. Users can fill out the form, which will trigger your n8n workflow

### 5. Monitor Usage

- View submission counts on the Dashboard
- Track which workflows are most used
- See when UIs were last used

## Development Notes

### Mock Data

The application includes mock workflows for development and demonstration purposes. In production, these would be replaced with actual API calls to your n8n instance.

To implement real n8n API integration, update the following in `src/store/useStore.ts`:

```typescript
// testConnection function
const response = await fetch(`${connection.baseUrl}/api/v1/workflows`, {
  headers: {
    'X-N8N-API-KEY': connection.apiKey,
  },
});

// fetchWorkflows function
const response = await fetch(`${connection.baseUrl}/api/v1/workflows`, {
  headers: {
    'X-N8N-API-KEY': connection.apiKey,
  },
});
const data = await response.json();
set({ workflows: data.data });
```

And in `src/components/FormRenderer.tsx`:

```typescript
// onSubmit function
const response = await fetch(ui.webhookUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
const result = await response.json();
```

### Security Considerations

- API keys are stored in localStorage only
- No data is sent to external servers
- All communication is direct between browser and n8n instance
- Consider implementing additional authentication for shareable UIs in production

### Future Enhancements

- [ ] Logo upload for branding
- [ ] Export as standalone HTML file
- [ ] QR code generation for share links
- [ ] Embed code snippet (iframe)
- [ ] Form analytics and detailed submission logs
- [ ] Conditional field visibility
- [ ] Multi-step forms
- [ ] File upload support
- [ ] Email notifications
- [ ] Custom CSS injection
- [ ] Webhook response handling improvements

## Testing

The project includes comprehensive tests for the `nodeValidator` utility module with 100+ test cases covering:

- Valid and invalid node configurations
- Edge cases and error conditions
- Boundary testing
- Workflow validation
- Node name sanitization

All tests are located in `src/utils/nodeValidator.test.js`.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues or questions, please open an issue on GitHub.
