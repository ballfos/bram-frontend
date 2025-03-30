import React from "react";
import { MdContentCopy } from "react-icons/md";
import { MdHome } from "react-icons/md";
import { Link } from "react-router";
import styles from "./Header.module.css";
import ThemeToggleButton from "./ThemeToggleButton";
const Header = ({ onCopySfenClick }) => {
	return (
		<header className={styles.header}>
			<h1 className={styles["header-title"]}>Bらm将棋盤</h1>
			<nav className={styles["header-nav"]}>
				<ul className={styles["header-list"]}>
					<li>
						<Link
							className={styles["item-text"]}
							to={{
								pathname: "/",
							}}
						>
							<MdHome fontSize={24} />
						</Link>
					</li>
					<li>
						<button
							onClick={onCopySfenClick}
							className={styles["item-text"]}
							type="button"
						>
							<MdContentCopy fontSize={24} />
						</button>
					</li>
					<li>
						<ThemeToggleButton />
					</li>
				</ul>
			</nav>
		</header>
	);
};

export default Header;
