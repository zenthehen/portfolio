import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// ?mascot-sheet shows every mascot pose at once while developing; production always renders the app
const MascotSheet = import.meta.env.DEV ? React.lazy(() => import('./dev/MascotSheet')) : null;
const showMascotSheet = MascotSheet !== null && new URLSearchParams(window.location.search).has('mascot-sheet');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {showMascotSheet && MascotSheet ? (
      <React.Suspense fallback={null}>
        <MascotSheet />
      </React.Suspense>
    ) : (
      <App />
    )}
  </React.StrictMode>
);

