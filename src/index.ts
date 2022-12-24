import { getGameMaster, shouldSave } from "./getGameMaster";
import { getPopular } from "./getPopular";
import { getIVs, getSummary } from "./getIVs";

// ts-node ./src/index.ts
const downloadPopular = async () => {
	return await getPopular({});
};

const downloadGameMaster = async () => {
	return await getGameMaster({});
};

const generateIVs = async (gameMaster: any) => {
	await getIVs({ gameMaster, save: true, verbose: true });
	await getSummary({ save: true });
};

(async () => {
	const gm = await downloadGameMaster();
	await downloadPopular();
	// await generateIVs(gm);
})();
