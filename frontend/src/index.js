import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Performance monitoring
import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Performance monitoring and reporting
function sendToAnalytics(metric) {
  // In production, send to your analytics service
  console.log('Performance metric:', metric);
}

// Measure and report Core Web Vitals
onCLS(sendToAnalytics);
onINP(sendToAnalytics);
onFCP(sendToAnalytics);
onLCP(sendToAnalytics);
onTTFB(sendToAnalytics);