import { useEffect, useState } from "react";
function Permission({ permission }) {
  return (
    <div className="permission-container">
      <h1>{permission.email}</h1>
      <h1>{permission.role}</h1>
    </div>
  );
}

export default Permission;
