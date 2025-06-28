import React from "react";

export default function TestApp() {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Test Application</h1>
      <p>If you can see this, React is working correctly.</p>
      <div style={{ 
        border: "1px solid #ccc", 
        padding: "10px", 
        marginTop: "20px",
        backgroundColor: "#f0f3f5" 
      }}>
        <h2>Microsoft Logo Test</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path fill="#00BCF2" d="M0 0h11.377v11.372H0z"/>
            <path fill="#0078D4" d="M12.623 0H24v11.372H12.623z"/>
            <path fill="#00BCF2" d="M0 12.623h11.377V24H0z"/>
            <path fill="#40E0D0" d="M12.623 12.623H24V24H12.623z"/>
          </svg>
          <span>Microsoft - Correct Logo</span>
        </div>
      </div>
    </div>
  );
}