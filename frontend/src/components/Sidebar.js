import React from 'react';
import './Sidebar.css';

function Sidebar() {
  return (
    <aside className="sidebar">
      <h3>Playlists</h3>
      <ul>
        <li>Top Hits</li>
        <li>Recommended</li>
        <li>Recently Added</li>
      </ul>
    </aside>
  );
}

export default Sidebar;
