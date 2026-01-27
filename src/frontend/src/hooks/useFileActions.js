import { useState } from 'react';

export const useFileActions = (onSuccess) => {
  const getHeaders = () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    console.log("Sending Request with -> UserID:", userId, "Token:", token);

    return {
      'Content-Type': 'application/json',
      'userid': userId, 
      'token': token    
    };
  };

  // Soft Delete (Move to Trash)
  const moveToTrash = async (file) => {
    if (!window.confirm(`Move "${file.name}" to trash?`)) return;

    try {
      const response = await fetch(`http://localhost:8080/api/files/${file._id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({isTrashed: true })
      });

      if (response.ok) {
        if (onSuccess) onSuccess();
      } else {
        alert("Failed to move to trash");
      }
    } catch (error) {
      console.error(error);
      alert("Network Error");
    }
  };

  // Permanent Delete
  const deleteFile = async (file) => {
    if (!window.confirm(`Permanently delete "${file.name}"? This cannot be undone.`)) return;

    try {
      const response = await fetch(`http://localhost:8080/api/files/${file._id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      if (response.ok || response.status === 204) {
        if (onSuccess) onSuccess();
      } else {
        alert("Failed to delete file");
      }
    } catch (error) {
      console.error(error);
      alert("Network Error");
    }
  };

  // Toggle Star (Assuming backend supports isStarred field update)
  const toggleStar = async (file) => {
    try {
      const response = await fetch(`http://localhost:8080/api/files/${file._id}`, {
        method: 'PATCH', // Using PATCH to update specific field
        headers: getHeaders(),
        body: JSON.stringify({ isStarred: !file.isStarred }) // Toggle logic
      });

      if (response.ok) {
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return { moveToTrash, deleteFile, toggleStar };
};