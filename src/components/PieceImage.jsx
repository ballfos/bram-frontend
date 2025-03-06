import styles from "./PieceImage.module.css";

const PieceImage = ({ src }) => {
	return <img className={styles["piece-image"]} src={src} alt="piece" />;
};

export default PieceImage;
