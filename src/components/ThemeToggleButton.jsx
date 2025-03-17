import { useContext, useEffect } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { ThemeContext } from "../hooks/ThemeContext";
import styles from "./ThemeToggleButton.module.css";

const ThemeToggleButton = () => {
	const { theme, toggleTheme } = useContext(ThemeContext);

	return (
		<button
			type="button"
			className={styles["icon-button"]}
			onClick={toggleTheme}
		>
			{theme === "light" ? (
				<FaMoon className={styles.icon} />
			) : (
				<FaSun className={styles.icon} />
			)}
		</button>
	);
};

export default ThemeToggleButton;
