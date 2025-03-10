import PieceImage from "./PieceImage";
import styles from "./ShogiBoard.module.css";

const ShogiBoard = ({ board, selected, onSquareClick, moves }) => {
	const cells = [];
	for (let x = 1; x <= 9; x++) {
		for (let y = 1; y <= 9; y++) {
			cells.push(
				<Cell
					key={`${x}-${y}`}
					piece={board[x - 1][y - 1]}
					selected={selected.x === x && selected.y === y}
					onClick={() => onSquareClick(x, y)}
					isMovable={moves.some((move) => move.to.x === x && move.to.y === y)}
				/>,
			);
		}
	}

	return <div className={styles.board}>{cells}</div>;
};

const Cell = ({ piece, selected, onClick, isMovable }) => {
	return (
		<div
			className={`${styles.cell} ${isMovable ? styles.movable : ""}`}
			onClick={onClick}
			onKeyDown={onClick}
		>
			{piece && (
				<PieceImage
					kind={piece.kind}
					color={piece.color}
					highlight={selected}
				/>
			)}
		</div>
	);
};

export default ShogiBoard;
