// App.js

import { useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router";
import useTheme from "./hooks/useTheme";
import Game from "./pages/Game";
import Home from "./pages/Home";

const App = () => {
	const [theme] = useTheme();
	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
	}, [theme]);

	return (
		<Router basename={import.meta.env.BASE_URL}>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/game" element={<Game />} />
			</Routes>
		</Router>
	);
};

export default App;
