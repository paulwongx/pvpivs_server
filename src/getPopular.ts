import fsp from 'fs/promises';
import fs from "fs";
import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { getGameMaster } from "./getGameMaster";
import type { GameMasterPokemon } from "./getGameMaster";
import path from 'path';
import stringSimilarity from 'string-similarity';

interface PopularPokemon {
	dex: number | null;
	name: string;
}

// ts-node ./src/getPopular.ts
export const scrapePopular = async () => {
	const url = "https://www.gamepress.gg/pokemongo/popular-pokemon-all";
	const raw = await fetch(url);
	const body = await raw.text();
	const $ = cheerio.load(body);
	const re = /\/pokemongo\/pokemon\/(.*)/;

	let res: PopularPokemon[] = [];

	$(".view-id-popular_pages")
		.find(".view-content li a")
		.each((i, el) => {
			if (i < 100) {
				const rawDex = $(el).attr("href")?.match(re)?.[1];
				const dex = rawDex ? parseInt(rawDex) : null;

				const name = $(el)
					.find(".pages-ranking-title")
					.text()
					.replace(/\n/g, "");

				res.push({ dex, name });
			}
		});
	const json = res.filter(x => x.dex !== null);
    // console.log({json});

	return json;
};

const mapNameToSpeciesId = async (popular: PopularPokemon[]) => {
    const localRawGm = fs.readFileSync(path.join(process.cwd(), "src", "data", "gameMaster.json"), "utf-8");
    let gameMaster = JSON.parse(localRawGm);
    if (!gameMaster) {
        gameMaster = await getGameMaster({save:false});
    }

	const pokemon = gameMaster.pokemon as GameMasterPokemon[];

    const specialCases = {
        "Galarian Darmanitan": "darmanitan_galarian_standard",
        "Darmanitan": "darmanitan_standard",
    }

    popular = popular.filter(pkm => !/shadow/ig.test(pkm.name));

    const popularGm = new Set();

    for (let pop of popular) {
        const {dex, name} = pop;
        let filteredPkm = pokemon.filter(pkm => pkm.dex === dex);
        if (filteredPkm.length === 1) {
            popularGm.add(filteredPkm[0]);
            continue;
        }
        if (filteredPkm.length > 1) {
            if (specialCases[name]) {
                popularGm.add(filteredPkm.find(pkm => pkm.speciesId === specialCases[name]));
                continue;
            }

            let gmNames = filteredPkm.map(pkm => pkm.speciesName);
            const best = stringSimilarity.findBestMatch(name, gmNames);
            // console.log("Fuzzy matched", {name, best: filteredPkm[best.bestMatchIndex].speciesId});
            if (best) {
                popularGm.add(filteredPkm[best.bestMatchIndex]);
                continue;
            }
        }
        console.log("No pokemon found for", name);
    }
	return Array.from(popularGm);
};

interface GetPopularProps {
    save?: boolean;
    verbose?: boolean;
}

export const getPopular = async ({save = true, verbose = true}: GetPopularProps) => {
	const raw = await scrapePopular();
	if (!raw || raw.length === 0) return;

	const pokemon = await mapNameToSpeciesId(raw);
    const popular = {date: new Date(), pokemon};

    if (save) {
        await fsp.writeFile(
            path.join(process.cwd(), "src", "data", "popular.json"),
            JSON.stringify(popular)
        );
        if (verbose) console.log("Finished downloading popular.json");
    }
};
