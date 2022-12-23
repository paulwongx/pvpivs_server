import fetch from "node-fetch";
import fsp from "fs/promises";
import { GameMasterPokemonProps } from "./statProduct";
import path from "path";

const getGameMaster = async () => {
	const url =
		"https://raw.githubusercontent.com/pvpoke/pvpoke/master/src/data/gamemaster.json";
	const response = await fetch(url);
	const gameMaster = await response.json();

	let pokemon = gameMaster.pokemon as GameMasterPokemonProps[];

	// Remove the following:
	// Shadow pokemon
	// pikachu variants
	pokemon = pokemon.filter(pkm => {
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
		// const regexPikachu = //;
		if (new RegExp(regexShadow).test(pkm.speciesId)) return false;
		if (pikachuVariants.includes(pkm.speciesId)) return false;
		return true;
	});

	await fsp.writeFile(
		path.join(__dirname, "data", "gameMaster.json"),
		JSON.stringify(gameMaster)
	);
	return gameMaster;
};

(async () => {
	const res = await getGameMaster();
	console.log(res);
})();
