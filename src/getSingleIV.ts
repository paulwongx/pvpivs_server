import { GameMasterPokemonProps, statProduct } from "./statProduct";
import { writeFile } from "./writeFile";
import gameMaster from "./gameMaster.json";

// ts-node ./src/getSingleIV.ts
const getIVs = async (pokemon: GameMasterPokemonProps) => {
	const json = statProduct({
		baseStats: pokemon.baseStats
	});

    // console.log("best", {
    //     little: json?.data.little[0],
    //     great: json?.data.great[0],
    //     ultra: json?.data.ultra[0],
    //     master: json?.data.master[0],
    // });

	await writeFile(pokemon.speciesId, json);
	return json;
};

(async () => {
	const pokemon = gameMaster.pokemon as GameMasterPokemonProps[];
	const venusaur = pokemon?.[4] as GameMasterPokemonProps;
	await getIVs(venusaur);
})();
