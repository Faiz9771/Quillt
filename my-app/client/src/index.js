import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { configureStore } from '@reduxjs/toolkit';
import globalReducer from "state"; // Assuming this is your global reducer
import { Provider } from 'react-redux';
import { AuthProvider } from 'contexts/AuthContext';
import { setupListeners } from '@reduxjs/toolkit/query';
import { api } from "state/api"; // Import your api

// Configure the Redux store with global reducer and API slice
const store = configureStore({
  reducer: {
    global: globalReducer,
    [api.reducerPath]: api.reducer, // API slice
  },
  middleware: (getDefault) => 
    getDefault().concat(api.middleware) // Ensure API middleware is included
});

// Set up listeners for RTK Query
setupListeners(store.dispatch);

// Create the root of the React application
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Provider>
  </React.StrictMode>
);
