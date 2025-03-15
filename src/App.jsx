// App.js

import { Route, BrowserRouter as Router, Routes } from "react-router";
import Game from "./pages/Game";
import Home from "./pages/Home";

const App = () => {
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
