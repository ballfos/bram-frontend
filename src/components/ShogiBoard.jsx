import PieceImage from "./PieceImage";
import styles from "./ShogiBoard.module.css";
const ShogiBoard = ({ board, selected, onSquareClick, movableCells }) => {
	console.log(movableCells);
	return (
		<div className={styles.board}>
			{board.map((row, rowIndex) =>
				row.map((piece, colIndex) => (
					<Cell
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						key={`${rowIndex}-${colIndex}`}
						piece={piece}
						reverse={piece && piece.toUpperCase() !== piece}
						selected={selected.row === rowIndex && selected.col === colIndex}
						onClick={() => onSquareClick(rowIndex, colIndex)}
						isMovable={movableCells.some(
							(cell) => cell[0] === rowIndex && cell[1] === colIndex,
						)}
					/>
				)),
			)}
		</div>
	);
};

const Cell = ({ piece, reverse, selected, onClick, isMovable }) => {
	return (
		<div
			className={`${styles.cell} ${isMovable ? styles.movable : ""}`}
			onClick={onClick}
			onKeyDown={onClick}
		>
			{piece && (
				<PieceImage
					piece={piece.toLowerCase()}
					reverse={reverse}
					highlight={selected}
				/>
			)}
		</div>
	);
};

export default ShogiBoard;
