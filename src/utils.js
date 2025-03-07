export function removeFirstMatch(arr, value) {
	const index = arr.indexOf(value);
	if (index === -1) {
		return arr;
	}
	return [...arr.slice(0, index), ...arr.slice(index + 1)];
}
