import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Stats from './pages/Stats';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <h1 className="text-3xl font-bold text-gray-900">
                  TinyLink
                </h1>
              </div>
              <div className="text-sm text-gray-500">
                URL Shortener
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/code/:code" element={<Stats />} />
          </Routes>
        </main>

        <footer className="bg-white border-t">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500">
              TinyLink - A simple URL shortener built with Node.js, React, and PostgreSQL
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
