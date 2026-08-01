import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Dynamically sync Canonical URL & Structured Data to match any custom domain automatically
if (typeof window !== 'undefined') {
  const origin = window.location.origin;
  
  // 1. Update Canonical link tag
  let canonicalEl = document.querySelector('link[rel="canonical"]');
  if (canonicalEl) {
    canonicalEl.setAttribute('href', origin + '/');
  }

  // 2. Update OpenGraph URL
  let ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) {
    ogUrl.setAttribute('content', origin + '/');
  }

  // 3. Update JSON-LD Schema URLs dynamically
  const schemaScript = document.querySelector('script[type="application/ld+json"]');
  if (schemaScript && schemaScript.textContent) {
    try {
      const data = JSON.parse(schemaScript.textContent);
      if (data["@graph"]) {
        data["@graph"].forEach((item: any) => {
          if (item["@id"]) item["@id"] = item["@id"].replace(/https:\/\/[^/]+/, origin);
          if (item.url) item.url = origin + '/';
          if (item.potentialAction && item.potentialAction.target) {
            item.potentialAction.target = origin + '/?q={search_term_string}';
          }
        });
        schemaScript.textContent = JSON.stringify(data, null, 2);
      }
    } catch (e) {
      // Ignore JSON parse errors
    }
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

