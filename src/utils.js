import { Shogi } from "shogi.js";

export function shogiFromSfen(sfen) {
	const shogi = new Shogi();
	shogi.initializeFromSFENString(sfen);
	return shogi;
}
