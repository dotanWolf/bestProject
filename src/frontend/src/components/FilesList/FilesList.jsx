import FileActionMenu from "../FileActionMenu/FileActionMenu";

function FilesList({ files, handleDoubleClick, fetchFiles, onNavigate, show }) {
  return (
    <div
      className="files-list"
      style={{ display: "flex", flexDirection: "column", gap: "10px" }}
    >
      {files.map((file) => (
        <div
          key={file._id} // ✅ Correct: Uses MongoDB _id
          onDoubleClick={() => handleDoubleClick(file)}
          style={{
            padding: "12px 20px",
            backgroundColor: "var(--bg-card)",
            borderRadius: "6px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            border: "1px solid var(--border-color)",
            transition: "background 0.2s",
            userSelect: "none",
            color: "var(--text-primary)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--bg-hover)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--bg-card)")
          }
        >
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <span style={{ fontSize: "1.2rem" }}>
              {file.type === "folder" ? "📁" : "📄"}
            </span>
            <span style={{ fontSize: "1rem" }}>{file.name}</span>
          </div>

          <div onDoubleClick={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
            <FileActionMenu
              file={file}
              refreshFiles={fetchFiles}
              onNavigate={onNavigate}
              show={show}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default FilesList;