// App.tsx
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from 'antd';
import './App.css';

import AdsListPage from '../../pages/AdsListPage/AdsListPage';
import AdEditPage from '../../pages/AdEditPage/AdEditPage';
import AdViewPage from '../../pages/AdviewPage/AdViewPage';

const { Content } = Layout;

const AppContent = () => {
  const location = useLocation();
  const [count, setCount] = useState(0);

  const isAdsPage = /^\/ads\/\d+/.test(location.pathname);

  return (
    <Content className={`app-content ${isAdsPage ? 'ads-page' : ''}`}>
      <div className="container">
        <Routes>
          <Route
            path="/"
            element={
              <section id="center">
                <div>
                  <h1>Get started</h1>
                  <p>
                    Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
                  </p>
                </div>
                <button className="counter" onClick={() => setCount((count) => count + 1)}>
                  Count is {count}
                </button>
              </section>
            }
          />
          <Route path="/ads" element={<AdsListPage />} />
          <Route path="/ads/:id" element={<AdViewPage />} />
          <Route path="/ads/create" element={<AdEditPage />} />
          <Route path="/ads/:id/edit" element={<AdEditPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Content>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
