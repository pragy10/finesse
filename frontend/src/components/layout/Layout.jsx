import React from 'react';
import Header from './Header';
import Footer from './Footer';

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
