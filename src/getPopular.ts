import fsp from "fs/promises";
import fs from "fs";
import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { getGameMaster } from "./getGameMaster";
import type { Pokemon } from "./getGameMaster";
import path from "path";
import stringSimilarity from "string-similarity";
import { getSummary } from "./getIVs";

interface PopularPokemon {
	dex: number | null;
	// The name used by GamePress
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
	const raw = fs.readFileSync(
		path.join(process.cwd(), "src", "data", "rank1Summary.json"),
		"utf-8"
	);
	let rank1Summary = JSON.parse(raw);
	if (!rank1Summary) {
		rank1Summary = await getSummary({ save: false });
	}

	const specialCases = {
		"Galarian Darmanitan": "darmanitan_galarian_standard",
		Darmanitan: "darmanitan_standard",
	};

	popular = popular.filter(pkm => !/shadow/gi.test(pkm.name));

	const res = new Set();

	for (let pop of popular) {
		const { dex, name } = pop;
		let filteredPkm = rank1Summary.filter(pkm => pkm.dex === dex);
		if (filteredPkm.length === 1) {
			res.add(filteredPkm[0]);
			continue;
		}
		if (filteredPkm.length > 1) {
			if (specialCases[name]) {
				res.add(
					filteredPkm.find(
						pkm => pkm.speciesId === specialCases[name]
					)
				);
				continue;
			}

			let gmNames = filteredPkm.map(pkm => pkm.speciesName);
			const best = stringSimilarity.findBestMatch(name, gmNames);
			// console.log("Fuzzy matched", {name, best: filteredPkm[best.bestMatchIndex].speciesId});
			if (best) {
				res.add(filteredPkm[best.bestMatchIndex]);
				continue;
			}
		}
		console.log("No pokemon found for", name);
	}
	return Array.from(res);
};

interface GetPopularProps {
	save?: boolean;
	verbose?: boolean;
}

export const getPopular = async ({
	save = true,
	verbose = true,
}: GetPopularProps) => {
	const raw = await scrapePopular();
	if (!raw || raw.length === 0) return;

	const pokemon = await mapNameToSpeciesId(raw);
	const popular = { date: new Date(), pokemon };

	if (save) {
		await fsp.writeFile(
			path.join(process.cwd(), "src", "data", "popular.json"),
			JSON.stringify(popular)
		);
		if (verbose) console.log("Finished downloading popular.json");
	}
};
