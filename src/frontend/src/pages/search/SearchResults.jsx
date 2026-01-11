import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './SearchResults.css';
import { useDelete } from "../../hooks/useDelete.jsx";

function SearchResults() {
  const { query } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchResults = async () => {
    const term = query?.trim() || " "; 
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/search/${encodeURIComponent(term)}`, {
        method: 'GET',
        headers: { 'id': '1', 'Content-Type': 'application/json' }
      });
      if (!response.ok) { setResults([]); return; }
      const data = await response.json();
      setResults(Array.isArray(data) ? data : []); 
    } catch (error) {
      setResults([]); 
    } finally { setIsLoading(false); }
  };

  const { deleteItem } = useDelete(fetchResults)
  useEffect(() => { fetchResults(); }, [query]);

 return (
    <div className="search-container">
      {isLoading && <p className="status-msg">Searching...</p>}
      {!isLoading && results.length === 0 && (
        <p className="status-msg">No files found for "{query}"</p>
      )}
      {!isLoading && results.length > 0 && (
        <div className="results-list">
          {results.map((item) => (
            <div key={item.id} className="result-item">
              <span className="icon">{item.type === 'folder' ? '📁' : '📄'}</span>
              <span className="file-name">{item.name}</span>
              
              <div className="button-group">
                {item.type !== 'folder' && (
                  <button className="edit-btn" onClick={() => navigate(`/update/${item.id}`)}>
                    ✏️ Edit
                  </button>
                )}
                <button className="delete-btn" onClick={() => deleteItem(item)}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchResults;