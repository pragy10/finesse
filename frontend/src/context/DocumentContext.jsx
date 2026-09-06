import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const DocumentContext = createContext();

export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error("useDocuments must be used within DocumentProvider");
  }
  return context;
};

export const DocumentProvider = ({ children }) => {
  const { user, idToken } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [activeDocIds, setActiveDocIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getHeaders = () => {
    return idToken ? { Authorization: `Bearer ${idToken}` } : {};
  };

  const fetchDocuments = async () => {
    if (!user || !idToken) {
      setDocuments([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("http://localhost:3001/documents", {
        headers: getHeaders()
      });
      setDocuments(res.data.documents || []);
    } catch (err) {
      console.error("Failed to fetch user documents:", err);
      setError("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (docId) => {
    try {
      await axios.delete(`http://localhost:3001/documents/${docId}`, {
        headers: getHeaders()
      });
      setDocuments(prev => prev.filter(d => d.id !== docId));
      setActiveDocIds(prev => prev.filter(id => id !== docId));
      return true;
    } catch (err) {
      console.error("Failed to delete document:", err);
      throw err;
    }
  };

  const clearAllDocuments = async () => {
    try {
      await axios.post("http://localhost:3001/documents/clear-all", {}, {
        headers: getHeaders()
      });
      setDocuments([]);
      setActiveDocIds([]);
      return true;
    } catch (err) {
      console.error("Failed to clear documents:", err);
      throw err;
    }
  };

  const toggleActiveDocId = (docId) => {
    setActiveDocIds(prev => {
      if (prev.includes(docId)) {
        return prev.filter(id => id !== docId);
      } else {
        return [...prev, docId];
      }
    });
  };

  const selectAllDocs = () => {
    setActiveDocIds(documents.map(d => d.id));
  };

  const clearActiveDocs = () => {
    setActiveDocIds([]);
  };

  useEffect(() => {
    if (user && idToken) {
      fetchDocuments();
    } else {
      setDocuments([]);
      setActiveDocIds([]);
    }
  }, [user, idToken]);

  const value = {
    documents,
    activeDocIds,
    loading,
    error,
    fetchDocuments,
    deleteDocument,
    clearAllDocuments,
    toggleActiveDocId,
    selectAllDocs,
    clearActiveDocs,
    setActiveDocIds,
    totalCount: documents.length,
    totalChunks: documents.reduce((total, doc) => total + (doc.chunkCount || 0), 0)
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};
