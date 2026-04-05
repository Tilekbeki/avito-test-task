// App.tsx
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
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
                  <h1 className="font-extrabold">Тестовое Авито</h1>
                </div>
                <Link to="/ads" className="!text-blue-400">
                  Перейти к объявлениям
                </Link>
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
