import path from "path";
import { GameMasterPokemonProps, statProduct } from "./statProduct";
import fsp from "fs/promises";
import gameMaster from "./data/gameMaster.json";

// ts-node ./src/getSingleIV.ts
const getIVs = async (pokemon: GameMasterPokemonProps) => {
    const json = statProduct({
        baseStats: pokemon.baseStats,
        dex: pokemon.dex,
        speciesId: pokemon.speciesId,
        benchmark: false,
        verbose: true,
    });

	// console.log("best", {
	//     little: json?.data.little[0],
	//     great: json?.data.great[0],
	//     ultra: json?.data.ultra[0],
	//     master: json?.data.master[0],
	// });

	await fsp.writeFile(
		path.join(__dirname, "data", `${pokemon.speciesId}.json`),
		JSON.stringify(json)
	);
	return json;
};

(async () => {
	const pokemon = gameMaster.pokemon as GameMasterPokemonProps[];
	const venusaur = pokemon?.[4] as GameMasterPokemonProps;
	await getIVs(venusaur);
})();
