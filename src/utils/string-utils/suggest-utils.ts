import fuzzy from "fuzzy";
import { isQuotedString, unquoteString } from "./string-util";

export const valueToSuggestions = (
  value: string,
  choices: string[],
): string[] => {
  if (isQuotedString(value)) {
    value = unquoteString(value);
    return choices.filter(choice => choice === value);
  }
  const fuzzyMatches = fuzzy.filter(value.trim(), choices);
  return fuzzyMatches.map(match => match.string);
};

export const valuesToSuggestions = (
  values: string[],
  choices: string[],
): string[] => {
  const uniqueSuggestions: Set<string> = new Set();
  values
    .map(value => valueToSuggestions(value, choices))
    .forEach(suggestions =>
      suggestions.forEach(suggestion => uniqueSuggestions.add(suggestion)),
    );
  return [...uniqueSuggestions];
};
