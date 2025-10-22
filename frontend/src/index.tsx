import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';


// get the HTML element from the root and create the app inside
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
