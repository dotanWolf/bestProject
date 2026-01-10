import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function SearchResults() {
  const { query } = useParams(); // Grabs the 'query' from URL
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    //console.log("Searching for:", query);
    const fetchResults = async () => {
      const term = query || "";
      
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/api/search/${term}?q=${term}`);
        const data = await response.json();
        setResults(data); // PDF Requirement: Update state with server data 
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]); // Re-runs every time user types a letter in TopBar

  return (
    <div className="search-results-container" style={{ padding: "20px", color: "var(--text-color)" }}>
      <h2>Results for: {query}</h2>
      
      {isLoading && <p>Searching...</p>}

      {!isLoading && results.length === 0 && <p>No files or folders found.</p>}

      <div className="results-list">
        {results.map((item) => (
          <div key={item.id} className="result-item" style={{ borderBottom: "1px solid #ccc", padding: "10px" }}>
            <span>{item.type === 'folder' ? '📁' : '📄'}</span>
            <strong> {item.name}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchResults;