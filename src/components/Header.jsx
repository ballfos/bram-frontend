import React from "react";
import "./Header.css";
import { MdContentCopy } from "react-icons/md";
const Header = ({ onCopySfenClick }) => {
	return (
		<header className="header">
			<h1 className="header-title">Bらm将棋盤</h1>
			<nav className="header-nav">
				<ul className="header-list">
					<li>
						<a href="/" className="header-button">
							<h3>ホーム</h3>
						</a>
					</li>
					<li>
						<button
							onClick={onCopySfenClick}
							className="header-button"
							type="button"
						>
							<MdContentCopy fontSize={24} /> <h3>SFEN</h3>
						</button>
					</li>
				</ul>
			</nav>
		</header>
	);
};

export default Header;
