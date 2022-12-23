import fsp from "fs/promises";
import fs from "fs";
import { getGameMaster, shouldSave } from "./getGameMaster";
import { getPopular } from "./getPopular";
import path from "path";

// ts-node ./src/index.ts
const downloadPopular = async () => {
	const data = await getPopular();
	if (!data || data.pokemon.length === 0) return;
	await fsp.writeFile(
		path.join(process.cwd(), "src", "data", "popular.json"),
		JSON.stringify(data)
	);
	console.log("Finished downloading popular.json");
};

const downloadGameMaster = async () => {
	const gameMaster = await getGameMaster();
	if (!gameMaster || gameMaster.pokemon.length === 0) return;
	if (!shouldSave(gameMaster)) {
		return console.log(
			`Did not save. GameMaster still has ${gameMaster.pokemon.length} pokemon`
		);
	}
	await fsp.writeFile(
		path.join(process.cwd(), "src", "data", "gameMaster.json"),
		JSON.stringify(gameMaster)
	);
	console.log("Finished downloading gameMaster.json");
};

(async () => {
	await downloadGameMaster();
	await downloadPopular();
})();
