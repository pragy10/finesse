import React, { useState } from "react";
import axios from "axios";
import { useDocuments } from "../context/DocumentContext";

function ClauseSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Use document context - automatically synced!
  const { documents } = useDocuments();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3001/search", { 
        query: query.trim(),
        fileName: selectedDoc || undefined
      });
      setResults(res.data || []);
    } catch (err) {
      console.error("Search failed:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const getRelevanceLevel = (score) => {
    if (score >= 0.7) return { text: "High", color: "#4caf50" };
    if (score >= 0.4) return { text: "Medium", color: "#ff9800" };
    return { text: "Low", color: "#f44336" };
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🔍 Semantic Document Search</h2>
      
      {/* Real-time document count update! */}
      {documents.length === 0 && (
        <div style={{ 
          padding: "15px", 
          backgroundColor: "#fff3cd", 
          border: "1px solid #ffeaa7",
          borderRadius: "5px",
          marginBottom: "20px"
        }}>
          ⚠️ No documents uploaded yet. Please upload some documents first.
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Ask a question about your documents..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ 
              flex: "1", 
              minWidth: "300px",
              padding: "12px", 
              borderRadius: "5px", 
              border: "1px solid #ddd",
              fontSize: "16px"
            }}
            disabled={documents.length === 0}
          />
          
          {documents.length > 1 && (
            <select
              value={selectedDoc}
              onChange={(e) => setSelectedDoc(e.target.value)}
              style={{ 
                padding: "12px", 
                borderRadius: "5px", 
                border: "1px solid #ddd",
                minWidth: "150px"
              }}
            >
              <option value="">All Documents</option>
              {documents.map((doc, i) => (
                <option key={i} value={doc.fileName}>
                  {doc.fileName.length > 20 ? 
                    doc.fileName.substring(0, 20) + "..." : 
                    doc.fileName
                  }
                </option>
              ))}
            </select>
          )}
          
          <button 
            type="submit" 
            disabled={loading || documents.length === 0 || !query.trim()}
            style={{ 
              padding: "12px 20px",
              backgroundColor: loading ? "#ccc" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: loading ? "not-allowed" : "pointer",
              minWidth: "100px"
            }}
          >
            {loading ? "⏳" : "🔍 Search"}
          </button>
        </div>
      </form>
      
      {loading && (
        <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>
          🔄 Searching across {selectedDoc ? "1" : documents.length} document(s)...
        </div>
      )}
      
      {/* Rest of your search results display code... */}
      {results.length > 0 && (
        <div>
          <h3 style={{ marginBottom: "15px" }}>
            📋 Search Results ({results.length} matches found)
            {selectedDoc && <span style={{ color: "#666", fontSize: "16px" }}> in {selectedDoc}</span>}
          </h3>
          
          {results.map((item, i) => {
            const relevance = getRelevanceLevel(item.score);
            return (
              <div key={i} style={{ 
                marginBottom: "20px", 
                padding: "20px", 
                border: "1px solid #e0e0e0",
                borderRadius: "10px",
                backgroundColor: "#fafafa",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  marginBottom: "10px",
                  fontSize: "14px",
                  color: "#666"
                }}>
                  <div>
                    📄 <strong style={{ color: "#333" }}>{item.payload?.fileName}</strong>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    <span>Score: <strong>{item.score?.toFixed(3)}</strong></span>
                    <span 
                      style={{ 
                        color: relevance.color, 
                        fontWeight: "bold",
                        padding: "2px 8px",
                        backgroundColor: "white",
                        borderRadius: "12px",
                        fontSize: "12px"
                      }}
                    >
                      {relevance.text} Relevance
                    </span>
                  </div>
                </div>
                
                <div style={{ 
                  fontSize: "16px", 
                  lineHeight: "1.6",
                  color: "#333",
                  backgroundColor: "white",
                  padding: "15px",
                  borderRadius: "8px",
                  border: "1px solid #eee"
                }}>
                  {item.payload?.text}
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {!loading && results.length === 0 && query.trim() && documents.length > 0 && (
        <div style={{ 
          textAlign: "center", 
          padding: "40px", 
          color: "#666",
          backgroundColor: "#f8f9fa",
          borderRadius: "10px"
        }}>
          <div style={{ fontSize: "48px", marginBottom: "10px" }}>🔍</div>
          <h3>No matches found</h3>
          <p>Try different keywords or upload more relevant documents.</p>
        </div>
      )}
    </div>
  );
}

export default ClauseSearch;
