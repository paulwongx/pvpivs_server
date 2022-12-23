import fs from "fs";
import fetch from "node-fetch";
import path from "path";

export const getRawGameMaster = async () => {
	const url =
		"https://raw.githubusercontent.com/pvpoke/pvpoke/master/src/data/gamemaster.json";
	const response = await fetch(url);
	const gameMaster = await response.json();
	return gameMaster;
};

export const filterGameMaster = (gameMaster: any) => {
	if (!gameMaster?.pokemon) return;
	const filteredGameMaster = gameMaster.pokemon.filter(pkm => {
		const regexShadow = /shadow/;
		const pikachuVariants = [
			"pikachu_5th_anniversary",
			"pikachu_flying",
			"pikachu_kariyushi",
			"pikachu_libre",
			"pikachu_pop_star",
			"pikachu_rock_star",
			"pikachu_shaymin",
		];
		if (new RegExp(regexShadow).test(pkm.speciesId)) return false;
		if (pikachuVariants.includes(pkm.speciesId)) return false;
		return true;
	});
	gameMaster.pokemon = filteredGameMaster;
	return gameMaster;
};

export const shouldSave = (newGm: any) => {
	const oldGmPath = path.join(
		process.cwd(),
		"src",
		"data",
		"gameMaster.json"
	);
	if (fs.existsSync(oldGmPath) === false) return true;
	const raw = fs.readFileSync(oldGmPath, "utf-8");
	const oldGm = JSON.parse(raw);
	const numInOldGm = oldGm.pokemon.length;
	const numInNewGm = newGm.pokemon.length;
	return numInOldGm !== numInNewGm;
};

export const getGameMaster = async () => {
	const gameMaster = await getRawGameMaster();
	const filtered = filterGameMaster(gameMaster);
	return filtered;
};

export interface GameMasterPokemon {
	dex: number;
	speciesName: string;
	speciesId: string;
	baseStats: {
		atk: number;
		def: number;
		hp: number;
	};
	types: string[];
	fastMoves: string[];
	chargedMoves: string[];
	tags: string[];
	defaultIVs: {
		cp500: number[];
		cp1500: number[];
		cp2500: number[];
	};
	level25CP: number;
	buddyDistance: number;
	thirdMoveCost: number;
	released: boolean;
	family: {
		id: string;
		evolutions: string[];
	};
}
