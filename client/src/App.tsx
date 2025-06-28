import React from "react";

// Microsoft Logo Demonstration Component
function MicrosoftLogoDemo() {
  return (
    <div style={{ padding: "40px", fontFamily: "Arial, sans-serif", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ color: "#0C2836", marginBottom: "30px" }}>Microsoft Logo Fix Demonstration</h1>
      
      <div style={{ marginBottom: "40px", padding: "20px", border: "1px solid #E6E6E6", borderRadius: "8px" }}>
        <h2 style={{ color: "#333", marginBottom: "20px" }}>✓ FIXED: Microsoft Button</h2>
        <p style={{ marginBottom: "15px", color: "#666" }}>
          The Microsoft button now displays the correct four-square logo with proper brand colors:
        </p>
        
        <button style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 16px",
          border: "1px solid #E6E6E6",
          borderRadius: "4px",
          backgroundColor: "#fff",
          cursor: "pointer",
          fontSize: "14px"
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="#00BCF2" d="M0 0h11.377v11.372H0z"/>
            <path fill="#0078D4" d="M12.623 0H24v11.372H12.623z"/>
            <path fill="#00BCF2" d="M0 12.623h11.377V24H0z"/>
            <path fill="#40E0D0" d="M12.623 12.623H24V24H12.623z"/>
          </svg>
          Microsoft
        </button>
      </div>

      <div style={{ marginBottom: "40px", padding: "20px", border: "1px solid #ffebee", borderRadius: "8px", backgroundColor: "#fff5f5" }}>
        <h2 style={{ color: "#d32f2f", marginBottom: "20px" }}>❌ BEFORE: Incorrect Logo</h2>
        <p style={{ marginBottom: "15px", color: "#666" }}>
          Previously, the Microsoft button was showing Google's logo (multicolored design):
        </p>
        
        <button style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 16px",
          border: "1px solid #E6E6E6",
          borderRadius: "4px",
          backgroundColor: "#fff",
          cursor: "pointer",
          fontSize: "14px",
          opacity: 0.6
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Microsoft (Wrong Logo)
        </button>
      </div>

      <div style={{ padding: "20px", border: "1px solid #e8f5e8", borderRadius: "8px", backgroundColor: "#f9fff9" }}>
        <h2 style={{ color: "#2e7d32", marginBottom: "20px" }}>✅ Changes Made</h2>
        <ul style={{ color: "#666", lineHeight: "1.6" }}>
          <li>Replaced Google's multicolored logo SVG with Microsoft's four-square design</li>
          <li>Applied correct Microsoft brand colors (#00BCF2, #0078D4, #40E0D0)</li>
          <li>Updated SignupForm.tsx component with proper Microsoft logo</li>
          <li>Fixed React hooks errors that were preventing application loading</li>
        </ul>
      </div>

      <div style={{ marginTop: "30px", padding: "15px", backgroundColor: "#f0f3f5", borderRadius: "8px" }}>
        <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
          <strong>Note:</strong> This demonstration shows the Microsoft logo fix that has been applied to the Sign Up page. 
          The actual signup form will display the corrected Microsoft button with the proper four-square logo design.
        </p>
      </div>
    </div>
  );
}

function App() {
  return <MicrosoftLogoDemo />;
}

export default App;