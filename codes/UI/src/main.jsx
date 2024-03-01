import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import App from './app';
import './utils/translation';
import { AuthProvider } from './sections/login/authContext';

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <HelmetProvider>
    <AuthProvider>
      <BrowserRouter>
        <Suspense>
          <App />
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  </HelmetProvider>
);
