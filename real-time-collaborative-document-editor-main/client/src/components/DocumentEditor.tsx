import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import io from 'socket.io-client';
import { ArrowLeftIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const socket = io('http://localhost:5000');

const DocumentEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/documents/${id}`);
        setTitle(response.data.title);
        setContent(response.data.content || '');
        socket.emit('join-document', id);
      } catch (error) {
        console.error('Error fetching document:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    if (id !== 'new') {
      fetchDocument();
    } else {
      setLoading(false);
    }

    return () => {
      socket.off('receive-changes');
    };
  }, [id, navigate]);

  useEffect(() => {
    socket.on('receive-changes', (delta: string) => {
      setContent((prevContent) => {
        // Apply the changes from other users
        return delta;
      });
    });

    return () => {
      socket.off('receive-changes');
    };
  }, []);

  const handleEditorChange = useCallback((value: string | undefined) => {
    if (value !== undefined) {
      setContent(value);
      socket.emit('send-changes', value);
    }
  }, []);

  const handleSave = async () => {
    if (id === 'new') {
      try {
        setSaving(true);
        const response = await axios.post('http://localhost:5000/api/documents', {
          title: title || 'Untitled Document',
          content
        });
        navigate(`/document/${response.data._id}`);
      } catch (error) {
        console.error('Error creating document:', error);
      } finally {
        setSaving(false);
      }
    } else {
      try {
        setSaving(true);
        await axios.post(`http://localhost:5000/api/documents/${id}`, {
          content
        });
      } catch (error) {
        console.error('Error saving document:', error);
      } finally {
        setSaving(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/')}
                className="mr-4 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </button>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Untitled Document"
                className="text-2xl font-bold text-gray-800 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-600 rounded px-2"
              />
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
          
          <div className="h-[calc(100vh-250px)] border rounded-lg overflow-hidden">
            <Editor
              height="100%"
              defaultLanguage="markdown"
              value={content}
              onChange={handleEditorChange}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                lineNumbers: 'on',
                renderWhitespace: 'selection',
                automaticLayout: true,
              }}
            />
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className="flex items-center text-gray-600">
            {saving ? 'Saving...' : 'All changes saved'}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DocumentEditor; 