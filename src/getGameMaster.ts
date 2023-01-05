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

const specialCases = {
    "mr_mime": "122",
    "mr_mime_galarian": "122-galarian",
    "ho_oh": "250",
    "mime_jr": "439",
    // "mime_jr_galarian": "439-galarian",
    "porygon_z": "474",
    "type_null": "772",
    "jangmo_o": "782",
    "hakamo_o": "783",
    "kommo_o": "784",
    "tapu_koko": "785",
    "tapu_lele": "786",
    "tapu_bulu": "787",
    "tapu_fini": "788",
    "mr_rime": "866",
    
}

export const addImageIds = (gameMaster: any) => {
    gameMaster.pokemon = gameMaster.pokemon.map((pkm: GameMasterPokemon) => {
        let imgId = ""+pkm.dex;
        if (pkm.speciesId.includes("_")) {
            if (pkm.speciesId in specialCases) {
                imgId = specialCases[pkm.speciesId];
            } else {
                const split = pkm.speciesId.split("_");
                split.shift();
                split.unshift(""+pkm.dex);
                imgId = split.join("-");
            }
        }

        const sprites = {
            front_default_id: imgId
        }

        return {...pkm, sprites};
    });
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

interface GetGameMasterProps {
	verbose?: boolean;
	save?: boolean;
};

export const getGameMaster = async ({
	save = true,
	verbose = true,
}: GetGameMasterProps | undefined) => {
	const gmRaw = await getRawGameMaster();
	const filtered = filterGameMaster(gmRaw);
    const gm = addImageIds(filtered);
	if (!shouldSave(gm)) {
		if (verbose) {
			console.log(
				`Did not save. GameMaster still has ${gm.pokemon.length} pokemon`
			);
		}
	}
	if (save) {
		fs.writeFileSync(
			path.join(process.cwd(), "src", "data", "gameMaster.json"),
			JSON.stringify(gm)
		);
        fs.writeFileSync(
			path.join(process.cwd(), "src", "data", "pokemon.json"),
			JSON.stringify(gm.pokemon)
		);
        if (verbose) console.log("Finished downloading gameMaster.json");
	}
	return gm;
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
