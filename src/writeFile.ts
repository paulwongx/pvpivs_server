import path from "path";
import * as fs from "fs/promises";

interface CreateFileProps {
	name: string;
	json: any;
}

export const writeFile = async (name: string, json: any) => {
	const filename = path.extname(name) === ".json" ? name : name + ".json";

	return await fs.writeFile(
		path.join(__dirname, "data", filename),
		JSON.stringify(json)
	);
};