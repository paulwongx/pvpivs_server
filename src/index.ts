import { GameMaster, getGameMaster } from "./getGameMaster";
import { getPopular } from "./getPopular";
import { getNewIVs, getSummary } from "./getIVs";

// ts-node ./src/index.ts
const downloadPopular = async () => {
	return await getPopular({});
};

const downloadGameMaster = async () => {
	return await getGameMaster({});
};

const generateIVs = async (gameMaster: GameMaster) => {
	await getNewIVs({ gameMaster, save: true, verbose: true });
	await getSummary({ save: true });
};

(async () => {
	const gm = await downloadGameMaster();
	await generateIVs(gm);
	await downloadPopular();
    return;
})();
