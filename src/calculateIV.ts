export const calculateIV = (props: CalculateIVProps) => {
	const {
        dex,
        speciesId,
		baseStats: base,
		floor = 0,
		maxLevel = 50,
		minLevel = 1,
		benchmark = true,
	} = props;

	let t0 = new Date().getTime();

	if (base === null || Object.keys(base).length === 0) return;
	if (dex === null || speciesId === null) return;

	let cp500: TableRow[] = [];
	let cp1500: TableRow[] = [];
	let cp2500: TableRow[] = [];
	let cpMax: TableRow[] = [];

	for (let atk = +floor; atk <= 15; atk++) {
		for (let def = +floor; def <= 15; def++) {
			for (let sta = +floor; sta <= 15; sta++) {
				let placed = {
					cp500: false,
					cp1500: false,
					cp2500: false,
					cpMax: false,
				};
				for (let lvl = maxLevel; lvl >= minLevel; lvl -= 0.5) {
					const cpmIdx = (lvl - 1) * 2;
					const mul = cpm[cpmIdx] || 0;

					const cp = Math.max(
						10,
						Math.floor(
							((base.atk + atk) *
								Math.sqrt(base.def + def) *
								Math.sqrt(base.hp + sta) *
								mul *
								mul) /
								10
						)
					);
					let aSt = (base.atk + atk) * mul; // atk stat
					let dSt = (base.def + def) * mul; // def stat
					let sSt = Math.floor((base.hp + sta) * mul); // sta stat
					let sp = Math.round(aSt * dSt * sSt); // statProd

					aSt = Math.round(aSt * 100) / 100;
					dSt = Math.round(dSt * 100) / 100;

					const prod = { cp, aSt, dSt, sSt, sp, atk, def, sta, lvl };

					if (cp <= 500) {
						// Replace the iv spread for this level if statProduct is higher
						if (placed.cp500 && sp > cp500.at(-1).sp) {
							cp500.pop();
							cp500.push(prod);
						} else if (!placed.cp500) {
							cp500.push(prod);
							placed.cp500 = true;
						}
					}

					if (cp <= 1500) {
						if (placed.cp1500 && sp > cp1500.at(-1).sp) {
							cp1500.pop();
							cp1500.push(prod);
						} else if (!placed.cp1500) {
							cp1500.push(prod);
							placed.cp1500 = true;
						}
					}

					if (cp <= 2500) {
						if (placed.cp2500 && prod.sp > cp2500.at(-1).sp) {
							cp2500.pop();
							cp2500.push(prod);
						} else if (!placed.cp2500) {
							cp2500.push(prod);
							placed.cp2500 = true;
						}
					}

					if (lvl === maxLevel) {
						if (placed.cpMax && prod.sp > cpMax.at(-1).sp) {
							cpMax.pop();
							cpMax.push(prod);
						} else if (!placed.cpMax) {
							cpMax.push(prod);
							placed.cpMax = true;
						}
					}
				}
			}
		}
	}

	let t1 = new Date().getTime();
	if (benchmark) {
		console.log(`Building time: ${t1 - t0} ms`);
	}

	// Sort the values in ascending order by stat product (sp)
	cp500.sort((a, b) => b.sp - a.sp);
	cp1500.sort((a, b) => b.sp - a.sp);
	cp2500.sort((a, b) => b.sp - a.sp);
	cpMax.sort((a, b) => b.sp - a.sp);

	// console.log("lengths", {
	// 	cp500: cp500.length,
	// 	cp1500: cp1500.length,
	// 	cp2500: cp2500.length,
	// 	cpMax: cpMax.length,
	// });

	if (benchmark) {
		const t2 = new Date().getTime();
		console.log(`Sorting time: ${t2 - t1} ms`);
	}

	return {
        pokemon: {
            dex,
            speciesId,
        },
        ivs: {
            cp500,
            cp1500,
            cp2500,
            cpMax,
        }
	};
};

// Combat Power Multiplier (CPM) is a number Niantic uses to scale the attributes of Pokemon
// Source: https://gamepress.gg/pokemongo/cp-multiplier
const cpm = [
	0.094, 0.1351374318, 0.16639787, 0.192650919, 0.21573247, 0.2365726613,
	0.25572005, 0.2735303812, 0.29024988, 0.3060573775, 0.3210876, 0.3354450362,
	0.34921268, 0.3624577511, 0.3752356, 0.387592416, 0.39956728, 0.4111935514,
	0.4225, 0.4329264091, 0.44310755, 0.4530599591, 0.4627984, 0.472336093,
	0.48168495, 0.4908558003, 0.49985844, 0.508701765, 0.51739395, 0.5259425113,
	0.5343543, 0.5426357375, 0.5507927, 0.5588305862, 0.5667545, 0.5745691333,
	0.5822789, 0.5898879072, 0.5974, 0.6048236651, 0.6121573, 0.6194041216,
	0.6265671, 0.6336491432, 0.64065295, 0.6475809666, 0.65443563, 0.6612192524,
	0.667934, 0.6745818959, 0.6811649, 0.6876849038, 0.69414365, 0.70054287,
	0.7068842, 0.7131691091, 0.7193991, 0.7255756136, 0.7317, 0.7347410093,
	0.7377695, 0.7407855938, 0.74378943, 0.7467812109, 0.74976104, 0.7527290867,
	0.7556855, 0.7586303683, 0.76156384, 0.7644860647, 0.76739717, 0.7702972656,
	0.7731865, 0.7760649616, 0.77893275, 0.7817900548, 0.784637, 0.7874736075,
	0.7903, 0.792803968, 0.79530001, 0.797800015, 0.8003, 0.802799995, 0.8053,
	0.8078, 0.81029999, 0.812799985, 0.81529999, 0.81779999, 0.82029999,
	0.82279999, 0.82529999, 0.82779999, 0.83029999, 0.83279999, 0.83529999,
	0.83779999, 0.84029999, 0.84279999, 0.84529999,
];

export interface StatProduct {
	// Attack product for the pokemon
	aSt: number;
	// Defense product for the pokemon
	dSt: number;
	// Stamina product for the pokemon
	sSt: number;
	// Combat Power of the pokemon
	cp: number;
	// Total stat product for the pokemon
	sp: number;
	// Custom stats for the pokemon
	atk: number;
	def: number;
	sta: number;
	lvl: number;
}

interface CalculateIVProps {
	baseStats: {
		atk: number;
		def: number;
		hp: number;
	};
	floor?: number;
	minLevel?: number;
	maxLevel?: number;
    dex: number;
	speciesId: string;
	benchmark?: boolean;
    verbose?: boolean;
}

interface TableRow extends StatProduct {
	rank?: number;
	per?: number;
}