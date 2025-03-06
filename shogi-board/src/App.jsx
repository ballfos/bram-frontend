// App.js
import React from "react";
import ShogiBoard from "./shougi_AI.jsx";

const App = () => {
  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      justifyContent: "center", 
      alignItems: "center", 
      height: "100vh" 
      
    }}>
      <h1>将棋盤</h1>
      <ShogiBoard />
    </div>
  );
};

export default App;