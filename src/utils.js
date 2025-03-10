import { Shogi } from "shogi.js";

export function removeFirstMatch(arr, value) {
	const index = arr.indexOf(value);
	if (index === -1) {
		return arr;
	}
	return [...arr.slice(0, index), ...arr.slice(index + 1)];
}

export function cloneShogi(shogi) {
	const clone = new Shogi();
	clone.initializeFromSFENString(shogi.toSFENString());
	return clone;
}
