import { useEffect } from "react";
import { useLocalStorage } from "react-use";

const initialTheme = () => {
	if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
		return "dark";
	}
	return "light";
};

function useTheme() {
	const [theme, setTheme] = useLocalStorage("theme", initialTheme);

	const toggleTheme = () => {
		setTheme(theme === "light" ? "dark" : "light");
	};

	return [theme, toggleTheme];
}

export default useTheme;
