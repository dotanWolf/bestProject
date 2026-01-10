import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function SearchResults() {
  const { query } = useParams(); // שואב את מילת החיפוש מה-URL
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      const term = query?.trim() || ""; 
      
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/api/search/${encodeURIComponent(term)}`, {
          method: 'GET',
          headers: {
            'id': '1',
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          console.warn("Server error:", response.status);
          setResults([]);
          return;
        }

        const data = await response.json();
        
        // ודא שהנתונים הם מערך לפני עדכון ה-State
        setResults(Array.isArray(data) ? data : []); 
        
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]); // ירוץ מחדש בכל פעם שהמשתמש מקליד משהו ב-TopBar

  return (
    <div className="search-results-container" style={{ padding: "20px", color: "var(--text-color)" }}>
      <h2>Results for: {query || "All Files"}</h2>
      
      {isLoading && <p>Searching...</p>}

      {!isLoading && results.length === 0 && <p>No files or folders found.</p>}

      <div className="results-list">
        {results.map((item) => (
          <div 
            key={item.id || item.name} 
            className="result-item" 
            style={{ 
              borderBottom: "1px solid #ccc", 
              padding: "10px", 
              display: "flex", 
              alignItems: "center",
              gap: "10px" 
            }}
          >
            <span style={{ fontSize: "20px" }}>
              {item.type === 'folder' ? '📁' : '📄'}
            </span>
            <strong>{item.name}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchResults;