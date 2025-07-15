import React, { useState } from "react";
import axios from "axios";

function ClauseSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await axios.post("http://localhost:3001/search", { query });
      console.log("🔍 Full axios response:", res);
      console.log("📊 Response data:", res.data);
      console.log("🔢 Response data type:", typeof res.data);
      console.log("📋 Response is array:", Array.isArray(res.data));

      setResults(res.data || []);

      console.log("✅ Set results to state");
    } catch (err) {
      console.error("❌ Search failed:", err);
      setError(err.response?.data?.error || "Search failed. Please try again.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  console.log("🖥️ Component render - Results:", results);
  console.log("🖥️ Component render - Results length:", results.length);
  console.log("🖥️ Component render - Loading:", loading);

  return (
    <div
      style={{ marginTop: "2rem", padding: "20px", border: "1px solid #ddd" }}
    >
      <h2>🔍 Ask a Question</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Am I eligible for knee surgery claim?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: "300px", padding: "8px" }}
        />
        <button type="submit" style={{ marginLeft: "10px", padding: "8px" }}>
          Search
        </button>
      </form>

      {loading && <p style={{ color: "blue" }}>🔄 Searching...</p>}

      {error && (
        <div
          style={{
            color: "red",
            marginTop: "1rem",
            padding: "10px",
            background: "#ffebee",
          }}
        >
          <p>
            <strong>❌ Error:</strong> {error}
          </p>
        </div>
      )}

      {/* ALWAYS SHOW DEBUG INFO */}
      <div
        style={{
          background: "#f5f5f5",
          padding: "15px",
          margin: "15px 0",
          borderRadius: "5px",
          fontSize: "14px",
        }}
      >
        <h4>🐛 Debug Info:</h4>
        <p>
          <strong>Results length:</strong> {results.length}
        </p>
        <p>
          <strong>Results type:</strong> {typeof results}
        </p>
        <p>
          <strong>Is array:</strong>{" "}
          {Array.isArray(results) ? "✅ YES" : "❌ NO"}
        </p>
        <p>
          <strong>Loading:</strong> {loading ? "✅ YES" : "❌ NO"}
        </p>
        <p>
          <strong>Error:</strong> {error || "None"}
        </p>
        <details>
          <summary style={{ cursor: "pointer", color: "blue" }}>
            📋 Raw Results Data
          </summary>
          <pre
            style={{
              background: "#fff",
              padding: "10px",
              fontSize: "12px",
              overflow: "auto",
              maxHeight: "300px",
            }}
          >
            {JSON.stringify(results, null, 2)}
          </pre>
        </details>
      </div>

      {/* FORCE SHOW RESULTS - IGNORE LENGTH CHECK */}
      <div
        style={{
          background: "#e8f5e8",
          padding: "15px",
          margin: "15px 0",
          borderRadius: "5px",
        }}
      >
        <h4>🎯 Forced Results Display:</h4>
        {results && results.length > 0 ? (
          <ul>
            {results.map((item, i) => (
              <li
                key={i}
                style={{
                  marginBottom: "10px",
                  padding: "10px",
                  background: "#fff",
                }}
              >
                <div>
                  <strong>Match {i + 1}</strong>
                </div>
                <div>
                  <strong>ID:</strong> {item.id}
                </div>
                <div>
                  <strong>Score:</strong> {item.score}
                </div>
                <div>
                  <strong>File:</strong> {item.payload?.fileName || "Unknown"}
                </div>
                <div>
                  <strong>Text:</strong> {item.payload?.text || "No text"}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>❌ No results to display</p>
        )}
      </div>

      {/* ORIGINAL LOGIC */}
      {results.length > 0 && (
        <div
          style={{
            background: "#fff3cd",
            padding: "15px",
            margin: "15px 0",
            borderRadius: "5px",
          }}
        >
          <h4>📜 Original Results Logic:</h4>
          <ul>
            {results.map((item, i) => (
              <li key={i} style={{ marginBottom: "10px" }}>
                <b>Match {i + 1}</b>: {item.payload?.text}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && !error && results.length === 0 && query.trim() && (
        <div
          style={{
            background: "#f8d7da",
            padding: "15px",
            margin: "15px 0",
            borderRadius: "5px",
            color: "#721c24",
          }}
        >
          <p>❌ No results found for "{query}". Try different keywords.</p>
        </div>
      )}
    </div>
  );
}

export default ClauseSearch;
