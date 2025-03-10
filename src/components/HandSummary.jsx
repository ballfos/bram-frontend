import styles from "./HandSummary.module.css";
import PieceImage from "./PieceImage";

const HandSummary = ({ summary, color, selectedKind, onPieceClick }) => {
	return (
		<div className={styles["hand-summary-container"]}>
			{Object.entries(summary)
				.filter(([_, count]) => count > 0)
				.map(([kind, count]) => (
					<PieceImage
						key={kind}
						kind={kind}
						color={color}
						count={count}
						highlight={kind === selectedKind}
						onClick={() => {
							onPieceClick({ kind, color });
						}}
					/>
				))}
		</div>
	);
};

export default HandSummary;
