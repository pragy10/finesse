import React, { useState } from "react";
import axios from "axios";
import { useDocuments } from "../context/DocumentContext";

function FileUpload() {
  const [files, setFiles] = useState(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  
  // Use document context
  const { documents, fetchDocuments, clearDocuments } = useDocuments();

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (!files || files.length === 0) {
      return setMessage("❌ Please select at least one file");
    }

    setUploading(true);
    setMessage("📤 Uploading and processing documents...");
    
    try {
      const formData = new FormData();
      
      Array.from(files).forEach(file => {
        formData.append("files", file);
      });

      const res = await axios.post("http://localhost:3001/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      const successCount = res.data.processedFiles.filter(f => f.status === 'success').length;
      setMessage(`✅ Successfully processed ${successCount}/${files.length} documents (${res.data.totalChunks} total chunks)`);
      
      // Auto-refresh document list - this will update ClauseSearch component too!
      await fetchDocuments();
      
      // Clear file input
      setFiles(null);
      document.querySelector('input[type="file"]').value = '';
      
    } catch (error) {
      console.error("Upload failed:", error);
      setMessage("❌ Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const clearAllDocuments = async () => {
    if (!window.confirm("Are you sure you want to clear ALL documents? This cannot be undone.")) {
      return;
    }
    
    try {
      setMessage("🗑️ Clearing all documents...");
      await axios.post("http://localhost:3001/clear-all");
      
      // Update context immediately
      clearDocuments();
      setMessage("✅ All documents cleared successfully");
    } catch (error) {
      console.error("Clear failed:", error);
      setMessage("❌ Failed to clear documents");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📄 Document Upload System</h2>
      
      {/* File Selection */}
      <div style={{ marginBottom: "20px", padding: "15px", border: "2px dashed #ccc", borderRadius: "8px" }}>
        <input 
          type="file" 
          multiple 
          onChange={handleFileChange}
          accept=".pdf,.docx,.jpg,.jpeg,.png,.eml"
          style={{ marginBottom: "10px" }}
        />
        <br />
        <small style={{ color: "#666" }}>
          Supported: PDF, DOCX, JPG, PNG, EML | Max 10 files, 10MB each
        </small>
        <br />
        <button 
          onClick={handleUpload}
          disabled={uploading || !files}
          style={{ 
            marginTop: "10px",
            padding: "10px 20px", 
            backgroundColor: uploading ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: uploading ? "not-allowed" : "pointer"
          }}
        >
          {uploading ? "⏳ Processing..." : `📤 Upload ${files?.length || 0} File(s)`}
        </button>
      </div>

      {/* Status Message */}
      {message && (
        <div style={{ 
          marginBottom: "20px", 
          padding: "10px", 
          backgroundColor: message.includes("❌") ? "#ffebee" : "#e8f5e8",
          border: `1px solid ${message.includes("❌") ? "#f44336" : "#4caf50"}`,
          borderRadius: "5px"
        }}>
          {message}
        </div>
      )}

      {/* Document Library */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
          <h3>📚 Document Library ({documents.length})</h3>
          {documents.length > 0 && (
            <button 
              onClick={clearAllDocuments}
              style={{ 
                marginLeft: "auto",
                backgroundColor: "#dc3545", 
                color: "white", 
                padding: "8px 15px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              🗑️ Clear All
            </button>
          )}
        </div>
        
        {documents.length > 0 ? (
          <div style={{ 
            background: "#f8f9fa", 
            padding: "15px", 
            borderRadius: "8px",
            maxHeight: "300px",
            overflowY: "auto"
          }}>
            {documents.map((doc, index) => (
              <div key={index} style={{ 
                display: "flex", 
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 0",
                borderBottom: index < documents.length - 1 ? "1px solid #dee2e6" : "none"
              }}>
                <span>
                  📄 <strong>{doc.fileName}</strong>
                </span>
                <div style={{ color: "#666", fontSize: "14px" }}>
                  {doc.chunkCount} chunks | {new Date(doc.uploadTime).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "#666", fontStyle: "italic" }}>No documents uploaded yet</p>
        )}
      </div>
    </div>
  );
}

export default FileUpload;
