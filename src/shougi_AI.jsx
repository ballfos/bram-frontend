import axios from "axios";
import React, { useState, useEffect, useMemo } from "react";
import "./Shougi_AI.css";
import PieceImage from "./components/PieceImage";

const pieceSymbols = {
	p: <PieceImage src="/pieces/p.png" />,
	l: <PieceImage src="/pieces/l.png" />,
	n: <PieceImage src="/pieces/n.png" />,
	s: <PieceImage src="/pieces/s.png" />,
	g: <PieceImage src="/pieces/g.png" />,
	k: <PieceImage src="/pieces/k.png" />,
	r: <PieceImage src="/pieces/r.png" />,
	b: <PieceImage src="/pieces/b.png" />,
	"+p": <PieceImage src="/pieces/+p.png" />,
	"+l": <PieceImage src="/pieces/+l.png" />,
	"+n": <PieceImage src="/pieces/+n.png" />,
	"+s": <PieceImage src="/pieces/+s.png" />,
	"+r": <PieceImage src="/pieces/+r.png" />,
	"+b": <PieceImage src="/pieces/+b.png" />,
	P: <PieceImage src="/pieces/p.png" />,
	L: <PieceImage src="/pieces/l.png" />,
	N: <PieceImage src="/pieces/n.png" />,
	S: <PieceImage src="/pieces/s.png" />,
	G: <PieceImage src="/pieces/g.png" />,
	K: <PieceImage src="/pieces/k.png" />,
	R: <PieceImage src="/pieces/r.png" />,
	B: <PieceImage src="/pieces/b.png" />,
	"+P": <PieceImage src="/pieces/+p.png" />,
	"+L": <PieceImage src="/pieces/+l.png" />,
	"+N": <PieceImage src="/pieces/+n.png" />,
	"+S": <PieceImage src="/pieces/+s.png" />,
	"+R": <PieceImage src="/pieces/+r.png" />,
	"+B": <PieceImage src="/pieces/+b.png" />,
};

const sfenToNewBoard = (sfen) => {
	if (sfen === "None") {
		alert("勝ち！！！");
		setIsGameOver(true);
		// biome-ignore lint/correctness/noInvalidUseBeforeDeclaration: <explanation>
		return { board, hand };
	}

	const [position, turn, handString] = sfen.split(" ");

	// 盤面の解析
	const board = position.split("/").map((row) => {
		const expandedRow = [];
		let isPromoted = false; // 成駒フラグ

		for (const char of row) {
			if (char === "+") {
				// 次の文字が成駒
				isPromoted = true;
				continue;
			}

			if (/\d/.test(char)) {
				// 空白マスをnullで埋める
				expandedRow.push(...Array(Number(char)).fill(null));
			} else {
				// 通常の駒 or 成駒
				expandedRow.push(isPromoted ? `+${char}` : char);
				isPromoted = false; // 成駒フラグをリセット
			}
		}

		return expandedRow;
	});

	// 持ち駒の解析
	const hand = { b: [], w: [] };
	if (handString && handString !== "-") {
		const playerPieces = handString.match(/[0-9]*[a-zA-Z]/g) || []; // 駒とその数を抽出
		for (const piece of playerPieces) {
			const count = Number.parseInt(piece) || 1; // 数字部分がなければ1個
			const pieceType = piece.replace(/[0-9]/g, ""); // 数字を除去して駒種類を抽出
			const target = pieceType === pieceType.toUpperCase() ? "w" : "b"; // 大文字なら後手、そうでなければ先手
			for (let i = 0; i < count; i++) {
				hand[target].push(pieceType);
			}
		}
	}

	return { board, hand };
};

const parseSfen = (sfen) => {
	const [position] = sfen.split(" ");
	return position.split("/").map((row) => {
		const expandedRow = [];
		for (const char of row) {
			if (/\d/.test(char)) {
				expandedRow.push(...Array(Number(char)).fill(null));
			} else {
				expandedRow.push(char);
			}
		}
		return expandedRow;
	});
};

const generateSfen = (board, hand, turn, turnCount) => {
	const boardPart = board
		.map((row) => {
			let count = 0;
			return (
				row
					.map((cell) => {
						if (!cell) {
							count++;
							return null;
						}
						const result = count > 0 ? count + cell : cell;
						count = 0;
						return result;
					})
					.join("") + (count > 0 ? count : "")
			);
		})
		.join("/");

	const handPart = Object.entries(hand).reduce((acc, [player, pieces]) => {
		const counts = pieces.reduce((map, piece) => {
			map[piece] = (map[piece] || 0) + 1;
			return map;
		}, {});

		const sortedCounts = Object.entries(counts)
			.sort(([a], [b]) => a.localeCompare(b)) // 駒の種類をアルファベット順にソート
			.map(([piece, count]) => (count > 1 ? `${count}${piece}` : piece)) // 数が1なら駒だけ、2以上なら数+駒
			.join("");

		return acc + sortedCounts;
	}, "");

	return `${boardPart} ${turn} ${handPart || "-"} ${turnCount}`; // ターン数を追加
};

