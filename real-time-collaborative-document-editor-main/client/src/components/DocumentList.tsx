import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { DocumentTextIcon, ClockIcon } from '@heroicons/react/24/outline';

interface Document {
  _id: string;
  title: string;
  updatedAt: string;
}

const DocumentList: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/documents');
        setDocuments(response.data);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Documents</h1>
      
      <div className="grid gap-4">
        {documents.map((doc, index) => (
          <motion.div
            key={doc._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link
              to={`/document/${doc._id}`}
              className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center">
                <DocumentTextIcon className="h-8 w-8 text-blue-600" />
                <div className="ml-4 flex-1">
                  <h2 className="text-xl font-semibold text-gray-800">{doc.title}</h2>
                  <div className="flex items-center mt-2 text-gray-500">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    <span>Last updated: {new Date(doc.updatedAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}

        {documents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center py-12">
              <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-600 mb-2">No documents yet</h2>
              <p className="text-gray-500">Create your first document to get started</p>
              <Link
                to="/document/new"
                className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Document
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DocumentList; 