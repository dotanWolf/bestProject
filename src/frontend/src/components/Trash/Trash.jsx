import React from 'react';
import './Trash.css';

const Trash = () => {
  return (
    <div className="trash-page-container">
      <div className="trash-empty-state">
        <h2 className="trash-heading">Trash is empty</h2>
        <p className="trash-subtext">
          Items moved to the trash will be permanently deleted after 30 days.
        </p>
      </div>
    </div>
  );
};

export default Trash;