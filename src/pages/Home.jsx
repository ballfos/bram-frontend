import { useNavigate } from "react-router";
import useSfen from "../hooks/useSfen";
import styles from "./Home.module.css";

const Home = () => {
	const [sfen, setSfen, resetSfen] = useSfen();
	const navigate = useNavigate();

	const handleStartClick = () => {
		resetSfen();
		navigate("/game");
	};
	const handleRestoreClick = () => {
		navigate("/game");
	};

	return (
		<div className={styles.container}>
			<h1 className={styles.title}>Bらm 将棋 AI</h1>
			<button
				type="button"
				className={styles.button}
				onClick={handleStartClick}
			>
				対局開始
			</button>
			<button
				type="button"
				className={styles.button}
				onClick={handleRestoreClick}
			>
				前回の復元
			</button>
		</div>
	);
};

export default Home;
