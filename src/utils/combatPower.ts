interface BaseStats {
	atk: number;
	def: number;
	hp: number;
}

interface CustomStats extends BaseStats {
	lvl: number;
}

interface CPProps {
	base: BaseStats;
	custom: CustomStats;
}

export interface StatProduct {
    // Attack product for the pokemon
    atk: number;
    // Defense product for the pokemon
    def: number;
    // Stamina product for the pokemon
    sta: number;
    // Combat Power of the pokemon
    cp: number;
    // Total stat product for the pokemon
    sp: number;
    // Custom stats for the pokemon
    custom: {
        atk: number;
        def: number;
        hp: number;
        lvl: number;
    }
}

// Calculates the Combat Power (CP) for the pokmeon with these specific ivs
export const combatPower = (stats: CPProps): TableRow => {
	const { base, custom } = stats;

	const cpmIdx = custom.lvl * 2 - 1;

	// Combat Power Multiplier (CPM) is a number Niantic uses to scale the attributes of Pokemon
	// Source: https://gamepress.gg/pokemongo/cp-multiplier
	const cpm = [
		0.094, 0.1351374318, 0.16639787, 0.192650919, 0.21573247, 0.2365726613,
		0.25572005, 0.2735303812, 0.29024988, 0.3060573775, 0.3210876,
		0.3354450362, 0.34921268, 0.3624577511, 0.3752356, 0.387592416,
		0.39956728, 0.4111935514, 0.4225, 0.4329264091, 0.44310755,
		0.4530599591, 0.4627984, 0.472336093, 0.48168495, 0.4908558003,
		0.49985844, 0.508701765, 0.51739395, 0.5259425113, 0.5343543,
		0.5426357375, 0.5507927, 0.5588305862, 0.5667545, 0.5745691333,
		0.5822789, 0.5898879072, 0.5974, 0.6048236651, 0.6121573, 0.6194041216,
		0.6265671, 0.6336491432, 0.64065295, 0.6475809666, 0.65443563,
		0.6612192524, 0.667934, 0.6745818959, 0.6811649, 0.6876849038,
		0.69414365, 0.70054287, 0.7068842, 0.7131691091, 0.7193991,
		0.7255756136, 0.7317, 0.7347410093, 0.7377695, 0.7407855938, 0.74378943,
		0.7467812109, 0.74976104, 0.7527290867, 0.7556855, 0.7586303683,
		0.76156384, 0.7644860647, 0.76739717, 0.7702972656, 0.7731865,
		0.7760649616, 0.77893275, 0.7817900548, 0.784637, 0.7874736075, 0.7903,
		0.792803968, 0.79530001, 0.797800015, 0.8003, 0.802799995, 0.8053,
		0.8078, 0.81029999, 0.812799985, 0.81529999, 0.81779999, 0.82029999,
		0.82279999, 0.82529999, 0.82779999, 0.83029999, 0.83279999, 0.83529999,
		0.83779999, 0.84029999, 0.84279999, 0.84529999,
	];

	// Calculate atk, def, hp stat products
	const mul = cpm[cpmIdx] || 0;
	let atk = (base.atk + custom.atk) * mul;
	let def = (base.def + custom.def) * mul;
	let hp = (base.hp + custom.hp) * mul;

	let cp = Math.max(Math.floor((atk * def ** 0.5 * hp ** 0.5) / 10), 10);

	hp = Math.floor(hp);
	let sp = Number(Math.round(atk * def * hp) / 1000).toFixed(3);

	atk = Number((Math.round(atk * 100) / 100).toFixed(2));
	def = Number((Math.round(def * 100) / 100).toFixed(2));

	return { cp, atk, def, hp, sp, custom };
};
