import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import ApiOverview from './components/apis/ApiOverview';
import ApiDesigner from './components/apis/ApiDesigner';
import ApiVersions from './components/apis/ApiVersions';
import EndpointList from './components/endpoints/EndpointList';
import EndpointEditor from './components/endpoints/EndpointEditor';
import SchemaDesigner from './components/schemas/SchemaDesigner';
import SchemaList from './components/schemas/SchemaList';
import SchemaViewer from './components/schemas/SchemaViewer';
import ComponentsLibrary from './components/components/ComponentsLibrary';
import RequestTester from './components/request/RequestTester';
import EnvironmentManager from './components/environments/EnvironmentManager';
import UserList from './components/users/UserList';
import UserForm from './components/users/UserForm';
import UserDetail from './components/users/UserDetail';
import ProductList from './components/products/ProductList';
import ProductForm from './components/products/ProductForm';
import ProductDetail from './components/products/ProductDetail';
import CategoryList from './components/categories/CategoryList';
import CategoryForm from './components/categories/CategoryForm';
import ErrorBoundary from './components/common/ErrorBoundary';
import { useApp } from './context/AppContext';
import './App.css';

function App() {
  const { theme } = useApp();


  return (
    <ErrorBoundary>
      <div className={`App theme-${theme}`}>
        <Layout>
          <Routes>
            {/* Dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* API Management */}
            <Route path="/apis" element={<ApiOverview />} />
            <Route path="/apis/new" element={<ApiDesigner />} />
            <Route path="/apis/:apiId/edit" element={<ApiDesigner />} />
            <Route path="/apis/:apiId/versions" element={<ApiVersions />} />
            
            {/* Endpoints */}
            <Route path="/apis/:apiId/endpoints" element={<EndpointList />} />
            <Route path="/apis/:apiId/endpoints/new" element={<EndpointEditor />} />
            <Route path="/apis/:apiId/endpoints/:endpointId" element={<EndpointEditor />} />
            
            {/* Schemas */}
            <Route path="/apis/:apiId/schemas" element={<SchemaList />} />
            <Route path="/apis/:apiId/schemas/new" element={<SchemaDesigner />} />
            <Route path="/apis/:apiId/schemas/:schemaId" element={<SchemaDesigner />} />
            <Route path="/apis/:apiId/schemas/:schemaId/view" element={<SchemaViewer />} />
            
            {/* Components */}
            <Route path="/apis/:apiId/components" element={<ComponentsLibrary />} />
            
            {/* Request Testing */}
            <Route path="/request" element={<RequestTester />} />
            <Route path="/apis/:apiId/test" element={<RequestTester />} />
            
            {/* Environment Management */}
            <Route path="/environments" element={<EnvironmentManager />} />
            
            {/* User Management */}
            <Route path="/users" element={<UserList />} />
            <Route path="/users/new" element={<UserForm />} />
            <Route path="/users/:id" element={<UserDetail />} />
            <Route path="/users/:id/edit" element={<UserForm />} />
            
            {/* Product Management */}
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/new" element={<ProductForm />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/products/:id/edit" element={<ProductForm />} />
            
            {/* Category Management */}
            <Route path="/categories" element={<CategoryList />} />
            <Route path="/categories/new" element={<CategoryForm />} />
            <Route path="/categories/:id/edit" element={<CategoryForm />} />
            
            {/* Catch all route */}
            <Route path="*" element={
              <div className="error-page">
                <h1>404 - Page Not Found</h1>
                <p>The page you're looking for doesn't exist.</p>
              </div>
            } />
          </Routes>
        </Layout>
        
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              borderRadius: '8px',
              padding: '16px',
            },
          }}
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;