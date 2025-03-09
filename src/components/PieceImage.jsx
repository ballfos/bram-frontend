import styles from "./PieceImage.module.css";

const pieceToSrc = {
	p: "/pieces/p.png",
	l: "/pieces/l.png",
	n: "/pieces/n.png",
	s: "/pieces/s.png",
	g: "/pieces/g.png",
	k: "/pieces/k.png",
	r: "/pieces/r.png",
	b: "/pieces/b.png",
	"+p": "/pieces/+p.png",
	"+l": "/pieces/+l.png",
	"+n": "/pieces/+n.png",
	"+s": "/pieces/+s.png",
	"+r": "/pieces/+r.png",
	"+b": "/pieces/+b.png",
};

const PieceImage = ({
	piece,
	reverse = false,
	count = 1,
	highlight = false,
	onClick,
}) => {
	return (
		<div
			className={`${styles["piece-container"]} ${highlight ? styles["piece-highlight"] : ""}`}
			onClick={onClick}
			onKeyDown={onClick}
		>
			<img
				className={styles["piece-image"]}
				src={pieceToSrc[piece]}
				alt={piece}
				style={{ transform: reverse ? "rotate(180deg)" : "" }}
			/>
			{count > 1 && <span className={styles["piece-number"]}>{count}</span>}
		</div>
	);
};

export default PieceImage;
