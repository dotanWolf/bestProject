import { useNavigate } from "react-router-dom";
import Input from "../../input/Input";

function Create() {
  const navigate = useNavigate();

  const handleCreate = async (dataToSend) => {
    const token = localStorage.getItem("token"); 
    const userId = localStorage.getItem("userId");

    // 1. Validation: Ensure we have a valid ID and Token
    if (!token || !userId || userId === "undefined") {
      alert("Session expired or invalid. Please log in again.");
      navigate("/login");
      return false;
    }

    const url = "http://localhost:8080/api/files"; 
    console.log("Creating item with data:", dataToSend);
    // 2. Uniform Headers: Always send JSON
    const headers = {
      'Authorization': `Bearer ${token}`,
      'id': userId, 
      'Content-Type': 'application/json'
    };

    const body = JSON.stringify({ 
      ...dataToSend, 
      parentId: null, 
      isTrashed: false,
      //createdAt: new Date().toISOString(),
      //updatedAt: new Date().toISOString()
    });
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: body
      });

      if (response.ok) {
        navigate("/my-drive"); // Redirect to see the new item
        return true; 
      } else {
        const errorData = await response.json();
        alert(`Server error: ${errorData.error || "Failed to create item"}`);
        return false;
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("Network error - check if server is running");
      return false;
    }
  };

  return (
    <div className="create-container" style={{ padding: "40px", color: "white" }}>
      <Input 
        createText="Create New Item" 
        handleClick={handleCreate} 
      />
    </div>
  );
}

export default Create;