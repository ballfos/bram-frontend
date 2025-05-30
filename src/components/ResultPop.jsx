import React from "react";
import { useNavigate } from "react-router";
import styles from "./ResultPop.module.css";
const ResultPop = ({ showFlag, setShowFlag, result }) => {
	const navigate = useNavigate();
	if (!showFlag) return null;

	const handleRestartClick = () => {
		setShowFlag(false);
	};
	const handleHomeClick = () => {
		navigate("/");
	};
	return (
		<div className={styles.overlay}>
			<div className={styles["modal-content"]}>
				<h1>{result === "win" ? "勝利" : "敗北"}</h1>
				<div className={styles["button-container"]}>
					<button
						type="button"
						className={styles.button}
						onClick={() => setShowFlag(false)}
					>
						閉じる
					</button>
					{/* <button
						type="button"
						className={styles.button}
						onClick={() => handleRestartClick()}
					>
						もう一度プレイ
					</button> */}
					<button
						type="button"
						className={styles.button}
						onClick={() => handleHomeClick()}
					>
						ホーム
					</button>
				</div>
			</div>
		</div>
	);
};

export default ResultPop;
