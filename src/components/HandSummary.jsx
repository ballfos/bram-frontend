import styles from "./HandSummary.module.css";
import PieceImage from "./PieceImage";

const HandSummary = ({ pieces, selected, onPieceClick }) => {
	const hand = pieces.reduce((acc, piece) => {
		acc[piece] = (acc[piece] || 0) + 1;
		return acc;
	}, {});

	return (
		<div className={styles["hand-summary-container"]}>
			{Object.entries(hand).map(([piece, count]) => (
				<PieceImage
					key={piece}
					piece={piece.toLowerCase()}
					count={count}
					highlight={piece === selected}
					onClick={() => onPieceClick(piece)}
				/>
			))}
		</div>
	);
};

export default HandSummary;
