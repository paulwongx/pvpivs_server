import path from "path";
import fetch from "node-fetch";
// import got from "got";
// import ky from 'ky-universal';
import * as cheerio from "cheerio";
import * as fs from "fs/promises";

interface Pokemon {
	dex: number | null;
	name: string;
}

const getPopular = async () => {
	const url = "https://www.gamepress.gg/pokemongo/popular-pokemon-all";
	const response = await fetch(url);
    const body = await response.text();
	const $ = cheerio.load(body);
	const re = /\/pokemongo\/pokemon\/(.*)/;

	let res: Pokemon[] = [];

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

	const file = {
        date: new Date(),
        pokemon: json
    }

    await createFile(file);
    return file;
};

const createFile = async (json: any) => {
	return await fs.writeFile(
		path.join(__dirname, "popular.json"),
		JSON.stringify(json)
	);
};

(async () => {
	const res = await getPopular();
    console.log(res);
})();
