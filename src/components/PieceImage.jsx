import { Color } from "shogi.js";
import styles from "./PieceImage.module.css";

const kindToSrc = {
	FU: "/pieces/p.png",
	KY: "/pieces/l.png",
	KE: "/pieces/n.png",
	GI: "/pieces/s.png",
	KI: "/pieces/g.png",
	OU: "/pieces/k.png",
	HI: "/pieces/r.png",
	KA: "/pieces/b.png",
	TO: "/pieces/+p.png",
	NK: "/pieces/+l.png",
	NY: "/pieces/+n.png",
	NG: "/pieces/+s.png",
	RY: "/pieces/+r.png",
	UM: "/pieces/+b.png",
};

const PieceImage = ({
	kind,
	color,
	count = 1,
	highlight = false,
	...props
}) => {
	return (
		<div
			className={`${styles["piece-container"]} ${highlight ? styles["piece-highlight"] : ""}`}
			{...props}
		>
			<img
				className={styles["piece-image"]}
				src={`${import.meta.env.BASE_URL}${kindToSrc[kind]}`}
				alt={`${color}-${kind}`}
				style={{
					transform: color === Color.White ? "rotate(180deg)" : "",
				}}
			/>
			{count > 1 && <span className={styles["piece-number"]}>{count}</span>}
		</div>
	);
};

export default PieceImage;
