import { useState } from "react";
import { useNavigate } from "react-router";
import { Color } from "shogi.js";
import ThemeToggleButton from "../components/ThemeToggleButton";
import useSfen from "../hooks/useSfen";
import useTurn from "../hooks/useTurn";
import styles from "./Home.module.css";

const options = [
	{ value: Color.Black, label: "先手" },
	{ value: Color.White, label: "後手" },
	{ value: "random", label: "ランダム" },
];

const Home = () => {
	const [sfen, setSfen, resetSfen] = useSfen();
	const [turn, setTurn] = useTurn();
	const [selected, setSelected] = useState({
		turn: Color.Black,
	});
	const navigate = useNavigate();

	const handleStartClick = () => {
		resetSfen();
		if (selected.turn === "random") {
			setTurn(Math.random() < 0.5 ? Color.Black : Color.White);
		} else {
			setTurn(selected.turn);
		}
		navigate("/game");
	};
	const handleRestoreClick = () => {
		navigate("/game");
	};

	return (
		<div className={styles.container}>
			<h1 className={styles.title}>Bらm 将棋 AI</h1>
			<div className={styles["segmented-control"]}>
				{options.map((option) => (
					<>
						<input
							key={`${option.value}-input`}
							type="radio"
							name="color"
							id={option.value}
							checked={selected.turn === option.value}
							onChange={() => {
								setSelected({ turn: option.value });
							}}
						/>
						<label key={`${option.value}-label`} htmlFor={option.value}>
							<span>{option.label}</span>
						</label>
					</>
				))}
				<span className={styles.slider} />
			</div>

			<button
				type="button"
				className={styles.button}
				onClick={handleStartClick}
			>
				対局開始
			</button>

			<span className={styles.divider}>または</span>

			<button
				type="button"
				className={styles.button}
				onClick={handleRestoreClick}
			>
				前回の復元
			</button>

			<span className={styles.divider}>設定</span>

			<ThemeToggleButton />
		</div>
	);
};

export default Home;
