import { valueToSuggestions, valuesToSuggestions } from "./suggest-utils";

const choices = [
  "abc",
  "SOme crystal math here",
  "lowerCamelCase math UpperCamelCase",
  "123",
];

const unquotedValueTests = [
  // Empty string must return all choices.
  { value: "", suggestions: choices },
  { value: "   ", suggestions: choices },
  { value: "abc", suggestions: [choices[0]] },
  { value: "ath", suggestions: [choices[1], choices[2]] },
  { value: "  math ", suggestions: [choices[1], choices[2]] },
  { value: "CRYSTAL", suggestions: [choices[1]] },
  { value: "No possible match", suggestions: [] },
  { value: "1", suggestions: [choices[3]] },
];

const quotedValueTests = [
  // Empty string must return all choices.
  { value: '" abc"', suggestions: [] },
  { value: '"abc"', suggestions: [choices[0]] },
  { value: '"pm"', suggestions: [] },
  { value: '"  test m"', suggestions: [] },
  { value: '"CRYSTAL"', suggestions: [] },
  { value: '"No possible match"', suggestions: [] },
  { value: '"1"', suggestions: [] },
];
const quotedChoiceTests = choices.map((choice) => ({
  value: `"${choice}"`,
  suggestions: [choice],
}));

const valueTests = [
  ...unquotedValueTests,
  ...quotedValueTests,
  ...quotedChoiceTests,
];

describe("valueToSuggestions", () => {
  valueTests.forEach((test) => {
    const { value, suggestions } = test;
    it(`with "${value}" it finds suggestions: "${suggestions.toString()}"`, () => {
      expect(valueToSuggestions(value, choices)).toEqual(suggestions);
    });
  });
});

const singleValueTests = valueTests.map(({ value, suggestions }) => ({
  values: [value],
  suggestions,
}));

const multiValueTests = [
  { values: [], suggestions: [] },
  { values: ["crystal", "math"], suggestions: [choices[1], choices[2]] },
  { values: ["No match", "abc"], suggestions: [choices[0]] },
  { values: ["abc", "crystal", "math", "123"], suggestions: choices },
];

const choicesTest = choices.map((_, index) => {
  const values = choices.slice(0, index + 1);
  return {
    values,
    suggestions: values,
  };
});

const valuesTests = [...singleValueTests, ...multiValueTests, ...choicesTest];

describe("valuesToSuggestions", () => {
  valuesTests.forEach((test) => {
    const { values, suggestions } = test;
    it(`with "${values.toString()}" it finds suggestions: "${suggestions.toString()}"`, () => {
      expect(valuesToSuggestions(values, choices)).toEqual(suggestions);
    });
  });
});
