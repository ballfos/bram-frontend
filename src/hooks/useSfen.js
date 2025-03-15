import { useLocalStorage } from "react-use";

const initialSfen =
	"lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1";

function useSfen() {
	const [sfen, setSfen] = useLocalStorage("sfen", initialSfen);
	const resetSfen = () => setSfen(initialSfen);
	return [sfen, setSfen, resetSfen];
}

export default useSfen;
