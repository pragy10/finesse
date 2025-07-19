import FileUpload from "./components/FileUpload";
import ClauseSearch from "./components/ClauseSearch";
import { DocumentProvider } from "./context/DocumentContext";

function App() {
  return (
    <DocumentProvider>
      <div style={{ 
        maxWidth: "1200px", 
        margin: "0 auto", 
        padding: "20px",
        fontFamily: "Arial, sans-serif"
      }}>
        <header style={{ 
          textAlign: "center", 
          marginBottom: "40px",
          padding: "20px",
          backgroundColor: "#f8f9fa",
          borderRadius: "10px"
        }}>
          <h1 style={{ margin: "0", color: "#333" }}>
            🧠 Finesse | Smart Document Reasoning
          </h1>
          <p style={{ margin: "10px 0 0 0", color: "#666" }}>
            Upload multiple documents and search across them using AI-powered semantic understanding
          </p>
        </header>
        
        <div style={{ 
          display: "grid", 
          gap: "30px",
          gridTemplateColumns: "1fr",
          marginBottom: "20px"
        }}>
          <div style={{ 
            backgroundColor: "white",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            overflow: "hidden"
          }}>
            <FileUpload />
          </div>
          
          <div style={{ 
            backgroundColor: "white",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            overflow: "hidden"
          }}>
            <ClauseSearch />
          </div>
        </div>
      </div>
    </DocumentProvider>
  );
}

export default App;
