import fetchResults from '../pages/search/SearchResults.jsx';
export const useMoveToTrash = (onSuccess) => {
  const moveItem = async (item) => {
    if (!window.confirm(`Are you sure you want to move ${item.name} to trash?`)) return;

    try {
      const response = await fetch(`http://localhost:8080/api/files/${item.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'id': '1' // Assuming user ID is 1 for this example
        },
        body: JSON.stringify({ isTrashed: true })
      });

      if (response.ok) {
        alert("Moved to trash successfully!");
        fetchResults();
        if (onSuccess) onSuccess(); // Call the onSuccess callback to refresh data 
      } 
    }
    catch (error) {
      alert("Network error occurred");
    }
  };

  return { deleteItem };
};