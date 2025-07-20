# Finesse - AI-Powered Document Intelligence Platform

**Transform your documents into intelligent insights with advanced AI analysis and semantic search capabilities.**

## 🚀 Features

- **Multi-Format Support** - Upload PDFs, DOCX, images, and more
- **AI-Powered Analysis** - Advanced document understanding with Google Gemini
- **Semantic Search** - Find information based on meaning, not just keywords
- **Real-time Chat** - Ask questions and get intelligent answers from your documents
- **Secure Processing** - Enterprise-grade security with no permanent data storage
- **Lightning Fast** - Sub-3 second response times with optimized processing

## 🛠️ Tech Stack

### Backend
- **Node.js & Express** - RESTful API server
- **Google Gemini AI** - Advanced language model for document reasoning
- **Qdrant Vector DB** - High-performance vector database for semantic search
- **Hugging Face** - Embeddings generation for semantic understanding
- **Multer** - File upload handling
- **Multiple Document Parsers** - PDF, DOCX, OCR for images

### Frontend
- **React 18** - Modern UI framework
- **React Router** - Client-side routing
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful icon library
- **Axios** - HTTP client for API communication
- **Responsive Design** - Mobile-first approach

## 📋 Prerequisites

- Node.js 16+ and npm
- Google AI API key (for Gemini)
- Qdrant Cloud account or local instance
- Hugging Face API key

## 🔧 Installation

### 1. Clone Repository
```bash
git clone https://github.com/pragy10/finesse.git
cd finesse
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
echo "QDRANT_URL=your_qdrant_url
QDRANT_API_KEY=your_qdrant_key
GOOGLE_API_KEY=your_google_gemini_key
HF_TOKEN=your_huggingface_token" > .env

# Create Qdrant collection
node setup/createCollection.js

# Start backend server
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🌐 Usage

1. **Upload Documents** - Drag & drop or select files (PDF, DOCX, images)
2. **AI Analysis** - Documents are automatically parsed, chunked, and embedded
3. **Ask Questions** - Use natural language to query your documents
4. **Get Insights** - Receive intelligent answers with confidence scores and source citations

## 📁 Project Structure

```
finesse/
├── backend/
│   ├── llm/              # AI reasoning engine
│   ├── vector/           # Vector database operations
│   ├── parsing/          # Document parsing utilities
│   ├── routes/           # API endpoints
│   └── setup/            # Configuration files
└── frontend/
    ├── src/
    │   ├── components/   # React components
    │   ├── pages/        # Application pages
    │   ├── context/      # State management
    │   └── styles/       # CSS styles
    └── public/           # Static assets
```

## 🔑 Environment Variables

Create `.env` file in the backend directory:

```env
QDRANT_URL=https://your-cluster.cloud.qdrant.io
QDRANT_API_KEY=your_qdrant_api_key
GOOGLE_API_KEY=your_google_gemini_api_key
HF_TOKEN=your_huggingface_token
```

## 🚦 API Endpoints

- `POST /upload` - Upload and process documents
- `POST /ask` - AI-powered document questioning
- `POST /search` - Semantic search across documents
- `GET /documents` - List uploaded documents
- `POST /clear-all` - Clear all documents

## 📱 Key Components

- **Document Upload** - Multi-file upload with drag & drop
- **AI Assistant** - Conversational interface with Google Gemini
- **Semantic Search** - Vector-based document search
- **Document Library** - Manage uploaded documents

## 🎯 Use Cases

- **Insurance Claim Processing** - Analyze policies and determine eligibility
- **Legal Document Review** - Extract key information from contracts
- **Research & Analysis** - Query academic papers and reports
- **Knowledge Management** - Build searchable document repositories

## 🔒 Security

- End-to-end encryption for document processing
- No permanent storage of uploaded documents
- Secure API key management
- CORS protection and input validation

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini for advanced AI capabilities
- Qdrant for high-performance vector search
- Hugging Face for embedding models
- React and Node.js communities

**Built with ❤️ for intelligent document processing**
