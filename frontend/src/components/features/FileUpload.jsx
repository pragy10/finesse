import React, { useState } from "react";
import axios from "axios";
import { useDocuments } from "../../context/DocumentContext";
import { Upload, File, CheckCircle, Trash2, X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { formatFileSize } from '../../utils/constants';

function FileUpload() {
  const [files, setFiles] = useState(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  
  const { documents, fetchDocuments, clearDocuments } = useDocuments();

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
      
      await fetchDocuments();
      setFiles(null);
      const fileInput = document.getElementById('file-input');
      if (fileInput) fileInput.value = '';
      
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
      clearDocuments();
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
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="flex items-center gap-3 text-2xl font-bold text-gray-900 mb-2">
          <Upload className="w-8 h-8 text-primary-500" />
          Document Upload System
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Upload multiple documents and start your AI-powered analysis. Supports various formats with enterprise-grade security.
        </p>
      </div>

      {/* File Drop Zone */}
      <div 
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
          dragOver 
            ? 'border-primary-400 bg-primary-50 scale-102' 
            : 'border-gray-300 bg-gray-50 hover:border-primary-300 hover:bg-primary-25'
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
        
        <motion.div
          animate={dragOver ? { scale: 1.1 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Upload className={`w-16 h-16 mx-auto mb-4 ${dragOver ? 'text-primary-500' : 'text-gray-400'}`} />
        </motion.div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">
            {dragOver ? 'Drop files here!' : 'Drag & drop files here'}
          </h3>
          <p className="text-gray-500">or click to browse files</p>
          
          <div className="inline-flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors mt-4">
            <Plus className="w-5 h-5" />
            Choose Files
          </div>
        </div>
        
        <p className="text-sm text-gray-500 mt-6">
          <span className="font-medium">Supported formats:</span> PDF, DOCX, JPG, PNG, EML
          <br />
          <span className="font-medium">Limits:</span> Max 10 files, 10MB each
        </p>
      </div>

      {/* Selected Files Preview */}
      <AnimatePresence>
        {files && files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8"
          >
            <Card>
              <Card.Header>
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Selected Files ({files.length})
                  </h4>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setFiles(null)}
                  >
                    Clear All
                  </Button>
                </div>
              </Card.Header>
              
              <Card.Content>
                <div className="space-y-3 mb-6">
                  {Array.from(files).map((file, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <File className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{file.name}</div>
                          <div className="text-sm text-gray-500">{formatFileSize(file.size)}</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFile(index)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
                
                <div className="flex justify-center">
                  <Button 
                    onClick={handleUpload}
                    loading={uploading}
                    size="lg"
                    className="min-w-48"
                  >
                    {uploading ? "Processing..." : `Upload ${files.length} File${files.length > 1 ? 's' : ''}`}
                  </Button>
                </div>
              </Card.Content>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Message */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6"
          >
            <Card className={`border-l-4 ${
              message.includes("❌") 
                ? "bg-red-50 border-l-red-400" 
                : "bg-green-50 border-l-green-400"
            }`}>
              <Card.Content>
                <div className={`font-medium ${
                  message.includes("❌") ? "text-red-800" : "text-green-800"
                }`}>
                  {message}
                </div>
              </Card.Content>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Document Library */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              📚 Document Library ({documents.length})
            </h3>
            <p className="text-gray-600 mt-1">All your uploaded and processed documents</p>
          </div>
          {documents.length > 0 && (
            <Button 
              onClick={clearAllDocuments}
              variant="outline"
              size="sm"
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </Button>
          )}
        </div>
        
        {documents.length > 0 ? (
          <div className="grid gap-4">
            {documents.map((doc, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                        <File className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{doc.fileName}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{doc.chunkCount} chunks</span>
                          <span>•</span>
                          <span>{new Date(doc.uploadTime).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{new Date(doc.uploadTime).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="text-sm text-green-600 font-medium">Processed</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <File className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-700 mb-2">No documents uploaded yet</h4>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
                            Upload your first document to get started with AI-powered analysis. 
              Experience the magic of intelligent document processing.
            </p>
            <Button 
              onClick={() => document.getElementById('file-input').click()}
              variant="outline"
              size="lg"
            >
              <Upload className="w-5 h-5" />
              Upload Your First Document
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}

export default FileUpload;

