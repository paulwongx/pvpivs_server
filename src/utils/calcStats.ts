import { combatPower } from "./combatPower";
import { StatProduct } from "./combatPower";

interface PokemonProps {
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

interface TableRow extends StatProduct {
    rank?: number;
    per?: number
}

const calcStats = (pokemon: PokemonProps) => {
	if (pokemon === null) return false;

	let little:TableRow[] = [];
	let great:TableRow[] = [];
	let ultra:TableRow[] = [];
	let master:TableRow[] = [];

	for (let atk = 0; atk <= 15; atk++) {
		for (let def = 0; def <= 15; def++) {
			for (let hp = 0; hp <= 15; hp++) {
				for (let lvl = 51; lvl >= 0; lvl -= 0.5) {
					let stats = {
						custom: { atk, def, hp, lvl },
						base: pokemon.baseStats,
					};

					let statProd = combatPower(stats);
					if (statProd.cp <= 500) little.push(statProd);
					if (statProd.cp <= 1500) great.push(statProd);
                    else if (statProd.cp <= 2500) ultra.push(statProd);
                    else master.push(statProd);

				}
			}
		}
	}

    // Sort the values in ascending order by stat product (sp)
	little.sort((a, b) => b.sp - a.sp);
	great.sort((a, b) => b.sp - a.sp);
	ultra.sort((a, b) => b.sp - a.sp);
	master.sort((a, b) => b.sp - a.sp);

	// Add percentages for each table
	// for (let i = 0; i < little.length; i++) {
	// 	little[i]["rank"] = i + 1;
	// 	little[i]["percentage"] = (
	// 		Math.round((little[i]["sp"] / little[0]["sp"]) * 10000) / 100
	// 	).toFixed(2);
	// 	little[i]["sp"] = little[i]["sp"].toFixed(3);
	// }

	// for (let i = 0; i < greatLeague.length; i++) {
	// 	gt[i]["rank"] = i + 1;
	// 	gt[i]["percentage"] = (
	// 		Math.round((gt[i]["sp"] / gt[0]["sp"]) * 10000) / 100
	// 	).toFixed(2);
	// 	gt[i]["sp"] = gt[i]["sp"].toFixed(3);
	// }

	// for (let i = 0; i < ut.length; i++) {
	// 	ut[i]["rank"] = i + 1;
	// 	ut[i]["percentage"] = (
	// 		Math.round((ut[i]["sp"] / ut[0]["sp"]) * 10000) / 100
	// 	).toFixed(2);
	// 	ut[i]["sp"] = ut[i]["sp"].toFixed(3);
	// }

	// for (let i = 0; i < mt.length; i++) {
	// 	mt[i]["rank"] = i + 1;
	// 	mt[i]["percentage"] = (
	// 		Math.round((mt[i]["sp"] / mt[0]["sp"]) * 10000) / 100
	// 	).toFixed(2);
	// 	mt[i]["sp"] = mt[i]["sp"].toFixed(3);
	// }

	return {
		data: { lt, gt, ut, mt },
		pokemon: pokemon,
	};
};

export default calcStats;
