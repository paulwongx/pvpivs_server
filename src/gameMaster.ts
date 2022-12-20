import fetch from "node-fetch";
import { writeFile } from "./writeFile";

const getGameMaster = async () => {
	const url =
		"https://raw.githubusercontent.com/pvpoke/pvpoke/master/src/data/gamemaster.json";
	const response = await fetch(url);
	const data = await response.json();
	await writeFile("gameMaster", data);
	return data;
};

(async () => {
	const res = await getGameMaster();
	console.log(res);
})();
