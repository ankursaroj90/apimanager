import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import apiService from '../services/apiService';
import endpointService from '../services/endpointService';
import schemaService from '../services/schemaService';
import environmentService from '../services/environmentService';

const AppContext = createContext();

const initialState = {
  // Current selections
  currentApi: null,
  currentEnvironment: 'development',
  currentEndpoint: null,
  currentSchema: null,
  
  // Data collections
  apis: [],
  endpoints: [],
  schemas: [],
  components: [],

  //fetched environments
  environments: [],

  // environments: [
  //   {
  //     id: 'dev',
  //     name: 'Development',
  //     baseUrl: 'http://localhost:8761',
  //     variables: { apiKey: 'dev-key-123' },
  //     active: true
  //   },
  //   {
  //     id: 'staging',
  //     name: 'Staging',
  //     baseUrl: 'https://api-staging.example.com',
  //     variables: { apiKey: 'staging-key-456' },
  //     active: false
  //   },
  //   {
  //     id: 'prod',
  //     name: 'Production',
  //     baseUrl: 'https://api.example.com',
  //     variables: { apiKey: 'prod-key-789' },
  //     active: false
  //   }
  // ],
  
  // Request history
  requestHistory: [],
  
  // UI state
  loading: false,
  error: null,
  sidebarCollapsed: false,
  
  // Settings
  settings: {
    autoSave: true,
    showResponseTime: true,
    validateSchemas: true,
    mockResponses: false,
    theme: 'light'
  }
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    case 'SET_CURRENT_API':
      return { ...state, currentApi: action.payload };
    
    case 'SET_CURRENT_ENVIRONMENT':
      return { 
        ...state, 
        currentEnvironment: action.payload,
        environments: state.environments.map(env => ({
          ...env,
          active: env.id === action.payload
        }))
      };
    
    case 'SET_CURRENT_ENDPOINT':
      return { ...state, currentEndpoint: action.payload };
    
    case 'SET_CURRENT_SCHEMA':
      return { ...state, currentSchema: action.payload };
    
    // APIs
    case 'SET_APIS':
      return { ...state, apis: action.payload };
    
    case 'ADD_API':
      return { ...state, apis: [...state.apis, action.payload] };
    
    case 'UPDATE_API':
      return {
        ...state,
        apis: state.apis.map(api => 
          api.id === action.payload.id ? action.payload : api
        ),
        currentApi: state.currentApi?.id === action.payload.id ? action.payload : state.currentApi
      };
    
    case 'DELETE_API':
      return {
        ...state,
        apis: state.apis.filter(api => api.id !== action.payload),
        currentApi: state.currentApi?.id === action.payload ? null : state.currentApi
      };
    
    // Endpoints
    case 'SET_ENDPOINTS':
      return { ...state, endpoints: action.payload };
    
    case 'ADD_ENDPOINT':
      return { ...state, endpoints: [...state.endpoints, action.payload] };
    
    case 'UPDATE_ENDPOINT':
      return {
        ...state,
        endpoints: state.endpoints.map(endpoint => 
          endpoint.id === action.payload.id ? action.payload : endpoint
        ),
        currentEndpoint: state.currentEndpoint?.id === action.payload.id ? action.payload : state.currentEndpoint
      };
    
    case 'DELETE_ENDPOINT':
      return {
        ...state,
        endpoints: state.endpoints.filter(endpoint => endpoint.id !== action.payload),
        currentEndpoint: state.currentEndpoint?.id === action.payload ? null : state.currentEndpoint
      };
    
    // Schemas
    case 'SET_SCHEMAS':
      return { ...state, schemas: action.payload };
    
    case 'ADD_SCHEMA':
      return { ...state, schemas: [...state.schemas, action.payload] };
    
    case 'UPDATE_SCHEMA':
      return {
        ...state,
        schemas: state.schemas.map(schema => 
          schema.id === action.payload.id ? action.payload : schema
        ),
        currentSchema: state.currentSchema?.id === action.payload.id ? action.payload : state.currentSchema
      };
    
    case 'DELETE_SCHEMA':
      return {
        ...state,
        schemas: state.schemas.filter(schema => schema.id !== action.payload),
        currentSchema: state.currentSchema?.id === action.payload ? null : state.currentSchema
      };
    
    // Components
    case 'SET_COMPONENTS':
      return { ...state, components: action.payload };
    
    case 'ADD_COMPONENT':
      return { ...state, components: [...state.components, action.payload] };
    
    case 'UPDATE_COMPONENT':
      return {
        ...state,
        components: state.components.map(comp => 
          comp.id === action.payload.id ? action.payload : comp
        )
      };
    
    case 'DELETE_COMPONENT':
      return {
        ...state,
        components: state.components.filter(comp => comp.id !== action.payload)
      };
    
    // Environments
    case 'SET_ENVIRONMENTS':
      return { ...state, environments: action.payload };
    
    case 'ADD_ENVIRONMENT':
      return { ...state, environments: [...state.environments, action.payload] };
    
    case 'UPDATE_ENVIRONMENT':
      return {
        ...state,
        environments: state.environments.map(env => 
          env.id === action.payload.id ? action.payload : env
        )
      };
    
    case 'DELETE_ENVIRONMENT':
      return {
        ...state,
        environments: state.environments.filter(env => env.id !== action.payload)
      };
    
    // Request History
    case 'ADD_REQUEST_HISTORY':
      return {
        ...state,
        requestHistory: [action.payload, ...state.requestHistory.slice(0, 99)] // Keep last 100
      };
    
    case 'CLEAR_REQUEST_HISTORY':
      return { ...state, requestHistory: [] };
    
    // UI
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize with sample data
  useEffect(() => {

    // Fetch APIs list on mount
    const fetchApis = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const apis = await apiService.getApis();
        dispatch({ type: 'SET_APIS', payload: apis });
      } catch (err) {
        console.error('Failed to fetch APIs:', err);
        toast.error(err.message || 'Failed to fetch APIs');
        dispatch({ type: 'SET_ERROR', payload: err.message });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    // Fetch all endpoints on mount
    const fetchAllEndpoints = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const endpoints = await endpointService.getAllEndpoints();
        dispatch({ type: 'SET_ENDPOINTS', payload: endpoints });
      } catch (err) {
        console.error('Failed to fetch endpoints:', err);
        toast.error(err.message || 'Failed to fetch endpoints');
        dispatch({ type: 'SET_ERROR', payload: err.message });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    //Fetch all Schemas on mount
    const fetchAllSchemas = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const schemas = await schemaService.getAllSchemas();
        dispatch({ type: 'SET_SCHEMAS', payload: schemas });
      } catch (err) {
        console.error('Failed to fetch schemas:', err);
        toast.error(err.message || 'Failed to fetch schemas');
        dispatch({ type: 'SET_ERROR', payload: err.message });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    //fetch environments on mount
    const fetchEnvironments = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const environments = await environmentService.getEnvironments();
        dispatch({ type: 'SET_ENVIRONMENTS', payload: environments });
      } catch (err) {
        console.error('Failed to fetch environments:', err);
        toast.error(err.message || 'Failed to fetch environments');
        dispatch({ type: 'SET_ERROR', payload: err.message });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };


    initializeSampleData();
    fetchApis();
    fetchAllEndpoints();
    fetchAllSchemas();
    fetchEnvironments();
  }, []);

  const initializeSampleData = () => {
    const sampleApi = {
      id: initialState.apis[0]?.id,
      name: 'User Management API',
      description: 'Complete user management system with authentication',
      version: '1.0.0',
      baseUrl: 'https://api.example.com/v1',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: ['authentication', 'users'],
      openApiSpec: {
        openapi: '3.0.0',
        info: {
          title: 'User Management API',
          version: '1.0.0'
        }
      }
    };

    // const sampleApi = initialState.apis[0];

    const sampleEndpoints = [
      {
        id: uuidv4(),
        apiId: sampleApi.id,
        name: 'Get Users',
        method: 'GET',
        path: '/users',
        summary: 'Retrieve a list of users',
        description: 'Get all users with pagination support',
        parameters: [
          { name: 'page', in: 'query', type: 'integer', description: 'Page number' },
          { name: 'size', in: 'query', type: 'integer', description: 'Page size' }
        ],
        responses: {
          '200': {
            description: 'Success',
            schema: { type: 'object' }
          }
        },
        tags: ['users']
      },
      {
        id: uuidv4(),
        apiId: sampleApi.id,
        name: 'Create User',
        method: 'POST',
        path: '/users',
        summary: 'Create a new user',
        description: 'Create a new user account',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object' }
            }
          }
        },
        responses: {
          '201': {
            description: 'User created',
            schema: { type: 'object' }
          }
        },
        tags: ['users']
      }
    ];

    const sampleSchemas = [
      {
        id: uuidv4(),
        apiId: sampleApi.id,
        name: 'User',
        type: 'object',
        description: 'User object schema',
        properties: {
          id: { type: 'string', description: 'User ID' },
          firstName: { type: 'string', description: 'First name' },
          lastName: { type: 'string', description: 'Last name' },
          email: { type: 'string', format: 'email', description: 'Email address' },
          age: { type: 'integer', minimum: 18, description: 'User age' },
          createdAt: { type: 'string', format: 'date-time', description: 'Creation date' }
        },
        required: ['id', 'firstName', 'lastName', 'email', 'age']
      }
    ];

    // dispatch({ type: 'ADD_API', payload: initialState.apis[0] });
    // dispatch({ type: 'SET_ENDPOINTS', payload: sampleEndpoints });
    // dispatch({ type: 'ADD_SCHEMA', payload: sampleSchemas[0] });
    // dispatch({ type: 'SET_CURRENT_API', payload: initialState.apis[0] });
    // dispatch({type: 'SET_CURRENT_ENVIRONMENT', payload: initialState.environments[0].id});
  };

  const actions = {
    // Generic actions
    setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setError: (error) => dispatch({ type: 'SET_ERROR', payload: error }),
    clearError: () => dispatch({ type: 'CLEAR_ERROR' }),
    
    // Current selections
    setCurrentApi: (api) => dispatch({ type: 'SET_CURRENT_API', payload: api }),
    setCurrentEnvironment: (env) => dispatch({ type: 'SET_CURRENT_ENVIRONMENT', payload: env }),
    setCurrentEndpoint: (endpoint) => dispatch({ type: 'SET_CURRENT_ENDPOINT', payload: endpoint }),
    setCurrentSchema: (schema) => dispatch({ type: 'SET_CURRENT_SCHEMA', payload: schema }),
    
    // API actions
    setApis: (apis) => dispatch({ type: 'SET_APIS', payload: apis }),
    addApi: (api) => dispatch({ type: 'ADD_API', payload: api }),
    updateApi: (api) => dispatch({ type: 'UPDATE_API', payload: api }),
    deleteApi: (apiId) => dispatch({ type: 'DELETE_API', payload: apiId }),
    
    // Endpoint actions
    setEndpoints: (endpoints) => dispatch({ type: 'SET_ENDPOINTS', payload: endpoints }),
    addEndpoint: (endpoint) => dispatch({ type: 'ADD_ENDPOINT', payload: endpoint }),
    updateEndpoint: (endpoint) => dispatch({ type: 'UPDATE_ENDPOINT', payload: endpoint }),
    deleteEndpoint: (endpointId) => dispatch({ type: 'DELETE_ENDPOINT', payload: endpointId }),
    
    // Schema actions
    setSchemas: (schemas) => dispatch({ type: 'SET_SCHEMAS', payload: schemas }),
    addSchema: (schema) => dispatch({ type: 'ADD_SCHEMA', payload: schema }),
    updateSchema: (schema) => dispatch({ type: 'UPDATE_SCHEMA', payload: schema }),
    deleteSchema: (schemaId) => dispatch({ type: 'DELETE_SCHEMA', payload: schemaId }),
    
    // Component actions
    setComponents: (components) => dispatch({ type: 'SET_COMPONENTS', payload: components }),
    addComponent: (component) => dispatch({ type: 'ADD_COMPONENT', payload: component }),
    updateComponent: (component) => dispatch({ type: 'UPDATE_COMPONENT', payload: component }),
    deleteComponent: (componentId) => dispatch({ type: 'DELETE_COMPONENT', payload: componentId }),
    
    // Environment actions
    setEnvironments: (environments) => dispatch({ type: 'SET_ENVIRONMENTS', payload: environments }),
    addEnvironment: (environment) => dispatch({ type: 'ADD_ENVIRONMENT', payload: environment }),
    updateEnvironment: (environment) => dispatch({ type: 'UPDATE_ENVIRONMENT', payload: environment }),
    deleteEnvironment: (environmentId) => dispatch({ type: 'DELETE_ENVIRONMENT', payload: environmentId }),
    
    // Request history
    addRequestHistory: (request) => dispatch({ type: 'ADD_REQUEST_HISTORY', payload: request }),
    clearRequestHistory: () => dispatch({ type: 'CLEAR_REQUEST_HISTORY' }),
    
    // UI actions
    toggleSidebar: () => dispatch({ type: 'TOGGLE_SIDEBAR' }),
    updateSettings: (settings) => dispatch({ type: 'UPDATE_SETTINGS', payload: settings }),
  };

  const value = { ...state, ...actions };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default AppContext;