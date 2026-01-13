import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./SearchResults.css";
import FileActionMenu from "../../components/FileActionMenu/FileActionMenu"; 

function SearchResults() {
  const { query } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchResults = async () => {
    const term = query?.trim() || "";
    if (!term) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/search/${encodeURIComponent(term)}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        setResults([]);
        return;
      }
      const data = await response.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [query]);

  return (
    <div className="search-page-container">
      <div className="search-content">
        <header className="search-results-header">
          <h1>Search results for "{query}"</h1>
        </header>
        
        {isLoading && <p className="search-status">Searching...</p>}
        
        {!isLoading && results.length === 0 && (
          <div className="search-empty">
            <p>No files found matching your search.</p>
          </div>
        )}
        
        {!isLoading && results.length > 0 && (
          <div className="results-list">
            {results.map((item) => (
              <div key={item.id} className="result-row">
                <div 
                  className="result-info" 
                  onClick={() => navigate(item.type === 'folder' ? '/my-drive' : `/update/${item.id}`)}
                >
                  <span className="result-icon">
                    {item.type === "folder" ? "📁" : "📄"}
                  </span>
                  <span className="result-name">{item.name}</span>
                </div>

                <div className="result-actions">
                  <FileActionMenu 
                    file={item} 
                    refreshFiles={fetchResults} 
                    onNavigate={(folder) => navigate(`/my-drive`)} 
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResults;