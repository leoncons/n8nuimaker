import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/Settings';
import { Workflows } from './pages/Workflows';
import { Generator } from './pages/Generator';
import { Preview } from './pages/Preview';
import { ShareableUI } from './pages/ShareableUI';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public shareable UI (no navigation) */}
        <Route
          path="/s/:uiId"
          element={
            <Layout showNav={false}>
              <ShareableUI />
            </Layout>
          }
        />

        {/* Main app routes (with navigation) */}
        <Route
          path="/"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/settings"
          element={
            <Layout>
              <Settings />
            </Layout>
          }
        />
        <Route
          path="/workflows"
          element={
            <Layout>
              <Workflows />
            </Layout>
          }
        />
        <Route
          path="/generate/:workflowId"
          element={
            <Layout>
              <Generator />
            </Layout>
          }
        />
        <Route
          path="/preview/:uiId"
          element={
            <Layout>
              <Preview />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
