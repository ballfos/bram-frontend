import { useLocalStorage } from "react-use";
import { Color } from "shogi.js";

const GameStatus = {
	PLAY: "play",
	WIN: "win",
	LOSE: "lose",
};

function useGameStatus() {
	return useLocalStorage("gameStatus", GameStatus.PLAY);
}

export default useGameStatus;
export { GameStatus };
