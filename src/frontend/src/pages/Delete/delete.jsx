import { useEffect, useState } from "react";

function Delete() {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllFiles = async () => {
    setIsLoading(true);
    try {
      // Use empty string or "*" to get all files
      const response = await fetch("http://localhost:8080/api/search/*", {
        method: 'GET',
        headers: {
          'id': '1', // static user ID for testing
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.warn("Server error:", response.status);
        setFiles([]);
        return;
      }

      const data = await response.json();
      setFiles(Array.isArray(data) ? data : []); 
    } catch (error) {
      console.error("Failed to load files:", error);
      setFiles([]); 
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllFiles();
  }, []);
  
  const handleDelete = async (fileName, type) => {
    if (!window.confirm(`Are you sure you want to delete ${fileName}?`)) return;

    try {
      const response = await fetch("http://localhost:8080/api/files", {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'id': '1'
        },
        body: JSON.stringify({ name: fileName, type: type })
      });

      if (response.ok) {
        alert("Deleted successfully!");
        fetchAllFiles();
      } else {
        const error = await response.json();
        alert(`Delete failed: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Network error occurred");
    }
  };

  return (
    <div className="delete-container" style={{ padding: "20px", color: "white" }}>
      <h1>Delete Management</h1>
      <p>Select an item to remove from storage:</p>

      {isLoading ? (
        <p>Loading files...</p>
      ) : (
        <div className="files-list" style={{ marginTop: "20px" }}>
          {files.length === 0 ? (
            <p>No files found in storage.</p>
          ) : (
            files.map((file) => (
              <div 
                key={file.id} 
                style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  padding: "15px", 
                  background: "#333", 
                  marginBottom: "10px",
                  borderRadius: "8px"
                }}
              >
                <span>
                  {file.type === 'folder' ? '📁' : '📄'} {file.name}
                </span>
                <button 
                  onClick={() => handleDelete(file.name, file.type)}
                  style={{
                    padding: "8px 16px",
                    background: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Delete;