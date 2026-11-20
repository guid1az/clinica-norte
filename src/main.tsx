import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import Compare from './Compare';

const Root = import.meta.env.VITE_COMPARE ? Compare : App;
createRoot(document.getElementById('root')!).render(<StrictMode><Root /></StrictMode>);
