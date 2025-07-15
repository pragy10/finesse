import React, { useState } from "react";
import axios from "axios";

function FileUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [chunks, setChunks] = useState([]);

  const handleChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return setMessage("No file selected");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:3001/upload", formData);
      setMessage(res.data.message);
      setChunks(res.data.chunks);
    } catch (error) {
      console.error("Upload failed:", error);
      setMessage("Upload failed.");
    }
  };

  return (
    <div>
      <h2>📄 Upload a Document</h2>
      <input type="file" onChange={handleChange} />
      <button onClick={handleUpload}>Upload</button>
      <div>{message}</div>
      {chunks.length > 0 && (
        <ul>
          {chunks.map((chunk, index) => (
            <li key={index}>{chunk}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FileUpload;
