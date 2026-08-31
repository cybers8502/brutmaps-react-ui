import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './styles/common.scss';
import {StrictMode} from 'react';
import './i18n/index.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
