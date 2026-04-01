import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Layout, theme } from 'antd';
import './App.css';

import AdsListPage from '../../pages/AdsListPage/AdsListPage';
import AdEditPage from '../../pages/AdEditPage/AdEditPage';
import AdViewPage from '../../pages/AdviewPage/AdViewPage';

const { Header, Content, Footer } = Layout;

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Layout className="app-layout">
        <Header className="app-header">
          <nav className="navigation">
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/ads">Объявления</Link>
              </li>
              <li>
                <Link to="/ads/create">Создать объявление</Link>
              </li>
            </ul>
          </nav>
        </Header>

        <Content className="app-content">
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

        <Footer className="app-footer">Footer Content</Footer>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
