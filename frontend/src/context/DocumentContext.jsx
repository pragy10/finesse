import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const DocumentContext = createContext();

export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocuments must be used within DocumentProvider');
  }
  return context;
};

export const DocumentProvider = ({ children }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("http://localhost:3001/documents");
      setDocuments(res.data.documents);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
      setError("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  const clearDocuments = () => {
    setDocuments([]);
  };

  const addDocument = (document) => {
    setDocuments(prev => [...prev, document]);
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const value = {
    documents,
    loading,
    error,
    fetchDocuments,
    clearDocuments,
    addDocument,
    totalCount: documents.length,
    totalChunks: documents.reduce((total, doc) => total + (doc.chunkCount || 0), 0)
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};
