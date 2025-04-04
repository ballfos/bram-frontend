import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { Color, Piece, Shogi } from "shogi.js";
import HandSummary from "../components/HandSummary";
import Header from "../components/Header";
import Modal from "../components/ResultPop";
import ShogiBoard from "../components/ShogiBoard";
import useSfen from "../hooks/useSfen";
import useTurn from "../hooks/useTurn";
import { shogiFromSfen } from "../utils";
import styles from "./Game.module.css";

const initialSelectedState = {
	type: null, // "board" | "hand" | null
	piece: null, // Piece | null
	x: null, // 1-9 | null
	y: null, // 1-9 | null
	moves: [], // IMove[]
};
const gameStatus = {
	PLAY: "play",
	WIN: "win",
	LOSE: "lose",
};

const Game = () => {
	const [sfen, setSfen] = useSfen();
	const [turn, setTurn] = useTurn();
	const [selected, setSelected] = useState(initialSelectedState);
	const [gameState, setgameState] = useState(gameStatus.PLAY);
	const shogi = useMemo(() => shogiFromSfen(sfen), [sfen]);
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		if (shogi.turn !== turn) {
			axios
				.post("http://127.0.0.1:8000/next", {
					currentSfen: shogi.toSFENString(),
				})
				.then((response) => {
					const nextSfen = response.data.message;
					const status = response.data.status;
					setgameState(status);
					setSfen(nextSfen);
				})
				.catch((error) => {
					console.error("Error sending data:", error);
				});
		}
	}, [shogi, setSfen, turn]);

	useEffect(() => {
		if (gameState !== gameStatus.PLAY) {
			setShowModal(true);
		}
	}, [gameState]);

	const handleBoardClick = (x, y) => {
		if (gameState !== gameStatus.PLAY) {
			return;
		}
		if (shogi.turn !== turn) {
			return;
		}
		const piece = shogi.board[x - 1][y - 1];
		switch (selected.type) {
			// 現時点でボード上の駒が選択されている場合
			case "board": {
				const { x: fromx, y: fromy, moves } = selected;

				// 移動可能マスをクリックした場合
				const movable = moves.some(
					(move) => move.to.x === x && move.to.y === y,
				);
				if (movable) {
					const enteredEnemyTerritory =
						(shogi.turn === Color.White && y > 6) ||
						(shogi.turn === Color.Black && y < 4);
					const canPromote =
						Piece.canPromote(shogi.board[fromx - 1][fromy - 1].kind) &&
						enteredEnemyTerritory;

					let promote = false;
					if (canPromote) {
						if (window.confirm("成りますか？")) {
							promote = true;
						}
					}
					setSfen(() => {
						shogi.move(fromx, fromy, x, y, promote);
						return shogi.toSFENString();
					});
				}
				setSelected(initialSelectedState);
				break;
			}

			// 現時点で持ち駒が選択されている場合
			case "hand": {
				// 移動可能マスでない場合は選択を解除する
				const canDrop = selected.moves.some(
					(move) => move.to.x === x && move.to.y === y,
				);
				if (canDrop) {
					// 空いている場合は駒を配置する
					setSfen(() => {
						shogi.drop(x, y, selected.piece.kind, selected.piece.color);
						return shogi.toSFENString();
					});
				}
				setSelected(initialSelectedState);
				break;
			}

			// 現時点で何も選択されていない場合
			default: {
				if (piece && shogi.turn === piece.color) {
					setSelected({
						type: "board",
						piece,
						x,
						y,
						moves: shogi.getMovesFrom(x, y),
					});
					break;
				}
			}
		}
	};

	const handleHandClick = (piece) => {
		if (shogi.turn === piece.color) {
			setSelected({
				type: "hand",
				piece,
				x: null,
				y: null,
				moves: shogi
					.getDropsBy(shogi.turn)
					.filter((move) => move.kind === piece.kind),
			});
		}
	};

	const handleCopyClick = async () => {
		try {
			await navigator.clipboard.writeText(shogi.toSFENString());
		} catch (err) {}
	};

	return (
		<div className="container">
			<Header onCopySfenClick={handleCopyClick} />
			<Modal
				showFlag={showModal}
				setShowFlag={setShowModal}
				result={gameState}
			/>
			<div
				className={styles.container}
				style={
					turn === Color.Black
						? { transform: "rotate(0deg)" }
						: { transform: "rotate(180deg)" }
				}
			>
				{/* 先手の持ち駒 */}
				<div className={styles["hand-summary-container"]}>
					<HandSummary
						summary={shogi.getHandsSummary(Color.White)}
						color={Color.White}
						onPieceClick={handleHandClick}
						selectedKind={selected.type === "hand" ? selected.piece.kind : null}
					/>
				</div>

				{/* 将棋盤 */}
				<ShogiBoard
					board={shogi.board}
					selected={selected}
					onSquareClick={(x, y) => handleBoardClick(x, y)}
					moves={selected.moves}
				/>

				{/* 後手の持ち駒 */}
				<div className={styles["hand-summary-container"]}>
					<HandSummary
						summary={shogi.getHandsSummary(Color.Black)}
						color={Color.Black}
						onPieceClick={handleHandClick}
						selectedKind={selected.type === "hand" ? selected.piece.kind : null}
					/>
				</div>
			</div>
		</div>
	);
};

export default Game;
