import fsp from 'fs/promises';
import { getGameMaster } from "./getGameMaster";
import { getPopular } from "./getPopular";
import path from 'path';

// ts-node ./src/index.ts
const downloadPopular = async () => {
    const data = await getPopular();
    if (!data || data.pokemon.length === 0) return;
    await fsp.writeFile(
		path.join(process.cwd(), "src", "data", "popular.json"),
		JSON.stringify(data)
	);
    console.log("Finished downloading popular.json");
}

const downloadGameMaster = async () => {
    const gameMaster = await getGameMaster();
    await fsp.writeFile(
		path.join(process.cwd(), "src", "data", "gameMaster.json"),
		JSON.stringify(gameMaster)
	);
	console.log("Finished downloading gameMaster.json");
};

(async () => {
    // await downloadGameMaster();
    await downloadPopular();
})();