import React from 'react';

export default function Sidebar({ documents, currentUserId, selectedDocId, onSelectDoc }) {
  return (
    <div className="sidebar">
      <h3>Documents</h3>
      {documents.length === 0 ? <p>No documents yet.</p> : null}

      <ul className="doc-list">
        {documents.map(doc => {
          const isOwner = doc.owner_id === currentUserId;
          return (
            <li
              key={doc.id}
              className={selectedDocId === doc.id ? 'active' : ''}
              onClick={() => onSelectDoc(doc)}
            >
              <div className="doc-title">{doc.title || "Untitled"}</div>
              <div className="doc-badge">
                {isOwner ? "Owner" : "Shared"}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}