// @flow
import { generateFilledArray } from "@grail/lib/utils/array-utils";
import startCase from "lodash/startCase";
import camelCase from "lodash/camelCase";

// Map of sentence case key words to their desired display string.
const KEYWORDS: Map<string, string> = new Map([
	["Ngs", "NGS"],
	["Npc", "NPC"],
	["Qpcr", "qPCR"],
	["Ml", "mL"],
	["Ul", "µL"],
	["Pl", "pL"],
	["Lims", "LIMS"],
	["Grail", "GRAIL"],
]);

export const sentenceCase = (string: string) => {
	string = string || "";
	const sentenceCased = startCase(camelCase(string.trim()));
	const separator = " ";
	return sentenceCased
		.split(separator)
		.map(word => KEYWORDS.get(word) || word)
		.join(separator);
};

const charCodeOfA = "A".charCodeAt(0);

export const upperAlphaChars = generateFilledArray(26, (_, index) => String.fromCharCode(charCodeOfA + index));

export const normalizeStr = (str: ?string) => {
	if (!str) {
		return "";
	}
	return str
		.replace(/[_^\W+]/g, " ")
		.trim()
		.toLowerCase();
};

// replaces underscores, capitalizes letters after underscore, adds space before camelCasing
// my_coolString -> My Cool String
export const makeTitleString = (str: string, capFirst: boolean = true) => {
	return str
		.replace(/([a-z])([A-Z])([a-z])/g, "$1 $2$3") // space around camels
		.replace(/_(.)/g, $1 => ` ${$1.toUpperCase()}`) // uppercase after underscore
		.replace(/_/g, " ") // underscore to space
		.replace(/^(.)/, $1 => (capFirst ? $1.toUpperCase() : $1)) // capitalize the first letter (if specified)
		.replace("  ", " "); // remove double spaces introduced
};
