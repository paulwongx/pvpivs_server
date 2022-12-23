import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { getGameMaster } from "./getGameMaster";
import type { GameMasterPokemon } from "./getGameMaster";

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

	return json;
};


const mapNameToSpeciesId = async (popular: PopularPokemon[]) => {
    const gameMaster = await getGameMaster();
	const pokemon = gameMaster.pokemon as GameMasterPokemon[];

    const nameMapping = {
        "Giratina (Altered Forme)": "giratina_altered",
        "Giratina (Origin Forme)": "giratina_origin",
        "Galarian Darmanitan": "darmanitan_galarian_standard",
    }

	let mapped = [];
	for (let i = 0; i < popular.length; i++) {
		const dex = popular[i].dex;
		const name = popular[i].name;

        if (/shadow/ig.test(name)) continue;

		let gmPokemon = pokemon.filter(pkm => pkm.dex === dex);
		if (gmPokemon.length === 1) {
			mapped.push(gmPokemon[0]);
		} else if (nameMapping[name]) {
            gmPokemon = pokemon.filter(pkm => pkm.speciesId === nameMapping[name]);
            mapped.push(gmPokemon[0]);
        } else if (gmPokemon.length > 1) {
			let encoded = name.replace(/[.*+?^${}()|[\]\\]/g, "");
			let encoded1 = encoded
				.trim()
				.split(/[\s-]+/)
				.join("_");
			let encoded2 = encoded
				.trim()
				.split(/[\s-]+/)
				.reverse()
				.join("_");

			const regex1 = new RegExp(`^${encoded1}$`, "ig");
			const regex2 = new RegExp(`^${encoded2}$`, "ig");

			let sel = [];
			sel = gmPokemon.filter(p => regex1.test(p.speciesId));
			if (sel.length === 0) {
				sel = gmPokemon.filter(p => regex2.test(p.speciesId));
			}
			if (sel.length === 1) {
				mapped.push(sel[0]);
			} else {
				console.log(
					`Could not map the following pokemon to speciesId: ${JSON.stringify({
						dex,
						name,
						sel,
					},null,4)}`
				);
			}
		}
	}

	return mapped;
};

export const getPopular = async () => {
	const raw = await scrapePopular();
	if (!raw || raw.length === 0) return;

	const pokemon = await mapNameToSpeciesId(raw);
	console.log(`There are ${pokemon.length} popular Pokemon processed`);
	return {date: new Date(), pokemon};
};
