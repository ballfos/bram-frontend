import { useEffect } from "react";
import { useLocalStorage } from "react-use";

function useTheme() {
	const [theme, setTheme] = useLocalStorage("theme", "light");

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
	}, [theme]);

	const toggleTheme = () => {
		setTheme(theme === "light" ? "dark" : "light");
	};

	return [theme, toggleTheme];
}

export default useTheme;
