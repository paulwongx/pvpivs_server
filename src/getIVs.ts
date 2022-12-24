import fs from "fs";
import path from "path";
import { calculateIV } from "./calculateIV";
import { GameMasterPokemon } from "./getGameMaster";

interface GetIVProps {
	pokemon: GameMasterPokemon;
	save?: boolean;
	verbose?: boolean;
}
// ts-node ./src/getMultiIVs.ts
const getIV = async (props: GetIVProps) => {
	const { pokemon, save, verbose } = props;
	new Promise(async (resolve, reject) => {
		const json = calculateIV({
			baseStats: pokemon.baseStats,
			dex: pokemon.dex,
			speciesId: pokemon.speciesId,
			benchmark: false,
			verbose: true,
		});

		if (save) {
			fs.writeFileSync(
				path.join(
					process.cwd(),
					"src",
					"data",
					"ivs",
					`${pokemon.dex}_${pokemon.speciesId}.json`
				),
				JSON.stringify(json)
			);
		}

		if (verbose) {
			console.log(`Finished with #${pokemon.dex} ${pokemon.speciesId}`);
		}
		resolve(json);
	});
};

interface GetIVsProps {
	gameMaster: any;
	save?: boolean;
	verbose?: boolean;
}

export const getIVs = async ({
	gameMaster,
	save = true,
	verbose = true,
}: GetIVsProps) => {
	let mons = gameMaster.pokemon as GameMasterPokemon[];

	for (let i = 0; i < mons.length; i++) {
		const pokemon = mons[i] as GameMasterPokemon;
		await getIV({ pokemon, save, verbose });
	}
};

interface AppendIVsProps {
	gameMaster: any;
	save?: boolean;
	verbose?: boolean;
}

export const getNewIVs = async ({
	gameMaster,
	save = true,
	verbose = true,
}: AppendIVsProps) => {
    let mons = gameMaster.pokemon as GameMasterPokemon[];

    const ivsPath = path.join(process.cwd(), "src", "data", "ivs");
    const files = fs.readdirSync(ivsPath);

    if (mons.length === files.length) {
        if (verbose) console.log("All IVs already generated.");
        return;
    }

    // rename the array of files to just be the speciesId
    for (let i = 0; i < files.length; i++) {
        const filename = files[i];
        const idx = filename.indexOf("_");
        const speciesId = filename.slice(idx + 1);
        files[i] = speciesId;
    }

    for (let i = 0; i < mons.length; i++) {
        const pokemon = mons[i] as GameMasterPokemon;
        if (!files.includes(pokemon.speciesId)) {
            if (verbose) console.log(`Generating **NEW**  IVs for ${pokemon.speciesId}`);
            await getIV({ pokemon, save, verbose });
        }
    }
};

interface GetSummaryProps {
	save?: boolean;
}

export const getSummary = async ({ save = true }: GetSummaryProps) => {
	const files = fs.readdirSync(
		path.join(process.cwd(), "src", "data", "ivs")
	);

	let summary = [];
	for await (let file of files) {
		const raw = fs.readFileSync(
			path.join(process.cwd(), "src", "data", "ivs", file),
			"utf8"
		);
		const json = JSON.parse(raw.toString());

		const pkmn = {
			speciesId: json.pokemon.speciesId,
			dex: json.pokemon.dex,
			cp500: json.ivs.cp500[0],
			cp1500: json.ivs.cp1500[0],
			cp2500: json.ivs.cp2500[0],
			cpMax: json.ivs.cpMax[0],
		};

		summary.push(pkmn);
	}

	if (save) {
		fs.writeFileSync(
			path.join(process.cwd(), "src", "data", "summary.json"),
			JSON.stringify(summary)
		);
	}

	return summary;
};
