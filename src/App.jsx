// App.js
import React from "react";
import ShogiContent from "./shougi_AI.jsx";

const App = () => {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				height: "100vh",
			}}
		>
			<h1>将棋盤</h1>
			<ShogiContent />
		</div>
	);
};

export default App;
