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

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3001/documents");
      setDocuments(res.data.documents);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearDocuments = () => {
    setDocuments([]);
  };

  // Load documents on mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  const value = {
    documents,
    loading,
    fetchDocuments,
    clearDocuments,
    totalCount: documents.length
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};
