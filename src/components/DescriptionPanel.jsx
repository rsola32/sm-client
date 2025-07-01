import React, { useState, useRef, useEffect } from 'react';
import './DescriptionPanel.css';

export default function DescriptionPanel({ heading, body, defaultExpanded = true }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState('auto');

  // Update content height when content or expansion state changes.
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [body, expanded]);

  const toggleExpanded = () => setExpanded(prev => !prev);

  return (
    <div className={`desc-panel-container ${expanded ? '' : 'collapsed'}`}>
      {expanded ? (
        <>
          <div className="desc-panel-header" onClick={toggleExpanded}>
            <button className="desc-panel-toggle" aria-label="Collapse panel">×</button>
            <div className="heading-div">
              <h3 className="desc-panel-heading">{heading}</h3>
            </div>
          </div>
          <div className="desc-panel-body" style={{ maxHeight: contentHeight }}>
            <div ref={contentRef} className="desc-panel-content">
              <p>{body}</p>
            </div>
          </div>
        </>
      ) : (
        <div className="desc-panel-collapsed" onClick={toggleExpanded} aria-label="Expand panel">
          <span className="collapsed-icon">i</span>
        </div>
      )}
    </div>
  );
}
