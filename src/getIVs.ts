import fs from "fs";
import path from "path";
import { calculateIV } from "./calculateIV";
import { Pokemon } from "./getGameMaster";

interface GetIVProps {
	pokemon: Pokemon;
	save?: boolean;
	verbose?: boolean;
}
// ts-node ./src/getMultiIVs.ts
const getIV = async (props: GetIVProps) => {
	const { pokemon, save, verbose } = props;
	new Promise(async (resolve, reject) => {
		const ivs = calculateIV({
			baseStats: pokemon.baseStats,
			dex: pokemon.dex,
			speciesId: pokemon.speciesId,
			benchmark: false,
			verbose: true,
		});
        const pokemonWithIVs = {...pokemon, ivs};

		if (save) {
			fs.writeFileSync(
				path.join(
					process.cwd(),
					"src",
					"data",
					"ivs",
					`${pokemon.speciesId}.json`
				),
				JSON.stringify(pokemonWithIVs)
			);
		}

		if (verbose) {
			console.log(`Finished with #${pokemon.dex} ${pokemon.speciesId}`);
		}
		resolve(pokemonWithIVs);
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
	let mons = gameMaster.pokemon as Pokemon[];

	for (let i = 0; i < mons.length; i++) {
		const pokemon = mons[i] as Pokemon;
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
    let mons = gameMaster.pokemon as Pokemon[];

    const ivsPath = path.join(process.cwd(), "src", "data", "ivs");
    if (!fs.existsSync(ivsPath)) {
        fs.mkdirSync(ivsPath);
    }
    const files = fs.readdirSync(ivsPath);

    if (mons.length === files.length) {
        if (verbose) console.log(`All ${mons.length} IVs already generated.`);
        return;
    }

    for (let i = 0; i < mons.length; i++) {
        const pokemon = mons[i] as Pokemon;
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
			...json,
			ivs: {
                cp500: [json.ivs.cp500[0]],
                cp1500: [json.ivs.cp1500[0]],
                cp2500: [json.ivs.cp2500[0]],
                cpMax: [json.ivs.cpMax[0]],
            }
		};

		summary.push(pkmn);
	}

	if (save) {
		fs.writeFileSync(
			path.join(process.cwd(), "src", "data", "rank1Summary.json"),
			JSON.stringify(summary)
		);
	}

	return summary;
};
