import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { CssBaseline } from '@mui/material';
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from 'react-redux';
import store, {persistor} from './components/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
     <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
    <CssBaseline />
    <App />
      </PersistGate>
  </Provider>
  </Router>
);
