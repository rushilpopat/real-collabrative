import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import DocumentList from './components/DocumentList';
import DocumentEditor from './components/DocumentEditor';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<DocumentList />} />
              <Route path="/document/:id" element={<DocumentEditor />} />
            </Routes>
          </div>
        </motion.div>
      </div>
    </Router>
  );
};

export default App; 