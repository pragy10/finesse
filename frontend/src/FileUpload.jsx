import React, { useState } from "react";
import axios from "axios";

function FileUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => setFile(e.target.files[0]);
  const handleUpload = async () => {
    if (!file) return setMessage("No file selected");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post("http://localhost:3001/upload", formData);
      setMessage(res.data.message);
    } catch (error) {
      setMessage("Upload failed.");
    }
  };

  return (
    <div>
      <input type="file" onChange={handleChange} />
      <button onClick={handleUpload}>Upload</button>
      <div>{message}</div>
    </div>
  );
}

export default FileUpload;
