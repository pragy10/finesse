import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DocumentProvider } from './context/DocumentContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

function App() {
  return (
    <DocumentProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </Layout>
      </Router>
    </DocumentProvider>
  );
}

export default App;
