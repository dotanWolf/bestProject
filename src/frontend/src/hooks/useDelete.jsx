// src/hooks/useDelete.jsx
export const useDelete = (onSuccess) => {
  const deleteItem = async (item) => {
    if (!window.confirm(`Are you sure you want to delete ${item.name}?`)) return;

    try {
      const response = await fetch(`http://localhost:8080/api/files/${item.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'id': '1' // Assuming user ID is 1 for this example
        }
      });

      if (response.ok || response.status === 204) {
        alert("Deleted successfully!");
        if (onSuccess) onSuccess(); // Call the onSuccess callback to refresh data 
      } else {
        const error = await response.json();
        alert(`Delete failed: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      alert("Network error occurred");
    }
  };

  return { deleteItem };
};