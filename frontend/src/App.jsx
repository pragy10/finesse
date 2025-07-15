import FileUpload from "./components/FileUpload";
import ClauseSearch from "./components/ClauseSearch";

function App() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>🧠 Finesse | Smart Claim Reasoning</h1>
      <FileUpload />
      <ClauseSearch />
    </div>
  );
}

export default App;