//"4k4/9/9/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL w - 1"
const initialSfen =
	"lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL w - 1";
const sfenString =
	"lnsgkg1nl/1r5s1/ppp1p2pp/3p5/5PP2/2P6/PP1PP2PP/7R1/LNSGKGSNL b bB2P w - 3";

const ShogiBoard = () => {
	const [board, setBoard] = useState(parseSfen(initialSfen));
	// const [currentSfen, setCurrentSfen] = useState(initialSfen); // SFEN を保持
	const [selectedPiece, setSelectedPiece] = useState(null);
	const [turn, setTurn] = useState("w");
	const [highlightedCells, setHighlightedCells] = useState([]);
	const [hand, setHand] = useState({ b: [], w: [] }); // 持ち駒を管理
	const [selectedHandPiece, setSelectedHandPiece] = useState(null); // 持ち駒を選択
	const [getMessage, setGetMessage] = useState("");
	const [postMessage, setPostMessage] = useState(""); // サーバから受け取る用
	const [input, setInput] = useState("");
	const [isGameOver, setIsGameOver] = useState(false);
	const [turnCount, setTurnCount] = useState(1);

	const currentSfen = useMemo(() => {
		return generateSfen(board, hand, turn === "b" ? "w" : "b", turnCount);
	}, [board, hand, turn, turnCount]);

	const sepa_turn = async (rowIndex, colIndex) => {
		if (turn === "w") {
			handleClick(rowIndex, colIndex);
		} else {
			const updatedMessage = await sendData();
			const { board: newBoard, hand: newHand } = sfenToNewBoard(updatedMessage);
			setBoard(newBoard);
			setHand(newHand); // handを更新
			setTurn(turn === "b" ? "w" : "b");
			setTurnCount((prev) => prev + 1);
		}
	};

	const sendData = async () => {
		//SFEN送信
		try {
			const response = await axios.post("http://127.0.0.1:5000/api/data", {
				currentSfen,
			});
			console.log("Response message:", response.data.response_message);
			setPostMessage(response.data.message);
			return response.data.message;
		} catch (error) {
			console.error("Error sending data:", error);
		}
	};

	const isEnemyPiece = (piece, turn) => {
		return (
			piece &&
			((turn === "b" && piece === piece.toUpperCase()) ||
				(turn === "w" && piece === piece.toLowerCase()))
		);
	};

	const isOwnPiece = (piece, turn) => {
		return (
			piece &&
			((turn === "b" && piece === piece.toLowerCase()) ||
				(turn === "w" && piece === piece.toUpperCase()))
		);
	};

	const promotePiece = (piece) => {
		if (
			["p", "l", "n", "s", "r", "b", "P", "L", "N", "S", "R", "B"].includes(
				piece,
			)
		) {
			return `+${piece}`;
		}
		return piece;
	};

	const handleClick = (row, col) => {
		if (!currentSfen.includes("K")) {
			alert("負け！！！");
			setIsGameOver(true);
		}
		if (isGameOver) return;
		if (selectedHandPiece !== null) {
			if (!board[row][col]) {
				const newBoard = board.map((r) => r.slice());
				newBoard[row][col] = selectedHandPiece.piece;
				setBoard(newBoard);

				setHand((prev) => {
					const updatedHand = { ...prev };
					updatedHand[turn] = prev[turn].filter(
						(_, index) => index !== selectedHandPiece.index,
					);

					return updatedHand;
				});

				setSelectedHandPiece(null);
				setTurn(turn === "b" ? "w" : "b");
				setTurnCount((prev) => prev + 1);
			} else {
				setSelectedHandPiece(null);
			}
			return;
		}

		const piece = board[row][col];

		if (selectedPiece) {
			const [fromRow, fromCol] = selectedPiece;
			const movable = highlightedCells.some(([r, c]) => r === row && c === col);

			if (movable) {
				const newBoard = board.map((r) => r.slice());
				const movingPiece = newBoard[fromRow][fromCol];
				const isEnemy = isEnemyPiece(piece, turn);

				if (isEnemy) {
					if (piece === "k" || piece === "K") {
						// 王または玉が取られた場合、ゲーム終了
						alert(`${turn === "b" ? "βらm" : "あなた"}の勝利です！`);
						setIsGameOver(true);
						return;
					}
					setHand((prev) => {
						const updatedHand = { ...prev };
						const originalPiece = piece.startsWith("+")
							? piece.slice(1)
							: piece; // 成駒を元の駒に戻す
						if (turn === "b") {
							updatedHand.b = [...prev.b, originalPiece.toLowerCase()];
						} else if (turn === "w") {
							updatedHand.w = [...prev.w, originalPiece.toUpperCase()];
						}
						setHand(updatedHand);
						return updatedHand;
					});
				}

				const isPromotable = [
					"p",
					"l",
					"n",
					"s",
					"r",
					"b",
					"P",
					"L",
					"N",
					"S",
					"R",
					"B",
				].includes(movingPiece);
				const enteredEnemyTerritory =
					(turn === "w" && (fromRow <= 2 || row <= 2)) ||
					(turn === "b" && (fromRow >= 6 || row >= 6));

				if (isPromotable && enteredEnemyTerritory) {
					if (window.confirm("成りますか？")) {
						newBoard[row][col] = promotePiece(movingPiece);
					} else {
						newBoard[row][col] = movingPiece;
					}
				} else {
					newBoard[row][col] = movingPiece;
				}

				newBoard[fromRow][fromCol] = null;

				setBoard(newBoard);
				setSelectedPiece(null);
				setHighlightedCells([]);
				setTurn(turn === "b" ? "w" : "b");
				setTurnCount((prev) => prev + 1);

				//setCurrentSfen(generateSfen(newBoard, hand, turn, turnCount));  // SFEN を更新
			} else {
				setSelectedPiece(null);
				setHighlightedCells([]);
				setCurrentSfen(generateSfen(board, hand, turn, turnCount));
			}
		} else if (isOwnPiece(piece, turn)) {
			setSelectedPiece([row, col]);
			setHighlightedCells(getMovableCells(row, col, piece));
			setCurrentSfen(generateSfen(board, hand, turn, turnCount));
		}
	};

	const handleHandClick = (piece, index) => {
		if (
			(turn === "b" && piece === piece.toLowerCase()) ||
			(turn === "w" && piece === piece.toUpperCase())
		) {
			setSelectedHandPiece({ piece, index });
		}
	};

	const getMovableCells = (row, col, piece) => {
		const cells = [];
		const directions = {
			p: [[1, 0]],
			P: [[-1, 0]],
			l: [[1, 0]],
			L: [[-1, 0]],
			n: [
				[2, 1],
				[2, -1],
			],
			N: [
				[-2, 1],
				[-2, -1],
			],
			s: [
				[1, 1],
				[1, -1],
				[1, 0],
			],
			S: [
				[-1, 1],
				[-1, -1],
				[-1, 0],
			],
			g: [
				[1, 0],
				[0, 1],
				[0, -1],
				[-1, 0],
				[1, 1],
				[1, -1],
			],
			G: [
				[-1, 0],
				[0, 1],
				[0, -1],
				[1, 0],
				[-1, 1],
				[-1, -1],
			],
			k: [
				[1, 0],
				[0, 1],
				[0, -1],
				[-1, 0],
				[1, 1],
				[1, -1],
				[-1, 1],
				[-1, -1],
			],
			K: [
				[1, 0],
				[0, 1],
				[0, -1],
				[-1, 0],
				[1, 1],
				[1, -1],
				[-1, 1],
				[-1, -1],
			],
			r: [
				[1, 0],
				[-1, 0],
				[0, 1],
				[0, -1],
			],
			R: [
				[1, 0],
				[-1, 0],
				[0, 1],
				[0, -1],
			],
			b: [
				[1, 1],
				[-1, -1],
				[1, -1],
				[-1, 1],
			],
			B: [
				[1, 1],
				[-1, -1],
				[1, -1],
				[-1, 1],
			],
			"+p": [
				[1, 0],
				[0, 1],
				[0, -1],
				[-1, 0],
				[1, 1],
				[1, -1],
			],
			"+P": [
				[-1, 0],
				[0, 1],
				[0, -1],
				[1, 0],
				[-1, 1],
				[-1, -1],
			],
			"+l": [
				[1, 0],
				[0, 1],
				[0, -1],
				[-1, 0],
				[1, 1],
				[1, -1],
			],
			"+L": [
				[-1, 0],
				[0, 1],
				[0, -1],
				[1, 0],
				[-1, 1],
				[-1, -1],
			],
			"+n": [
				[1, 0],
				[0, 1],
				[0, -1],
				[-1, 0],
				[1, 1],
				[1, -1],
			],
			"+N": [
				[-1, 0],
				[0, 1],
				[0, -1],
				[1, 0],
				[-1, 1],
				[-1, -1],
			],
			"+s": [
				[1, 0],
				[0, 1],
				[0, -1],
				[-1, 0],
				[1, 1],
				[1, -1],
			],
			"+S": [
				[-1, 0],
				[0, 1],
				[0, -1],
				[1, 0],
				[-1, 1],
				[-1, -1],
			],
			"+r": [
				[1, 0],
				[-1, 0],
				[0, 1],
				[0, -1],
				[1, 1],
				[-1, -1],
				[1, -1],
				[-1, 1],
			],
			"+R": [
				[1, 0],
				[-1, 0],
				[0, 1],
				[0, -1],
				[1, 1],
				[-1, -1],
				[1, -1],
				[-1, 1],
			],
			"+b": [
				[1, 1],
				[-1, -1],
				[1, -1],
				[-1, 1],
				[1, 0],
				[-1, 0],
				[0, 1],
				[0, -1],
			],
			"+B": [
				[1, 1],
				[-1, -1],
				[1, -1],
				[-1, 1],
				[1, 0],
				[-1, 0],
				[0, 1],
				[0, -1],
			],
		};

		let num = 0;
		// (directions[piece] || []).forEach(([dx, dy]) => {
		for (const [dx, dy] of directions[piece] || []) {
			num++;
			let x = row + dx;
			let y = col + dy;

			while (x >= 0 && x < 9 && y >= 0 && y < 9) {
				if (!board[x][y]) {
					cells.push([x, y]);
				} else if (isEnemyPiece(board[x][y], turn)) {
					cells.push([x, y]);
					break;
				} else {
					break;
				}
				if (["r", "R", "b", "B", "l", "L"].includes(piece)) {
					x += dx;
					y += dy;
				} else if (["+r", "+R", "+b", "+B"].includes(piece)) {
					//竜、馬用処理
					if (num < 5) {
						x += dx;
						y += dy;
					} else {
						break;
					}
				} else {
					break;
				}
			}
		}

		return cells;
	};

	return (
		<div className="cite_style">
			{/* 先手の持ち駒 */}
			<div className="container-bram">
				<p>　　　　　　　　　　　　　　　　αらm:</p>
				<div className="hand-wrapper-bram">
					{hand.b.map((piece, index) => (
						<div
							key={`b-${
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								index
							}`}
							onClick={() => handleHandClick(piece, index)}
							onKeyDown={() => handleHandClick(piece, index)}
							className={`hand-piece-bram ${
								turn === "b" ? "enabled" : "disabled"
							} ${turn === "b" && selectedHandPiece?.index === index ? "selected" : ""}`}
						>
							{pieceSymbols[piece]}
						</div>
					))}
				</div>
			</div>

			{/* 将棋盤 */}
			<div className="board">
				{board.map((row, rowIndex) =>
					row.map((piece, colIndex) => {
						const isHighlighted = highlightedCells.some(
							([r, c]) => r === rowIndex && c === colIndex,
						);
						const isSelected =
							selectedPiece &&
							selectedPiece[0] === rowIndex &&
							selectedPiece[1] === colIndex;
						const isRotated = piece && piece.toLowerCase() === piece;

						return (
							<div
								key={`${rowIndex}-${
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									colIndex
								}`}
								onClick={() => sepa_turn(rowIndex, colIndex)}
								onKeyDown={() => sepa_turn(rowIndex, colIndex)}
								className={`cell ${isHighlighted ? "highlighted" : ""} ${
									isSelected ? "selected" : ""
								} ${isRotated ? "rotated" : ""}`}
							>
								{piece ? pieceSymbols[piece] : ""}
							</div>
						);
					}),
				)}
			</div>

			{/* 後手の持ち駒 */}
			<div className="container">
				<p>あなた:</p>
				<div className="hand-wrapper">
					{hand.w.map((piece, index) => (
						<div
							key={`w-${
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								index
							}`}
							onClick={() => handleHandClick(piece, index)}
							onKeyDown={() => handleHandClick(piece, index)}
							className={`hand-piece ${
								turn === "w" ? "enabled" : "disabled"
							} ${turn === "w" && selectedHandPiece?.index === index ? "selected" : ""}`}
						>
							{pieceSymbols[piece]}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default ShogiBoard;
