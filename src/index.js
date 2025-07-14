import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import App from './App';
import './styles/globals.css';
import './styles/components.css';
import './styles/theme.css';
import './styles/responsive.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <DndProvider backend={HTML5Backend}>
        <ThemeProvider>
          <AppProvider>
            <App />
          </AppProvider>
        </ThemeProvider>
      </DndProvider>
    </BrowserRouter>
  </React.StrictMode>
);