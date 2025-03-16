import { useLocalStorage } from "react-use";
import { Color } from "shogi.js";

const initialTrun = Color.Black;

function useTurn() {
	return useLocalStorage("turn", initialTrun);
}

export default useTurn;
