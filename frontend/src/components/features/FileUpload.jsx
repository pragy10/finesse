import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useDocuments } from "../../context/DocumentContext";
import { useAuth } from "../../context/AuthContext";
import { Upload, File, CheckCircle, Trash2, X, Plus, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { formatFileSize } from '../../utils/constants';

function FileUpload() {
  const [files, setFiles] = useState(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  
  const { documents, fetchDocuments, clearAllDocuments, deleteDocument } = useDocuments();
  const { idToken } = useAuth();

  const handleFileChange = (e) => {
    setFiles(e.target.files);
    setMessage("");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = e.dataTransfer.files;
    setFiles(droppedFiles);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!files || files.length === 0) {
      return setMessage("❌ Please select at least one file");
    }

    setUploading(true);
    setMessage("📤 Uploading and processing documents to Supabase Storage...");
    
    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append("files", file);
      });

      const res = await axios.post("http://localhost:3001/documents/upload", formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          ...(idToken ? { Authorization: `Bearer ${idToken}` } : {})
        }
      });
      
      const successCount = res.data.processedFiles?.filter(f => f.status === 'success').length || 0;
      setMessage(`✅ Stored ${successCount}/${files.length} document(s) in Supabase & indexed vectors!`);
      
      await fetchDocuments();
      setFiles(null);
      const fileInput = document.getElementById('file-input');
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error("Upload failed:", error);
      setMessage(`❌ Upload failed: ${error.response?.data?.error || error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to clear ALL documents? This cannot be undone.")) {
      return;
    }
    
    try {
      setMessage("🗑️ Clearing all documents...");
      await clearAllDocuments();
      setMessage("✅ All documents cleared successfully");
    } catch (error) {
      console.error("Clear failed:", error);
      setMessage("❌ Failed to clear documents");
    }
  };

  const removeFile = (indexToRemove) => {
    const filesArray = Array.from(files);
    const newFiles = filesArray.filter((_, index) => index !== indexToRemove);
    const dt = new DataTransfer();
    newFiles.forEach(file => dt.items.add(file));
    setFiles(dt.files.length > 0 ? dt.files : null);
  };

  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 transition-colors">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2.5 text-xl font-bold text-gray-900 dark:text-white">
            <Upload className="w-6 h-6 text-primary-500" />
            Upload Policy Documents
          </h2>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Files are saved to your private cloud storage on Supabase and indexed into Qdrant for reasoning.
          </p>
        </div>
        <Link 
          to="/documents"
          className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
        >
          View Full Library ({documents.length}) →
        </Link>
      </div>

      {/* File Drop Zone */}
      <div 
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
          dragOver 
            ? 'border-primary-400 bg-primary-50/50 dark:bg-primary-950/20 scale-[1.01]' 
            : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/40 hover:border-primary-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input').click()}
      >
        <input 
          type="file" 
          id="file-input"
          multiple 
          onChange={handleFileChange}
          accept=".pdf,.docx,.jpg,.jpeg,.png,.eml"
          className="hidden"
        />
        
        <Upload className={`w-12 h-12 mx-auto mb-3 ${dragOver ? 'text-primary-500' : 'text-gray-400 dark:text-gray-500'}`} />
        
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            {dragOver ? 'Drop files here' : 'Drag & drop files here or browse'}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">PDF, DOCX, JPG, PNG up to 25MB</p>
        </div>
      </div>

      {/* Selected Files Preview */}
      <AnimatePresence>
        {files && files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="mt-6"
          >
            <Card className="p-4 bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-semibold text-gray-900 dark:text-white">
                  Selected Files ({files.length})
                </h4>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setFiles(null)}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear
                </Button>
              </div>
              
              <div className="space-y-2 mb-4">
                {Array.from(files).map((file, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <File className="w-4 h-4 text-primary-500 flex-shrink-0" />
                      <span className="font-medium text-gray-800 dark:text-gray-200 truncate">{file.name}</span>
                      <span className="text-gray-400">({formatFileSize(file.size)})</span>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                      className="p-1 text-gray-400 hover:text-red-500"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleUpload}
                  loading={uploading}
                  size="sm"
                  className="bg-primary-600 hover:bg-primary-700 text-white font-medium"
                >
                  {uploading ? "Processing..." : `Upload & Save ${files.length} File${files.length > 1 ? 's' : ''}`}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Message */}
      {message && (
        <div className={`mt-4 p-3 rounded-lg text-xs font-medium ${
          message.includes("❌") 
            ? "bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800" 
            : "bg-green-50 dark:bg-green-950/40 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800"
        }`}>
          {message}
        </div>
      )}

      {/* Document Library Preview */}
      <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            📚 Active Documents ({documents.length})
          </h3>
          {documents.length > 0 && (
            <button 
              onClick={handleClearAll}
              className="text-xs text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Clear All
            </button>
          )}
        </div>
        
        {documents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {documents.slice(0, 4).map((doc) => (
              <div
                key={doc.id}
                className="p-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 rounded-lg flex items-center justify-center flex-shrink-0">
                    <File className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="font-semibold text-gray-800 dark:text-gray-200 truncate">{doc.fileName}</div>
                    <div className="text-[11px] text-gray-500 dark:text-gray-400">{doc.chunkCount || 0} chunks</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {doc.fileUrl && (
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-gray-400 hover:text-primary-500"
                      title="View file in Supabase"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button
                    onClick={() => deleteDocument(doc.id)}
                    className="p-1 text-gray-400 hover:text-red-500"
                    title="Delete document"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-4">
            No documents uploaded yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default FileUpload;
