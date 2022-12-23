import { statProduct } from "./statProduct";
import gameMaster from "./data/gameMaster.json";
import * as fs from "fs";
import path from "path";
import { GameMasterPokemon } from "./getGameMaster";

// ts-node ./src/getMultiIVs.ts
const getMultiIVs = async (pokemon: GameMasterPokemon) => {
    new Promise(async (resolve, reject) => {
        const json = statProduct({
            baseStats: pokemon.baseStats,
            dex: pokemon.dex,
            speciesId: pokemon.speciesId,
            benchmark: false,
            verbose: true,
        });
        fs.writeFileSync(path.join(__dirname, "data", `${pokemon.dex}_${pokemon.speciesId}.json`), JSON.stringify(json));
        console.log(`Finished with #${pokemon.dex} ${pokemon.speciesId}`);
        resolve(json);
    });
};

const getSummary = async () => {
    // Read all files in the data directory and return an array of the file names
    const files = fs.readdirSync(path.join(__dirname, "data"));

    let summary = [];
    // Create an array of promises to read each file
    for await (let file of files) {
        const raw = fs.readFileSync(path.join(__dirname, "data", file), "utf8");
        const json = JSON.parse(raw.toString());

        const pkmn = {
            speciesId: json.pokemon.speciesId,
            dex: json.pokemon.dex,
            cp500: json.ivs.cp500[0],
            cp1500: json.ivs.cp1500[0],
            cp2500: json.ivs.cp2500[0],
            cpMax: json.ivs.cpMax[0],
        }

        summary.push(pkmn);
    }

    fs.writeFileSync(path.join(__dirname, "summary.json"), JSON.stringify(summary));

    return summary;

}


(async () => {
	let pokemon = gameMaster.pokemon as GameMasterPokemon[];

    for (let i=0; i<pokemon.length; i++) {
        const pkmn = pokemon[i] as GameMasterPokemon;
        await getMultiIVs(pkmn);
    }

    await getSummary();
})();
