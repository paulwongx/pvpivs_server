import { GameMasterPokemonProps, statProduct } from "./statProduct";
import { writeFile } from "./writeFile";
import gameMaster from "./gameMaster.json";

// ts-node ./src/getMultiIVs.ts
const getMultiIVs = async (pokemon: GameMasterPokemonProps) => {
	const json = statProduct({
		baseStats: pokemon.baseStats,
		dex: pokemon.dex,
	});
	await writeFile("bulbasaur.json", json);
	return json;
};

(async () => {
	let pokemon = gameMaster.pokemon as GameMasterPokemonProps[];
	// const bulbasaur = pokemon?.[0] as GameMasterPokemonProps;

    pokemon = pokemon.filter(pkm => !(new RegExp("shadow")).test(pkm.speciesId));
    const n = pokemon.length;
    console.log({n})
	// await getIVs(bulbasaur);
})();
